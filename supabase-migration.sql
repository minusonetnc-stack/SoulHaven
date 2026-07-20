-- SoulHaven v2.2 Migration
-- Run this in Supabase SQL Editor

-- Add feeling and tagline columns to messages
ALTER TABLE messages 
ADD COLUMN IF NOT EXISTS feeling TEXT,
ADD COLUMN IF NOT EXISTS tagline TEXT;

-- Add sanctuary room for secret admin access
INSERT INTO rooms (id, name, category, emoji, color, description) VALUES
  ('sanctuary', 'The Sanctuary', 'admin', '🔒', '#0f0', 'Authorized personnel only.')
ON CONFLICT (id) DO NOTHING;
