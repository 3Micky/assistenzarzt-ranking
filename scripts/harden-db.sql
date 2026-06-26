-- Security hardening migration for Assistenz-Ranking.
-- The owner runs this file manually in the Supabase SQL Editor after deploying
-- the protected /api/ratings write route and configuring its server env vars.

BEGIN;

-- New ratings may only be inserted by the server-side service-role client.
REVOKE INSERT ON TABLE public.ratings FROM anon;
DROP POLICY IF EXISTS "ratings_insert_all" ON public.ratings;
GRANT SELECT ON TABLE public.ratings TO anon;

-- Constraints are NOT VALID so legacy rows do not block this migration.
-- PostgreSQL still enforces every constraint for all new or changed rows.
ALTER TABLE public.ratings
  DROP CONSTRAINT IF EXISTS ratings_country_check,
  DROP CONSTRAINT IF EXISTS ratings_hospital_length_check,
  DROP CONSTRAINT IF EXISTS ratings_city_length_check,
  DROP CONSTRAINT IF EXISTS ratings_region_length_check,
  DROP CONSTRAINT IF EXISTS ratings_specialty_length_check,
  DROP CONSTRAINT IF EXISTS ratings_comment_length_check,
  DROP CONSTRAINT IF EXISTS ratings_year_check,
  DROP CONSTRAINT IF EXISTS ratings_year_from_check,
  DROP CONSTRAINT IF EXISTS ratings_year_to_check,
  DROP CONSTRAINT IF EXISTS ratings_year_order_check,
  DROP CONSTRAINT IF EXISTS ratings_criteria_object_check,
  DROP CONSTRAINT IF EXISTS ratings_criteria_keys_check,
  DROP CONSTRAINT IF EXISTS ratings_criteria_numeric_ranges_check,
  DROP CONSTRAINT IF EXISTS ratings_benefits_length_check,
  DROP CONSTRAINT IF EXISTS ratings_rotations_text_length_check;

CREATE OR REPLACE FUNCTION public.rating_number_in_range(
  payload jsonb,
  criterion_key text,
  minimum_value numeric,
  maximum_value numeric
)
RETURNS boolean
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT CASE
    WHEN NOT (payload ? criterion_key) OR payload->criterion_key = 'null'::jsonb THEN true
    WHEN jsonb_typeof(payload->criterion_key) <> 'number' THEN false
    ELSE (payload->>criterion_key)::numeric BETWEEN minimum_value AND maximum_value
  END
$$;

