-- Optimization: Replace auth.uid() with (select auth.uid()) to prevent per-row evaluation
-- Optimization: Replace auth.role() with (select auth.role())
-- See: https://supabase.com/docs/guides/database/database-linter?lint=0003_auth_rls_initplan

BEGIN;

-- profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

CREATE POLICY "Users can view own profile" ON public.profiles FOR
SELECT USING (
        (
            select auth.uid ()
        ) = id
    );

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can update own profile" ON public.profiles FOR
UPDATE USING (
    (
        select auth.uid ()
    ) = id
);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

CREATE POLICY "Users can insert own profile" ON public.profiles FOR
INSERT
WITH
    CHECK (
        (
            select auth.uid ()
        ) = id
    );

-- vendors
DROP POLICY IF EXISTS "Vendors can update own profile" ON public.vendors;

CREATE POLICY "Vendors can update own profile" ON public.vendors FOR
UPDATE USING (
    (
        select auth.uid ()
    ) = user_id
);

DROP POLICY IF EXISTS "Vendors can insert own profile" ON public.vendors;

CREATE POLICY "Vendors can insert own profile" ON public.vendors FOR
INSERT
WITH
    CHECK (
        (
            select auth.uid ()
        ) = user_id
    );

-- products
DROP POLICY IF EXISTS "Vendors can manage own products" ON public.products;

CREATE POLICY "Vendors can manage own products" ON public.products FOR ALL USING (
    EXISTS (
        SELECT 1
        FROM vendors
        WHERE
            vendors.id = products.vendor_id
            AND vendors.user_id = (
                select auth.uid ()
            )
    )
);

-- addresses
DROP POLICY IF EXISTS "Users can view own addresses" ON public.addresses;

CREATE POLICY "Users can view own addresses" ON public.addresses FOR
SELECT USING (
        (
            select auth.uid ()
        ) = user_id
    );

DROP POLICY IF EXISTS "Users can insert own addresses" ON public.addresses;

CREATE POLICY "Users can insert own addresses" ON public.addresses FOR
INSERT
WITH
    CHECK (
        (
            select auth.uid ()
        ) = user_id
    );

DROP POLICY IF EXISTS "Users can update own addresses" ON public.addresses;

CREATE POLICY "Users can update own addresses" ON public.addresses FOR
UPDATE USING (
    (
        select auth.uid ()
    ) = user_id
);

DROP POLICY IF EXISTS "Users can delete own addresses" ON public.addresses;

CREATE POLICY "Users can delete own addresses" ON public.addresses FOR DELETE USING (
    (
        select auth.uid ()
    ) = user_id
);

-- cart_items
DROP POLICY IF EXISTS "Users can view own cart items" ON public.cart_items;

CREATE POLICY "Users can view own cart items" ON public.cart_items FOR
SELECT USING (
        (
            select auth.uid ()
        ) = user_id
    );

DROP POLICY IF EXISTS "Users can insert own cart items" ON public.cart_items;

CREATE POLICY "Users can insert own cart items" ON public.cart_items FOR
INSERT
WITH
    CHECK (
        (
            select auth.uid ()
        ) = user_id
    );

DROP POLICY IF EXISTS "Users can update own cart items" ON public.cart_items;

CREATE POLICY "Users can update own cart items" ON public.cart_items FOR
UPDATE USING (
    (
        select auth.uid ()
    ) = user_id
);

DROP POLICY IF EXISTS "Users can delete own cart items" ON public.cart_items;

CREATE POLICY "Users can delete own cart items" ON public.cart_items FOR DELETE USING (
    (
        select auth.uid ()
    ) = user_id
);

-- orders
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;

CREATE POLICY "Users can view own orders" ON public.orders FOR
SELECT USING (
        (
            select auth.uid ()
        ) = user_id
    );

DROP POLICY IF EXISTS "Users can create orders" ON public.orders;

CREATE POLICY "Users can create orders" ON public.orders FOR
INSERT
WITH
    CHECK (
        (
            select auth.uid ()
        ) = user_id
    );

DROP POLICY IF EXISTS "Vendors can view shop orders" ON public.orders;

CREATE POLICY "Vendors can view shop orders" ON public.orders FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM vendors
            WHERE
                vendors.id = orders.vendor_id
                AND vendors.user_id = (
                    select auth.uid ()
                )
        )
    );

-- order_items
DROP POLICY IF EXISTS "Users can view own order items" ON public.order_items;

CREATE POLICY "Users can view own order items" ON public.order_items FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM orders
            WHERE
                orders.id = order_items.order_id
                AND orders.user_id = (
                    select auth.uid ()
                )
        )
    );

DROP POLICY IF EXISTS "Vendors can view shop order items" ON public.order_items;

CREATE POLICY "Vendors can view shop order items" ON public.order_items FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM orders
                JOIN vendors ON vendors.id = orders.vendor_id
            WHERE
                orders.id = order_items.order_id
                AND vendors.user_id = (
                    select auth.uid ()
                )
        )
    );

-- reviews
DROP POLICY IF EXISTS "Users can create reviews" ON public.reviews;

