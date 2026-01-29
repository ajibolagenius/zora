-- =============================================================================
-- MIGRATION: Vendor Order Notifications
-- Version: 020
-- Description: Create triggers to automatically notify vendors of new orders
--              and notify customers of order status changes
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Function: Notify vendor when a new order is placed
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.notify_vendor_new_order()
RETURNS TRIGGER AS $$
DECLARE
    v_vendor_user_id UUID;
    v_customer_name TEXT;
    v_order_total TEXT;
BEGIN
    -- Get the vendor's user_id
    SELECT user_id INTO v_vendor_user_id
    FROM public.vendors
    WHERE id = NEW.vendor_id;

    -- Get customer name
    SELECT COALESCE(full_name, email, 'Customer') INTO v_customer_name
    FROM public.profiles
    WHERE id = NEW.user_id;

    -- Format the total
    v_order_total := '£' || ROUND(NEW.total::numeric, 2)::TEXT;

    -- Only create notification if vendor user exists
    IF v_vendor_user_id IS NOT NULL THEN
        INSERT INTO public.notifications (
            user_id,
            type,
            title,
            description,
            action_url,
            is_read
        ) VALUES (
            v_vendor_user_id,
            'order',
            'New Order Received!',
            'New order from ' || v_customer_name || ' worth ' || v_order_total,
            '/orders/' || NEW.id,
            FALSE
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new orders
DROP TRIGGER IF EXISTS trigger_notify_vendor_new_order ON public.orders;
CREATE TRIGGER trigger_notify_vendor_new_order
    AFTER INSERT ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.notify_vendor_new_order();

-- -----------------------------------------------------------------------------
-- Function: Notify customer when order status changes
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.notify_customer_order_status()
RETURNS TRIGGER AS $$
DECLARE
    v_notification_title TEXT;
    v_notification_desc TEXT;
    v_order_number TEXT;
BEGIN
    -- Only trigger if status actually changed
    IF OLD.status = NEW.status THEN
        RETURN NEW;
    END IF;

    -- Get order number or use ID
    v_order_number := COALESCE(NEW.qr_code, LEFT(NEW.id::TEXT, 8));

    -- Set notification content based on new status
    CASE NEW.status
        WHEN 'confirmed' THEN
            v_notification_title := 'Order Confirmed';
            v_notification_desc := 'Your order #' || v_order_number || ' has been confirmed by the vendor.';
        WHEN 'preparing' THEN
            v_notification_title := 'Order Being Prepared';
            v_notification_desc := 'Your order #' || v_order_number || ' is now being prepared.';
        WHEN 'ready' THEN
            v_notification_title := 'Order Ready';
            v_notification_desc := 'Your order #' || v_order_number || ' is ready for pickup/delivery.';
        WHEN 'out_for_delivery' THEN
            v_notification_title := 'Out for Delivery';
            v_notification_desc := 'Your order #' || v_order_number || ' is on its way!';
        WHEN 'delivered' THEN
            v_notification_title := 'Order Delivered';
            v_notification_desc := 'Your order #' || v_order_number || ' has been delivered. Enjoy!';
        WHEN 'cancelled' THEN
            v_notification_title := 'Order Cancelled';
            v_notification_desc := 'Your order #' || v_order_number || ' has been cancelled.';
        ELSE
            -- Don't send notification for other statuses
            RETURN NEW;
    END CASE;

    -- Create notification for customer
    INSERT INTO public.notifications (
        user_id,
        type,
        title,
        description,
        action_url,
        is_read
    ) VALUES (
        NEW.user_id,
        'order',
        v_notification_title,
        v_notification_desc,
        '/order-tracking/' || NEW.id,
        FALSE
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for order status changes
DROP TRIGGER IF EXISTS trigger_notify_customer_order_status ON public.orders;
CREATE TRIGGER trigger_notify_customer_order_status
    AFTER UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.notify_customer_order_status();

-- -----------------------------------------------------------------------------
-- Function: Notify vendor when application status changes
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.notify_vendor_application_status()
RETURNS TRIGGER AS $$
DECLARE
    v_notification_title TEXT;
    v_notification_desc TEXT;
BEGIN
    -- Only trigger if status actually changed
    IF OLD.status = NEW.status THEN
        RETURN NEW;
    END IF;

    -- Only notify if user_id exists
    IF NEW.user_id IS NULL THEN
        RETURN NEW;
    END IF;

    -- Set notification content based on new status
    CASE NEW.status
        WHEN 'under_review' THEN
            v_notification_title := 'Application Under Review';
            v_notification_desc := 'Your vendor application is now being reviewed by our team.';
        WHEN 'documents_required' THEN
            v_notification_title := 'Documents Required';
            v_notification_desc := 'Additional documents are required for your vendor application.';
        WHEN 'approved' THEN
            v_notification_title := 'Application Approved!';
            v_notification_desc := 'Congratulations! Your vendor application has been approved. You can now start selling on Zora.';
        WHEN 'rejected' THEN
            v_notification_title := 'Application Update';
            v_notification_desc := 'Your vendor application status has been updated. Please check your application for details.';
        ELSE
            RETURN NEW;
    END CASE;

    -- Create notification
    INSERT INTO public.notifications (
        user_id,
        type,
        title,
        description,
        action_url,
        is_read
    ) VALUES (
        NEW.user_id,
        'system',
        v_notification_title,
        v_notification_desc,
        '/vendor-application/' || NEW.id,
        FALSE
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for vendor application status changes
DROP TRIGGER IF EXISTS trigger_notify_vendor_application_status ON public.vendor_applications;
CREATE TRIGGER trigger_notify_vendor_application_status
    AFTER UPDATE ON public.vendor_applications
    FOR EACH ROW
    EXECUTE FUNCTION public.notify_vendor_application_status();

-- -----------------------------------------------------------------------------
-- Function: Notify when new review is posted (for vendor)
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.notify_vendor_new_review()
RETURNS TRIGGER AS $$
DECLARE
    v_vendor_user_id UUID;
    v_reviewer_name TEXT;
    v_product_name TEXT;
BEGIN
    -- Get vendor's user_id
    SELECT user_id INTO v_vendor_user_id
    FROM public.vendors
    WHERE id = NEW.vendor_id;

    -- Get reviewer name
    SELECT COALESCE(full_name, 'A customer') INTO v_reviewer_name
    FROM public.profiles
    WHERE id = NEW.user_id;

    -- Get product name if product review
    IF NEW.product_id IS NOT NULL THEN
        SELECT name INTO v_product_name
        FROM public.products
        WHERE id = NEW.product_id;
    END IF;

    -- Create notification for vendor
    IF v_vendor_user_id IS NOT NULL THEN
        INSERT INTO public.notifications (
            user_id,
            type,
            title,
            description,
            action_url,
            is_read
        ) VALUES (
            v_vendor_user_id,
            'review',
            'New ' || NEW.rating || '-Star Review',
            v_reviewer_name || ' left a review' ||
                CASE WHEN v_product_name IS NOT NULL
                    THEN ' for ' || v_product_name
                    ELSE ' for your shop'
                END,
            CASE WHEN NEW.product_id IS NOT NULL
                THEN '/products/' || NEW.product_id || '#reviews'
                ELSE '/shop/reviews'
            END,
            FALSE
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new reviews
DROP TRIGGER IF EXISTS trigger_notify_vendor_new_review ON public.reviews;
CREATE TRIGGER trigger_notify_vendor_new_review
    AFTER INSERT ON public.reviews
    FOR EACH ROW
    EXECUTE FUNCTION public.notify_vendor_new_review();

-- -----------------------------------------------------------------------------
-- Comments
-- -----------------------------------------------------------------------------

COMMENT ON FUNCTION public.notify_vendor_new_order IS 'Creates notification for vendor when new order is placed';
COMMENT ON FUNCTION public.notify_customer_order_status IS 'Creates notification for customer when order status changes';
COMMENT ON FUNCTION public.notify_vendor_application_status IS 'Creates notification when vendor application status changes';
COMMENT ON FUNCTION public.notify_vendor_new_review IS 'Creates notification for vendor when new review is posted';
