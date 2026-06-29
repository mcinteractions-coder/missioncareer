-- Add counseling mode to bookings so offline and online can share the same time slot
ALTER TABLE public.bookings ADD COLUMN mode TEXT NOT NULL DEFAULT 'offline';

-- Drop old unique constraint that only allowed one booking per time slot total
ALTER TABLE public.bookings DROP CONSTRAINT IF EXISTS bookings_slot_date_slot_time_key;

-- Add new unique constraint scoped by mode (offline & online each have their own slots)
ALTER TABLE public.bookings ADD CONSTRAINT bookings_slot_date_slot_time_mode_key UNIQUE (slot_date, slot_time, mode);