CREATE POLICY "Users can create reviews" ON public.reviews FOR
INSERT
WITH
    CHECK (
        (
            select auth.uid ()
        ) = user_id
    );

DROP POLICY IF EXISTS "Users can update own reviews" ON public.reviews;

CREATE POLICY "Users can update own reviews" ON public.reviews FOR
UPDATE USING (
    (
        select auth.uid ()
    ) = user_id
);

-- promo_codes
DROP POLICY IF EXISTS "Promo codes viewable by authenticated users" ON public.promo_codes;

CREATE POLICY "Promo codes viewable by authenticated users" ON public.promo_codes FOR
SELECT USING (
        (
            select auth.role ()
        ) = 'authenticated'
    );

-- notifications
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;

CREATE POLICY "Users can view own notifications" ON public.notifications FOR
SELECT USING (
        (
            select auth.uid ()
        ) = user_id
    );

DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;

CREATE POLICY "Users can update own notifications" ON public.notifications FOR
UPDATE USING (
    (
        select auth.uid ()
    ) = user_id
);

-- wishlist_items
DROP POLICY IF EXISTS "Users can view own wishlist" ON public.wishlist_items;

CREATE POLICY "Users can view own wishlist" ON public.wishlist_items FOR
SELECT USING (
        (
            select auth.uid ()
        ) = user_id
    );

DROP POLICY IF EXISTS "Users can add to own wishlist" ON public.wishlist_items;

CREATE POLICY "Users can add to own wishlist" ON public.wishlist_items FOR
INSERT
WITH
    CHECK (
        (
            select auth.uid ()
        ) = user_id
    );

DROP POLICY IF EXISTS "Users can remove from own wishlist" ON public.wishlist_items;

CREATE POLICY "Users can remove from own wishlist" ON public.wishlist_items FOR DELETE USING (
    (
        select auth.uid ()
    ) = user_id
);

-- vendor_follows
DROP POLICY IF EXISTS "Users can view own follows" ON public.vendor_follows;

CREATE POLICY "Users can view own follows" ON public.vendor_follows FOR
SELECT USING (
        (
            select auth.uid ()
        ) = user_id
    );

DROP POLICY IF EXISTS "Users can create own follows" ON public.vendor_follows;

CREATE POLICY "Users can create own follows" ON public.vendor_follows FOR
INSERT
WITH
    CHECK (
        (
            select auth.uid ()
        ) = user_id
    );

DROP POLICY IF EXISTS "Users can delete own follows" ON public.vendor_follows;

CREATE POLICY "Users can delete own follows" ON public.vendor_follows FOR DELETE USING (
    (
        select auth.uid ()
    ) = user_id
);

-- conversations
DROP POLICY IF EXISTS "Users can view own conversations" ON public.conversations;

CREATE POLICY "Users can view own conversations" ON public.conversations FOR
SELECT USING (
        (
            select auth.uid ()
        ) = user_id
    );

DROP POLICY IF EXISTS "Vendors can view own conversations" ON public.conversations;

CREATE POLICY "Vendors can view own conversations" ON public.conversations FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM vendors
            WHERE
                vendors.id = conversations.vendor_id
                AND vendors.user_id = (
                    select auth.uid ()
                )
        )
    );

DROP POLICY IF EXISTS "Users can create conversations" ON public.conversations;

CREATE POLICY "Users can create conversations" ON public.conversations FOR
INSERT
WITH
    CHECK (
        (
            select auth.uid ()
        ) = user_id
    );

DROP POLICY IF EXISTS "Users can update own conversations" ON public.conversations;

CREATE POLICY "Users can update own conversations" ON public.conversations FOR
UPDATE USING (
    (
        select auth.uid ()
    ) = user_id
);

DROP POLICY IF EXISTS "Vendors can update own conversations" ON public.conversations;

CREATE POLICY "Vendors can update own conversations" ON public.conversations FOR
UPDATE USING (
    EXISTS (
        SELECT 1
        FROM vendors
        WHERE
            vendors.id = conversations.vendor_id
            AND vendors.user_id = (
                select auth.uid ()
            )
    )
);

DROP POLICY IF EXISTS "Users can view support conversations" ON public.conversations;

CREATE POLICY "Users can view support conversations" ON public.conversations FOR
SELECT USING (
        conversation_type = 'support'
        AND (
            select auth.uid ()
        ) = user_id
    );

DROP POLICY IF EXISTS "Users can create support conversations" ON public.conversations;

CREATE POLICY "Users can create support conversations" ON public.conversations FOR
INSERT
WITH
    CHECK (
        conversation_type = 'support'
        AND (
            select auth.uid ()
        ) = user_id
        AND EXISTS (
            SELECT 1
            FROM orders
            WHERE
                orders.id = conversations.order_id
                AND orders.user_id = (
                    select auth.uid ()
                )
        )
    );

DROP POLICY IF EXISTS "Support agents can view support conversations" ON public.conversations;

CREATE POLICY "Support agents can view support conversations" ON public.conversations FOR SELECT USING (
  conversation_type = 'support' 
  AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = (select auth.uid()) 
    AND profiles.role = ANY (ARRAY['admin', 'support'])
  )
);

