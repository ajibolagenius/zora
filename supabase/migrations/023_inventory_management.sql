-- =============================================================================
-- Migration: Automatic Inventory Management
-- Description: Adds triggers for automatic stock deduction on order confirmation
--              and stock restoration on order cancellation
-- =============================================================================

-- =============================================================================
-- Function: Deduct inventory when order is confirmed
-- =============================================================================
CREATE OR REPLACE FUNCTION deduct_inventory_on_order_confirmation()
RETURNS TRIGGER AS $$
DECLARE
    order_item RECORD;
BEGIN
    -- Only trigger when status changes TO 'confirmed' FROM 'pending'
    IF NEW.status = 'confirmed' AND (OLD.status = 'pending' OR OLD.status IS NULL) THEN
        -- Loop through all order items and deduct stock
        FOR order_item IN
            SELECT oi.product_id, oi.quantity
            FROM order_items oi
            WHERE oi.order_id = NEW.id
        LOOP
            -- Deduct stock from product
            UPDATE products
            SET
                stock_quantity = GREATEST(0, COALESCE(stock_quantity, 0) - order_item.quantity),
                in_stock = CASE
                    WHEN GREATEST(0, COALESCE(stock_quantity, 0) - order_item.quantity) > 0
                    THEN TRUE
                    ELSE FALSE
                END,
                updated_at = NOW()
            WHERE id = order_item.product_id;

            -- Log the inventory change (optional - for audit trail)
            RAISE NOTICE 'Deducted % units from product % for order %',
                order_item.quantity, order_item.product_id, NEW.id;
        END LOOP;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- Function: Restore inventory when order is cancelled
-- =============================================================================
CREATE OR REPLACE FUNCTION restore_inventory_on_order_cancellation()
RETURNS TRIGGER AS $$
DECLARE
    order_item RECORD;
BEGIN
    -- Only trigger when status changes TO 'cancelled' FROM a non-cancelled state
    -- Only restore if the order was previously confirmed (stock was deducted)
    IF NEW.status = 'cancelled' AND OLD.status != 'cancelled' AND OLD.status IN ('confirmed', 'preparing', 'ready', 'out_for_delivery') THEN
        -- Loop through all order items and restore stock
        FOR order_item IN
            SELECT oi.product_id, oi.quantity
            FROM order_items oi
            WHERE oi.order_id = NEW.id
        LOOP
            -- Restore stock to product
            UPDATE products
            SET
                stock_quantity = COALESCE(stock_quantity, 0) + order_item.quantity,
                in_stock = TRUE,
                updated_at = NOW()
            WHERE id = order_item.product_id;

            -- Log the inventory restoration
            RAISE NOTICE 'Restored % units to product % from cancelled order %',
                order_item.quantity, order_item.product_id, NEW.id;
        END LOOP;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- Function: Restore inventory when order is refunded
-- =============================================================================
CREATE OR REPLACE FUNCTION restore_inventory_on_order_refund()
RETURNS TRIGGER AS $$
DECLARE
    order_item RECORD;
BEGIN
    -- Only trigger when status changes TO 'refunded' FROM a confirmed state
    IF NEW.status = 'refunded' AND OLD.status != 'refunded' AND OLD.status IN ('confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered') THEN
        -- Loop through all order items and restore stock
        FOR order_item IN
            SELECT oi.product_id, oi.quantity
            FROM order_items oi
            WHERE oi.order_id = NEW.id
        LOOP
            -- Restore stock to product
            UPDATE products
            SET
                stock_quantity = COALESCE(stock_quantity, 0) + order_item.quantity,
                in_stock = TRUE,
                updated_at = NOW()
            WHERE id = order_item.product_id;

            -- Log the inventory restoration
            RAISE NOTICE 'Restored % units to product % from refunded order %',
                order_item.quantity, order_item.product_id, NEW.id;
        END LOOP;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- Drop existing triggers if they exist
