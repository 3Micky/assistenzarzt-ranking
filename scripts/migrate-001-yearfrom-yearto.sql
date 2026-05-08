-- Migration 001: yearFrom + yearTo Spalten hinzufügen
-- Ausführen im Supabase SQL Editor (https://supabase.com → SQL Editor)

ALTER TABLE ratings
  ADD COLUMN IF NOT EXISTS "yearFrom" int,
  ADD COLUMN IF NOT EXISTS "yearTo"   text;

-- year-Spalte optional machen (wird durch yearFrom ersetzt)
ALTER TABLE ratings
  ALTER COLUMN year DROP NOT NULL;

-- region optional machen (bei Freitext-Eingaben manchmal leer)
ALTER TABLE ratings
  ALTER COLUMN region DROP NOT NULL;

-- specialty optional machen
ALTER TABLE ratings
  ALTER COLUMN specialty DROP NOT NULL;