DROP POLICY IF EXISTS "Support agents can update support conversations" ON public.conversations;

CREATE POLICY "Support agents can update support conversations" ON public.conversations FOR UPDATE USING (
  conversation_type = 'support' 
  AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = (select auth.uid()) 
    AND profiles.role = ANY (ARRAY['admin', 'support'])
  )
);

-- disputes
DROP POLICY IF EXISTS "Users can view own disputes" ON public.disputes;

CREATE POLICY "Users can view own disputes" ON public.disputes FOR
SELECT USING (
        (
            select auth.uid ()
        ) = user_id
    );

DROP POLICY IF EXISTS "Users can create disputes" ON public.disputes;

CREATE POLICY "Users can create disputes" ON public.disputes FOR
INSERT
WITH
    CHECK (
        (
            select auth.uid ()
        ) = user_id
        AND EXISTS (
            SELECT 1
            FROM orders
            WHERE
                orders.id = disputes.order_id
                AND orders.user_id = (
                    select auth.uid ()
                )
        )
    );

DROP POLICY IF EXISTS "Users can update own pending disputes" ON public.disputes;

CREATE POLICY "Users can update own pending disputes" ON public.disputes FOR
UPDATE USING (
    (
        select auth.uid ()
    ) = user_id
    AND status = 'pending'
);

DROP POLICY IF EXISTS "Vendors can view shop disputes" ON public.disputes;

CREATE POLICY "Vendors can view shop disputes" ON public.disputes FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM orders
                JOIN vendors ON vendors.id = orders.vendor_id
            WHERE
                orders.id = disputes.order_id
                AND vendors.user_id = (
                    select auth.uid ()
                )
        )
    );

DROP POLICY IF EXISTS "Admins can manage all disputes" ON public.disputes;

CREATE POLICY "Admins can manage all disputes" ON public.disputes FOR ALL USING (
    EXISTS (
        SELECT 1
        FROM profiles
        WHERE
            profiles.id = (
                select auth.uid ()
            )
            AND profiles.role = 'admin'
    )
);

-- messages
DROP POLICY IF EXISTS "Users can view own messages" ON public.messages;

CREATE POLICY "Users can view own messages" ON public.messages FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM conversations
            WHERE
                conversations.id = messages.conversation_id
                AND conversations.user_id = (
                    select auth.uid ()
                )
        )
    );

DROP POLICY IF EXISTS "Users can create messages" ON public.messages;

CREATE POLICY "Users can create messages" ON public.messages FOR
INSERT
WITH
    CHECK (
        sender_type = 'user'
        AND sender_id = (
            select auth.uid ()
        )
        AND EXISTS (
            SELECT 1
            FROM conversations
            WHERE
                conversations.id = messages.conversation_id
                AND conversations.user_id = (
                    select auth.uid ()
                )
        )
    );

DROP POLICY IF EXISTS "Users can update own messages" ON public.messages;

CREATE POLICY "Users can update own messages" ON public.messages FOR
UPDATE USING (
    sender_type = 'user'
    AND EXISTS (
        SELECT 1
        FROM conversations
        WHERE
            conversations.id = messages.conversation_id
            AND conversations.user_id = (
                select auth.uid ()
            )
    )
);

DROP POLICY IF EXISTS "Vendors can view own messages" ON public.messages;

CREATE POLICY "Vendors can view own messages" ON public.messages FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM conversations
                JOIN vendors ON vendors.id = conversations.vendor_id
            WHERE
                conversations.id = messages.conversation_id
                AND vendors.user_id = (
                    select auth.uid ()
                )
        )
    );

DROP POLICY IF EXISTS "Vendors can update own messages" ON public.messages;

CREATE POLICY "Vendors can update own messages" ON public.messages FOR
UPDATE USING (
    sender_type = 'vendor'
    AND EXISTS (
        SELECT 1
        FROM conversations
            JOIN vendors ON vendors.id = conversations.vendor_id
        WHERE
            conversations.id = messages.conversation_id
            AND vendors.user_id = (
                select auth.uid ()
            )
    )
);

DROP POLICY IF EXISTS "Vendors can create messages" ON public.messages;

CREATE POLICY "Vendors can create messages" ON public.messages FOR
INSERT
WITH
    CHECK (
        sender_type = 'vendor'
        AND EXISTS (
            SELECT 1
            FROM conversations
                JOIN vendors ON vendors.id = conversations.vendor_id
            WHERE
                conversations.id = messages.conversation_id
                AND vendors.user_id = (
                    select auth.uid ()
                )
                AND conversations.vendor_id = messages.sender_id
        )
    );

DROP POLICY IF EXISTS "Support agents can create messages" ON public.messages;

CREATE POLICY "Support agents can create messages" ON public.messages FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = (select auth.uid()) 
    AND profiles.role = ANY (ARRAY['admin', 'support'])
  )
);

DROP POLICY IF EXISTS "Support agents can view support messages" ON public.messages;

CREATE POLICY "Support agents can view support messages" ON public.messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = (select auth.uid()) 
    AND profiles.role = ANY (ARRAY['admin', 'support'])
  )
);

COMMIT;