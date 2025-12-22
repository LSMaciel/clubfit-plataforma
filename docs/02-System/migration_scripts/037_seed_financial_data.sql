-- Seed Financial Data for Testing Manual Renewal
-- Objective: Set due_day for existing academies so the UI shows data.

BEGIN;

-- Set Default Due Day = 10 for all academies
UPDATE public.academies
SET due_day = 10
WHERE due_day IS NULL;

-- Set Last Payment Date = NULL for 'ironberg' to simulate missing payment (Test Case)
-- Adjust 'ironberg' to whatever slug exists, or just leave one random one empty.
-- Here we just ensure everyone has a due day.

COMMIT;
