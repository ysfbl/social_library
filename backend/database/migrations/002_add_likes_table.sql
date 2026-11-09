-- Migration: Add likes table for activity likes
-- Date: 2025-11-26

-- Create likes table
CREATE TABLE IF NOT EXISTS likes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  activity_id INTEGER NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, activity_id)
);

-- Create index for faster queries
CREATE INDEX idx_likes_user_id ON likes(user_id);
CREATE INDEX idx_likes_activity_id ON likes(activity_id);

-- Comments
COMMENT ON TABLE likes IS 'Stores user likes on activities';
COMMENT ON COLUMN likes.user_id IS 'User who liked the activity';
COMMENT ON COLUMN likes.activity_id IS 'The activity that was liked';
