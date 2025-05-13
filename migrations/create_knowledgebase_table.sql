-- Create knowledgebase table
CREATE TABLE IF NOT EXISTS knowledgebase (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  source_type TEXT NOT NULL,
  source_ref TEXT NOT NULL,
  raw_text TEXT NOT NULL,
  summary_text TEXT NOT NULL,
  summary_json JSONB NOT NULL,
  category TEXT NOT NULL DEFAULT 'Uncategorized',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS knowledgebase_user_id_idx ON knowledgebase (user_id);
CREATE INDEX IF NOT EXISTS knowledgebase_created_at_idx ON knowledgebase (created_at);

-- Add RLS policies
ALTER TABLE knowledgebase ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to select only their own entries
CREATE POLICY knowledgebase_select_policy ON knowledgebase
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy to allow users to insert only their own entries
CREATE POLICY knowledgebase_insert_policy ON knowledgebase
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to update only their own entries
CREATE POLICY knowledgebase_update_policy ON knowledgebase
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy to allow users to delete only their own entries
CREATE POLICY knowledgebase_delete_policy ON knowledgebase
  FOR DELETE
  USING (auth.uid() = user_id);
