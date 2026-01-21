-- CHECK TABLES SCRIPT
-- Run this to see what tables ACTUALLY exist in the text.

SELECT table_schema, table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Try selecting without the 'public.' prefix, maybe schema is different?
SELECT * FROM partners LIMIT 1;
