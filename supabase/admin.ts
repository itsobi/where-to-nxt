import { createClient } from '@supabase/supabase-js';

// Use environment variables for Supabase credentials
// ... existing code ...
const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
// ... existing code ...

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('Supabase credentials are not set');
}

// Create a Supabase client with the service_role key (admin privileges)
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
