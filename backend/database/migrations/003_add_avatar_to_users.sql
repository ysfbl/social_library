-- Add avatar_id column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_id INTEGER DEFAULT 1;

-- Update existing users to have default avatar
UPDATE users SET avatar_id = 1 WHERE avatar_id IS NULL;
