-- CHECK_SPECIFIC_ACADEMY_LINKS.sql
BEGIN;
DO $$
DECLARE
    target_academy_id uuid := '01e063a9-5e16-4f9f-ac02-05db0309debd'; -- ID from Logs
    link_count integer;
BEGIN
    RAISE NOTICE 'Checking links for Academy ID: %', target_academy_id;
    
    SELECT count(*) INTO link_count 
    FROM public.academy_partners 
    WHERE academy_id = target_academy_id 
    AND status = 'ACTIVE';
    
    RAISE NOTICE 'Active Links Found: %', link_count;
    
    -- List them if any
    IF link_count > 0 THEN
        PERFORM 1; -- Dummy
        RAISE NOTICE 'Listing Partners:';
        FOR target_academy_id IN SELECT partner_id FROM public.academy_partners WHERE academy_id = target_academy_id LOOP
             RAISE NOTICE ' - Partner ID: %', target_academy_id;
        END LOOP;
    END IF;
END $$;
COMMIT;
