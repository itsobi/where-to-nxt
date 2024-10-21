// lib/supabaseAdmin.ts

import { createClient } from '@supabase/supabase-js';

// Use environment variables for Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Create a Supabase client with the service_role key (admin privileges)
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
