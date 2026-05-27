-- Store the guest's locale on the request row so emails (confirmation,
-- first-response notification, future reminders) can be rendered in their
-- preferred language without re-querying or re-detecting from headers.

ALTER TABLE availability_requests
  ADD COLUMN IF NOT EXISTS locale TEXT NOT NULL DEFAULT 'el';

-- Constrain to the 7 supported locales (matching i18n/config.ts)
ALTER TABLE availability_requests
  DROP CONSTRAINT IF EXISTS availability_requests_locale_check;
ALTER TABLE availability_requests
  ADD CONSTRAINT availability_requests_locale_check
  CHECK (locale IN ('el', 'en', 'de', 'bg', 'ru', 'ro', 'sr'));
