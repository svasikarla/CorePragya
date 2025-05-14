-- Add title column to knowledgebase table
ALTER TABLE knowledgebase
ADD COLUMN IF NOT EXISTS title TEXT;

-- Update existing records to have a default title if needed
UPDATE knowledgebase
SET title = 'Untitled Content'
WHERE title IS NULL;
