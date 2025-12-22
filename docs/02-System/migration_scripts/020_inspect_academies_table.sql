-- INSPECT ACADEMIES TABLE
-- DESCRIPTION: Lists all columns in the 'academies' table to verify if theme columns exist.

SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM 
    information_schema.columns
WHERE 
    table_name = 'academies'
ORDER BY 
    column_name;
