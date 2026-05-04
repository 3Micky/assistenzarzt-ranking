-- Assistenzarzt Ranking Database Schema
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  hospital text NOT NULL,
  city text NOT NULL,
  country text NOT NULL,
  region text NOT NULL,
  specialty text NOT NULL,
  year int NOT NULL,
  criteria jsonb NOT NULL,
  comment text DEFAULT ''
);

-- Enable Row Level Security
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

-- Allow public reads
CREATE POLICY "ratings_read_all" ON ratings
  FOR SELECT USING (true);

-- Allow public inserts
CREATE POLICY "ratings_insert_all" ON ratings
  FOR INSERT WITH CHECK (true);

-- Create indexes for common queries
CREATE INDEX idx_ratings_created_at ON ratings (created_at DESC);
CREATE INDEX idx_ratings_country_city ON ratings (country, city);

-- Grant access to anonymous users
GRANT SELECT, INSERT ON ratings TO anon;
