-- CHECK COLUMNS OF PARTNERS
-- Verify if logo_url and cover_url exist.

SELECT 
    column_name, 
    data_type 
FROM 
    information_schema.columns 
WHERE 
    table_name = 'partners';