ALTER TABLE public.ratings
  ADD CONSTRAINT ratings_country_check
    CHECK (country IN ('DE', 'AT', 'CH')) NOT VALID,
  ADD CONSTRAINT ratings_hospital_length_check
    CHECK (char_length(hospital) BETWEEN 1 AND 200) NOT VALID,
  ADD CONSTRAINT ratings_city_length_check
    CHECK (char_length(city) BETWEEN 1 AND 100) NOT VALID,
  ADD CONSTRAINT ratings_region_length_check
    CHECK (region IS NOT NULL AND char_length(region) BETWEEN 1 AND 100) NOT VALID,
  ADD CONSTRAINT ratings_specialty_length_check
    CHECK (specialty IS NOT NULL AND char_length(specialty) BETWEEN 1 AND 100) NOT VALID,
  ADD CONSTRAINT ratings_comment_length_check
    CHECK (char_length(COALESCE(comment, '')) <= 2000) NOT VALID,
  ADD CONSTRAINT ratings_year_check
    CHECK (year IS NULL OR year BETWEEN 2000 AND EXTRACT(YEAR FROM CURRENT_DATE)::int + 1) NOT VALID,
  ADD CONSTRAINT ratings_year_from_check
    CHECK (
      "yearFrom" IS NOT NULL
      AND "yearFrom" BETWEEN 2000 AND EXTRACT(YEAR FROM CURRENT_DATE)::int + 1
    ) NOT VALID,
  ADD CONSTRAINT ratings_year_to_check
    CHECK (
      "yearTo" IS NOT NULL
      AND (
        "yearTo" = 'fortlaufend'
      OR CASE
        WHEN "yearTo" ~ '^[0-9]{4}$'
          THEN "yearTo"::int BETWEEN 2000 AND EXTRACT(YEAR FROM CURRENT_DATE)::int + 1
        ELSE false
      END
      )
    ) NOT VALID,
  ADD CONSTRAINT ratings_year_order_check
    CHECK (
      "yearTo" = 'fortlaufend'
      OR CASE
        WHEN "yearTo" ~ '^[0-9]{4}$' THEN "yearTo"::int >= "yearFrom"
        ELSE false
      END
    ) NOT VALID,
  ADD CONSTRAINT ratings_criteria_object_check
    CHECK (jsonb_typeof(criteria) = 'object') NOT VALID,
  ADD CONSTRAINT ratings_criteria_keys_check
    CHECK (
      criteria - ARRAY[
        'arbeitszeitenVon', 'arbeitszeitenBis', 'diensteProMonat', 'schichtsystem',
        'ueberstundenAufschreiben', 'ueberstundenAusgleich', 'abteilungsgroesse',
        'personalschluessel', 'wbeJahre', 'opsProMonat', 'rotationsplaene',
        'rotationsplaeneText', 'nachtdienstBegleitung', 'fortbildungFreistellung',
        'fortbildungBezahlt', 'lehreTaetig', 'lehreFreistellung',
        'logbuchErfuellbarkeit', 'supervisionQualitaet', 'autonomie',
        'hauptoperateurAnteil', 'mitarbeitergespraeche', 'dokumentationsaufwand',
        'urlaubsgenehmigung', 'workLifeBalance', 'teamAtmosphaere',
        'schwangerschaft', 'schwangerschaftFamilienfreundlich', 'parkplatz', 'benefits',
        'diskriminierung', 'diskriminierungAnsprechperson', 'diskriminierungKlaerung'
      ]::text[] = '{}'::jsonb
    ) NOT VALID,
  ADD CONSTRAINT ratings_criteria_numeric_ranges_check
    CHECK (
      public.rating_number_in_range(criteria, 'diensteProMonat', 0, 15)
      AND public.rating_number_in_range(criteria, 'abteilungsgroesse', 1, 500)
      AND public.rating_number_in_range(criteria, 'personalschluessel', 1, 100)
      AND public.rating_number_in_range(criteria, 'wbeJahre', 0, 12)
      AND public.rating_number_in_range(criteria, 'opsProMonat', 0, 50)
      AND public.rating_number_in_range(criteria, 'nachtdienstBegleitung', 1, 10)
      AND public.rating_number_in_range(criteria, 'logbuchErfuellbarkeit', 1, 10)
      AND public.rating_number_in_range(criteria, 'supervisionQualitaet', 1, 10)
      AND public.rating_number_in_range(criteria, 'autonomie', 1, 10)
      AND public.rating_number_in_range(criteria, 'hauptoperateurAnteil', 1, 10)
      AND public.rating_number_in_range(criteria, 'mitarbeitergespraeche', 0, 12)
      AND public.rating_number_in_range(criteria, 'dokumentationsaufwand', 1, 10)
      AND public.rating_number_in_range(criteria, 'urlaubsgenehmigung', 1, 10)
      AND public.rating_number_in_range(criteria, 'workLifeBalance', 1, 10)
      AND public.rating_number_in_range(criteria, 'teamAtmosphaere', 1, 10)
    ) NOT VALID,
  ADD CONSTRAINT ratings_benefits_length_check
    CHECK (char_length(COALESCE(criteria->>'benefits', '')) <= 500) NOT VALID,
  ADD CONSTRAINT ratings_rotations_text_length_check
    CHECK (char_length(COALESCE(criteria->>'rotationsplaeneText', '')) <= 500) NOT VALID;

COMMIT;
