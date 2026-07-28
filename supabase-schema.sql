-- SoulHaven Database Schema for Supabase
-- Run this in the Supabase SQL Editor

-- Enable realtime for all tables
BEGIN;

-- Rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  emoji TEXT NOT NULL,
  color TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages table (chat history)
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id TEXT NOT NULL REFERENCES rooms(id),
  soul_name TEXT NOT NULL,
  soul_color TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT DEFAULT 'text',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Threads table
CREATE TABLE IF NOT EXISTS threads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  author_color TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  is_pinned BOOLEAN DEFAULT FALSE,
  reply_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Replies table
CREATE TABLE IF NOT EXISTS replies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  thread_id UUID NOT NULL REFERENCES threads(id) ON DELETE CASCADE,
  author TEXT NOT NULL,
  author_color TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Play dates table
CREATE TABLE IF NOT EXISTS play_dates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL,
  location TEXT NOT NULL,
  date_time TIMESTAMPTZ NOT NULL,
  max_participants INTEGER DEFAULT 10,
  participants TEXT[] DEFAULT '{}',
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default rooms
INSERT INTO rooms (id, name, category, emoji, color, description) VALUES
  ('recovery', 'Recovery Circle', 'healing', '🌱', '#7fb069', 'For those walking the path of recovery. All stages welcome.'),
  ('parenting', 'Parenting Post', 'support', '🍼', '#c4a86b', 'Single dads, new moms, tired parents — you are seen.'),
  ('veteran', 'Veteran Ground', 'support', '🎖️', '#8b7b9e', 'Coming home, finding peace. Military and first responders.'),
  ('grief', 'Grief Harbor', 'healing', '🕯️', '#9e7b7b', 'Loss, remembrance, healing. Hold what you need to hold.'),
  ('quiet', 'Quiet Corner', 'social', '🫧', '#7b9ec4', 'Social anxiety, introverts, and those who need low pressure.'),
  ('green', 'Green Room', 'social', '🌲', '#6b9e8e', 'Cannabis-friendly, chill vibes. No judgment, just peace.'),
  ('night', 'Night Watch', 'social', '🌙', '#9e8b7b', 'Insomnia, night owls, 3am thoughts. You are not alone.'),
  ('new', 'New Beginnings', 'healing', '☀️', '#8b9e7b', 'Pregnancy, new chapters, fresh starts. Every sunrise counts.')
ON CONFLICT (id) DO NOTHING;

-- Insert demo threads
INSERT INTO threads (title, author, author_color, content, category, is_pinned) VALUES
  ('First week sober — what helped you?', 'Gentle Pine', '#7fb069', 'I am on day 5 and the evenings are the hardest. What got you through the first week?', 'Recovery', TRUE),
  ('Single dad looking for other single parents', 'Steady River', '#8b7b9e', 'Co-parenting is exhausting. Would love to connect with others who get it.', 'Parenting', FALSE),
  ('Night shift workers — how do you sleep?', 'Warm Tide', '#6b9e8e', 'My sleep schedule is destroyed. Any tips for getting rest during the day?', 'Night Watch', FALSE),
  ('Grief does not have a timeline', 'Soft Dawn', '#9e7b7b', 'It has been two years and I still have days where it hits like day one. That is okay, right?', 'Grief', TRUE)
ON CONFLICT DO NOTHING;

-- Insert demo replies
INSERT INTO replies (thread_id, author, author_color, content) 
SELECT t.id, 'Quiet Ember', '#c4a86b', 'Walking. Just walking outside until the craving passed. You got this.'
FROM threads t WHERE t.title = 'First week sober — what helped you?'
ON CONFLICT DO NOTHING;

INSERT INTO replies (thread_id, author, author_color, content)
SELECT t.id, 'Brave Stone', '#7b9ec4', 'It is absolutely okay. Grief is love with nowhere to go. Be gentle with yourself.'
FROM threads t WHERE t.title = 'Grief does not have a timeline'
ON CONFLICT DO NOTHING;

-- Insert demo play dates
INSERT INTO play_dates (title, description, type, location, date_time, max_participants, created_by) VALUES
  ('Evening Walk at Riverside Park', 'Easy 2-mile walk. No pressure to talk if you do not want to.', 'walk', 'Riverside Park, Main Entrance', '2026-07-08T18:00:00Z', 6, 'Steady River'),
  ('Coffee & Cards at The Roost', 'Casual card games and coffee. Beginners welcome.', 'game', 'The Roost Coffee House', '2026-07-09T14:00:00Z', 4, 'Soft Dawn'),
  ('Virtual Skill Share: Basic Cooking', 'Learn to make a simple, nourishing meal over video call.', 'skill', 'Online (Discord)', '2026-07-10T19:00:00Z', 10, 'Brave Stone')
ON CONFLICT DO NOTHING;

-- Enable Row Level Security (open for now)
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE play_dates ENABLE ROW LEVEL SECURITY;

-- Create policies that allow all operations (anonymous app)
CREATE POLICY "Allow all" ON messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON threads FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON replies FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON play_dates FOR ALL USING (true) WITH CHECK (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE threads;
ALTER PUBLICATION supabase_realtime ADD TABLE replies;
ALTER PUBLICATION supabase_realtime ADD TABLE play_dates;

COMMIT;
