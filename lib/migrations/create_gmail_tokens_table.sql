-- Create a table to store Gmail OAuth tokens
CREATE TABLE IF NOT EXISTS gmail_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  expiry_date BIGINT NOT NULL,
  scope TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE gmail_tokens ENABLE ROW LEVEL SECURITY;

-- Only allow system-level access (service role)
CREATE POLICY "Service role can manage gmail_tokens"
  ON gmail_tokens
  USING (true)
  WITH CHECK (true);

-- Create an updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_gmail_tokens_updated_at
BEFORE UPDATE ON gmail_tokens
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
