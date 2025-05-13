// Script to create the knowledgebase table in Supabase
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Create a Supabase client with service role key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createKnowledgebaseTable() {
  try {
    console.log('Creating knowledgebase table...');
    
    // Read the SQL file
    const sqlPath = path.join(__dirname, '..', 'migrations', 'create_knowledgebase_table.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // Execute the SQL directly
    const { error } = await supabase.sql(sql);
    
    if (error) {
      console.error('Error creating knowledgebase table:', error);
      return false;
    }
    
    console.log('Knowledgebase table created successfully');
    return true;
  } catch (error) {
    console.error('Error creating knowledgebase table:', error);
    return false;
  }
}

// Run the function
createKnowledgebaseTable()
  .then(success => {
    if (success) {
      console.log('Script completed successfully');
      process.exit(0);
    } else {
      console.error('Script failed');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
