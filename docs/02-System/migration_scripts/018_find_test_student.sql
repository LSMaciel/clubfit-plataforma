-- FIND TEST STUDENT
SELECT id, full_name, cpf, email, status 
FROM public.students 
WHERE full_name ILIKE '%teste%' OR cpf = '12345678900'
LIMIT 5;