-- =============================================================================
DROP TRIGGER IF EXISTS trigger_deduct_inventory_on_confirmation ON orders;
DROP TRIGGER IF EXISTS trigger_restore_inventory_on_cancellation ON orders;
DROP TRIGGER IF EXISTS trigger_restore_inventory_on_refund ON orders;

-- =============================================================================
-- Create triggers
-- =============================================================================

-- Trigger for deducting inventory on order confirmation
CREATE TRIGGER trigger_deduct_inventory_on_confirmation
    AFTER UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION deduct_inventory_on_order_confirmation();

-- Trigger for restoring inventory on order cancellation
CREATE TRIGGER trigger_restore_inventory_on_cancellation
    AFTER UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION restore_inventory_on_order_cancellation();

-- Trigger for restoring inventory on order refund
CREATE TRIGGER trigger_restore_inventory_on_refund
    AFTER UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION restore_inventory_on_order_refund();

-- =============================================================================
-- Add low_stock_threshold column if it doesn't exist
-- =============================================================================
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'products' AND column_name = 'low_stock_threshold'
    ) THEN
        ALTER TABLE products ADD COLUMN low_stock_threshold INTEGER DEFAULT 10;
    END IF;
END $$;

-- =============================================================================
-- Function: Check for low stock and create notification
-- =============================================================================
CREATE OR REPLACE FUNCTION check_low_stock_notification()
RETURNS TRIGGER AS $$
DECLARE
    vendor_user_id UUID;
    threshold INTEGER;
BEGIN
    -- Get the threshold (default to 10 if not set)
    threshold := COALESCE(NEW.low_stock_threshold, 10);

    -- Check if stock is below threshold and was previously above
    IF NEW.stock_quantity <= threshold AND
       (OLD.stock_quantity IS NULL OR OLD.stock_quantity > threshold) THEN

        -- Get the vendor's user_id
        SELECT user_id INTO vendor_user_id
        FROM vendors
        WHERE id = NEW.vendor_id;

        -- Create a notification for the vendor
        IF vendor_user_id IS NOT NULL THEN
            INSERT INTO notifications (
                user_id,
                type,
                title,
                message,
                data,
                created_at
            ) VALUES (
                vendor_user_id,
                'low_stock',
                'Low Stock Alert',
                format('Product "%s" has only %s units remaining', NEW.name, NEW.stock_quantity),
                jsonb_build_object(
                    'product_id', NEW.id,
                    'product_name', NEW.name,
                    'stock_quantity', NEW.stock_quantity,
                    'threshold', threshold
                ),
                NOW()
            );
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop and recreate the low stock trigger
DROP TRIGGER IF EXISTS trigger_check_low_stock ON products;

CREATE TRIGGER trigger_check_low_stock
    AFTER UPDATE OF stock_quantity ON products
    FOR EACH ROW
    EXECUTE FUNCTION check_low_stock_notification();

-- =============================================================================
-- Grant permissions
-- =============================================================================
GRANT EXECUTE ON FUNCTION deduct_inventory_on_order_confirmation() TO authenticated;
GRANT EXECUTE ON FUNCTION restore_inventory_on_order_cancellation() TO authenticated;
GRANT EXECUTE ON FUNCTION restore_inventory_on_order_refund() TO authenticated;
GRANT EXECUTE ON FUNCTION check_low_stock_notification() TO authenticated;

-- =============================================================================
-- Add comment for documentation
-- =============================================================================
COMMENT ON FUNCTION deduct_inventory_on_order_confirmation() IS
'Automatically deducts product stock when an order status changes to confirmed';

COMMENT ON FUNCTION restore_inventory_on_order_cancellation() IS
'Automatically restores product stock when a confirmed order is cancelled';

COMMENT ON FUNCTION restore_inventory_on_order_refund() IS
'Automatically restores product stock when an order is refunded';

COMMENT ON FUNCTION check_low_stock_notification() IS
'Creates a notification when product stock falls below the threshold';
