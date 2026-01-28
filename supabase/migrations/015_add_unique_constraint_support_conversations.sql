-- Add unique constraint to prevent duplicate support conversations for the same order
-- This ensures only one support conversation exists per order per user

-- First, remove any duplicate support conversations (keep the oldest one)
WITH duplicates AS (
    SELECT id,
           ROW_NUMBER() OVER (PARTITION BY user_id, order_id ORDER BY created_at ASC) as rn
    FROM public.conversations
    WHERE conversation_type = 'support'
      AND order_id IS NOT NULL
)
DELETE FROM public.conversations
WHERE id IN (
    SELECT id FROM duplicates WHERE rn > 1
);

-- Add unique constraint for support conversations
-- This prevents creating multiple support conversations for the same order
CREATE UNIQUE INDEX IF NOT EXISTS idx_conversations_unique_support 
ON public.conversations(user_id, order_id) 
WHERE conversation_type = 'support' AND order_id IS NOT NULL;

-- Add comment for documentation
COMMENT ON INDEX idx_conversations_unique_support IS 
'Ensures only one support conversation exists per order per user';
