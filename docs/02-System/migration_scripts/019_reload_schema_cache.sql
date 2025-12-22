-- RELOAD SCHEMA CACHE
-- DESCRIPTION: Forces Supabase API to recognize new columns/tables.
--              Run this whenever you add columns but the API returns "Could not find column".

NOTIFY pgrst, 'reload schema';
