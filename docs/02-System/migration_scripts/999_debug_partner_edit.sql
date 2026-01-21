-- DEBUG SCRIPT FOR PARTNER EDIT ERROR
-- Run this in Supabase SQL Editor to investigate why "Partner not found" is occurring.

-- TARGET ID (From Screenshot): 793f15b9-10c7-45e9-9e60-d2355bd73d82

-- 1. Verify if the Partner record technically exists
-- If this returns no rows, the ID is wrong or the record was deleted.
SELECT * FROM public.partners WHERE id = '793f15b9-10c7-45e9-9e60-d2355bd73d82';

-- 2. Check the Owner ID and if the linked User exists
-- The application code tries to join 'partners' with 'users'. If the relation is broken, it fails.
SELECT 
    p.id as partner_id, 
    p.name as partner_name, 
    p.owner_id, 
    u.id as user_id, 
    u.email, 
    u.name as user_name
FROM public.partners p
LEFT JOIN public.users u ON p.owner_id = u.id
WHERE p.id = '793f15b9-10c7-45e9-9e60-d2355bd73d82';

-- 3. Check specific Foreign Key definitions on the 'partners' table
-- We need to know the EXACT name of the foreign key constraint to reference it correctly in Supabase/PostgREST.
SELECT
    tc.constraint_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name='partners';
