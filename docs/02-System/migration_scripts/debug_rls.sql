-- DIAGNOSTIC: debug_rls.sql
-- Run this to see what policies actually exist on the 'benefits' table.

SELECT schemaname, tablename, policyname, cmd, roles 
FROM pg_policies 
WHERE tablename = 'benefits';
