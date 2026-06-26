-- Bewertungsformular v3 migration.
-- Idempotent: nach Änderungen an den erlaubten Detailfeldern erneut ausführbar.
-- Run in the Supabase SQL Editor immediately before deploying the matching form.
-- Existing v2 rows remain valid and readable.

BEGIN;

ALTER TABLE public.ratings
  DROP CONSTRAINT IF EXISTS ratings_criteria_keys_check,
  DROP CONSTRAINT IF EXISTS ratings_criteria_numeric_ranges_check,
  DROP CONSTRAINT IF EXISTS ratings_criteria_v3_check;

ALTER TABLE public.ratings
  ADD CONSTRAINT ratings_criteria_keys_check
    CHECK (
      criteria - ARRAY[
        'schemaVersion',
        'weiterbildungsjahr', 'weiterbildungsziele', 'supervision',
        'selbststaendigkeit', 'arbeitsbelastung', 'teamFuehrung',
        'ausbildungsstruktur', 'weiterempfehlung',
        'ueberstundenErfassung', 'nachtdiensteProMonat',
        'hintergrundErreichbarkeit', 'hauptoperateurKategorie',
        'urlaub', 'dokumentation', 'fehlerkultur', 'fuehrungRespekt',
        'pflegeZusammenarbeit', 'einarbeitung', 'diskriminierung',
        'diskriminierungAnsprechperson', 'diskriminierungKlaerung',
        'arbeitszeitenVon', 'arbeitszeitenBis', 'diensteProMonat', 'schichtsystem',
        'ueberstundenAufschreiben', 'ueberstundenAusgleich', 'abteilungsgroesse',
        'personalschluessel', 'wbeJahre', 'opsProMonat', 'rotationsplaene',
        'rotationsplaeneText', 'nachtdienstBegleitung', 'fortbildungFreistellung',
        'fortbildungBezahlt', 'lehreTaetig', 'lehreFreistellung',
        'logbuchErfuellbarkeit', 'supervisionQualitaet', 'autonomie',
        'hauptoperateurAnteil', 'mitarbeitergespraeche', 'dokumentationsaufwand',
        'urlaubsgenehmigung', 'workLifeBalance', 'teamAtmosphaere',
        'schwangerschaft', 'schwangerschaftFamilienfreundlich', 'parkplatz', 'benefits'
      ]::text[] = '{}'::jsonb
    ) NOT VALID,
  ADD CONSTRAINT ratings_criteria_numeric_ranges_check
    CHECK (
      public.rating_number_in_range(criteria, 'weiterbildungsjahr', 1, 12)
      AND public.rating_number_in_range(criteria, 'weiterbildungsziele', 1, 5)
      AND public.rating_number_in_range(criteria, 'supervision', 1, 5)
      AND public.rating_number_in_range(criteria, 'selbststaendigkeit', 1, 5)
      AND public.rating_number_in_range(criteria, 'arbeitsbelastung', 1, 5)
      AND public.rating_number_in_range(criteria, 'teamFuehrung', 1, 5)
      AND public.rating_number_in_range(criteria, 'ausbildungsstruktur', 1, 5)
      AND public.rating_number_in_range(criteria, 'nachtdiensteProMonat', 0, 31)
      AND public.rating_number_in_range(criteria, 'hintergrundErreichbarkeit', 1, 5)
      AND public.rating_number_in_range(criteria, 'urlaub', 1, 5)
      AND public.rating_number_in_range(criteria, 'dokumentation', 1, 5)
      AND public.rating_number_in_range(criteria, 'fehlerkultur', 1, 5)
      AND public.rating_number_in_range(criteria, 'fuehrungRespekt', 1, 5)
      AND public.rating_number_in_range(criteria, 'pflegeZusammenarbeit', 1, 5)
      AND public.rating_number_in_range(criteria, 'einarbeitung', 1, 5)
      AND public.rating_number_in_range(criteria, 'diensteProMonat', 0, 15)
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
  ADD CONSTRAINT ratings_criteria_v3_check
    CHECK (
      COALESCE(criteria->>'schemaVersion', '2') <> '3'
      OR (
        jsonb_typeof(criteria->'schemaVersion') = 'number'
        AND (criteria->>'schemaVersion')::int = 3
        AND public.rating_number_in_range(criteria, 'weiterbildungsjahr', 1, 12)
        AND criteria->'weiterbildungsjahr' IS NOT NULL
        AND criteria->'weiterbildungsjahr' <> 'null'::jsonb
        AND criteria->>'weiterempfehlung' IN ('Ja', 'Mit Einschränkungen', 'Nein')
        AND (
          (CASE WHEN criteria->'weiterbildungsziele' IS NULL OR criteria->'weiterbildungsziele' = 'null'::jsonb THEN 0 ELSE 1 END)
          + (CASE WHEN criteria->'supervision' IS NULL OR criteria->'supervision' = 'null'::jsonb THEN 0 ELSE 1 END)
          + (CASE WHEN criteria->'selbststaendigkeit' IS NULL OR criteria->'selbststaendigkeit' = 'null'::jsonb THEN 0 ELSE 1 END)
          + (CASE WHEN criteria->'arbeitsbelastung' IS NULL OR criteria->'arbeitsbelastung' = 'null'::jsonb THEN 0 ELSE 1 END)
          + (CASE WHEN criteria->'teamFuehrung' IS NULL OR criteria->'teamFuehrung' = 'null'::jsonb THEN 0 ELSE 1 END)
          + (CASE WHEN criteria->'ausbildungsstruktur' IS NULL OR criteria->'ausbildungsstruktur' = 'null'::jsonb THEN 0 ELSE 1 END)
        ) >= 5
      )
    ) NOT VALID;

COMMIT;
