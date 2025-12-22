-- DIAGNOSTIC: 015_diagnose_schema.sql
-- DESCRIPTION: Checks if 'categories' table exists and lists its columns.
--              Helps us decide if we can drop it or need to alter it.

SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM 
    information_schema.columns
WHERE 
    table_name = 'categories';

-- Check if there is data
SELECT count(*) as total_rows FROM public.categories;
