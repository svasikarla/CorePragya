// Script to apply migrations to Supabase
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

async function applyMigration(filePath) {
  try {
    console.log(`Applying migration: ${filePath}`);
    const sql = fs.readFileSync(filePath, 'utf8');
    
    // Execute the SQL
    const { error } = await supabase.rpc('pgmigrate', { query: sql });
    
    if (error) {
      console.error(`Error applying migration ${filePath}:`, error);
      return false;
    }
    
    console.log(`Successfully applied migration: ${filePath}`);
    return true;
  } catch (error) {
    console.error(`Error reading or applying migration ${filePath}:`, error);
    return false;
  }
}

async function applyAllMigrations() {
  const migrationsDir = path.join(__dirname, '..', 'migrations');
  
  try {
    // Check if migrations directory exists
    if (!fs.existsSync(migrationsDir)) {
      console.error('Migrations directory not found');
      return;
    }
    
    // Get all SQL files in the migrations directory
    const files = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .map(file => path.join(migrationsDir, file));
    
    if (files.length === 0) {
      console.log('No migration files found');
      return;
    }
    
    console.log(`Found ${files.length} migration files`);
    
    // Apply each migration
    for (const file of files) {
      const success = await applyMigration(file);
      if (!success) {
        console.error(`Failed to apply migration: ${file}`);
        process.exit(1);
      }
    }
    
    console.log('All migrations applied successfully');
  } catch (error) {
    console.error('Error applying migrations:', error);
    process.exit(1);
  }
}

// Create a stored procedure for executing SQL
async function createPgMigrateFunction() {
  try {
    console.log('Creating pgmigrate function...');
    
    const { error } = await supabase.rpc('create_pg_migrate_function', {
      query: `
        CREATE OR REPLACE FUNCTION pgmigrate(query text)
        RETURNS void
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        BEGIN
          EXECUTE query;
        END;
        $$;
      `
    });
    
    if (error) {
      // If the function doesn't exist yet, create it directly
      const { error: directError } = await supabase.sql(`
        CREATE OR REPLACE FUNCTION pgmigrate(query text)
        RETURNS void
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        BEGIN
          EXECUTE query;
        END;
        $$;
      `);
      
      if (directError) {
        console.error('Error creating pgmigrate function:', directError);
        return false;
      }
    }
    
    console.log('pgmigrate function created successfully');
    return true;
  } catch (error) {
    console.error('Error creating pgmigrate function:', error);
    return false;
  }
}

// Main function
async function main() {
  try {
    // First create the pgmigrate function if it doesn't exist
    const success = await createPgMigrateFunction();
    if (!success) {
      console.error('Failed to create pgmigrate function');
      process.exit(1);
    }
    
    // Then apply all migrations
    await applyAllMigrations();
  } catch (error) {
    console.error('Error in main function:', error);
    process.exit(1);
  }
}

// Run the main function
main();
