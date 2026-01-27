-- Migration to add Notifications and Trigger for Orders

-- 1. Create Notifications Table (if not exists)
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    user_id UUID REFERENCES public.profiles (id) ON DELETE CASCADE,
    type TEXT CHECK (
        type IN (
            'order',
            'promo',
            'review',
            'reward',
            'system'
        )
    ),
    title TEXT NOT NULL,
    description TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    action_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;

DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;

CREATE POLICY "Users can view own notifications" ON public.notifications FOR
SELECT USING (auth.uid () = user_id);

CREATE POLICY "Users can update own notifications" ON public.notifications FOR
UPDATE USING (auth.uid () = user_id);

-- 2. Create Trigger Function
CREATE OR REPLACE FUNCTION public.handle_order_status_update()
RETURNS TRIGGER AS $$
DECLARE
    notification_title TEXT;
    notification_body TEXT;
BEGIN
    -- Only trigger if status has changed
    IF NEW.status = OLD.status THEN
        RETURN NEW;
    END IF;

    -- Define notification content based on new status
    IF NEW.status = 'preparing' THEN
        notification_title := 'Order is being prepared';
        notification_body := 'Your order is being prepared by the vendor.';
    ELSIF NEW.status = 'ready' THEN
        notification_title := 'Order is ready';
        notification_body := 'Your order is ready for pickup or delivery.';
    ELSIF NEW.status = 'out_for_delivery' THEN
        notification_title := 'Order Out for Delivery';
        notification_body := 'Your order is on the way! Track your package.';
    ELSIF NEW.status = 'delivered' THEN
        notification_title := 'Order Delivered';
        notification_body := 'Your order has been delivered. Enjoy!';
    ELSIF NEW.status = 'cancelled' THEN
        notification_title := 'Order Cancelled';
        notification_body := 'Your order has been cancelled.';
    ELSE
        -- Default or other statuses (pending, confirmed) might not need notification
        RETURN NEW;
    END IF;

    -- Insert notification
    INSERT INTO public.notifications (user_id, type, title, description, action_url)
    VALUES (
        NEW.user_id, 
        'order', 
        notification_title, 
        notification_body, 
        '/order-tracking/' || NEW.id
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Create Trigger on Orders Table
DROP TRIGGER IF EXISTS on_order_status_update ON public.orders;

CREATE TRIGGER on_order_status_update
    AFTER UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_order_status_update();