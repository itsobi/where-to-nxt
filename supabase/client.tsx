import { createClient } from '@supabase/supabase-js';

export const supabaseClientRLS = async ({
  token,
}: {
  token: string | null;
}) => {
  if (!token) {
    throw new Error('No supabase token found');
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: { headers: { Authorization: `Bearer ${token}` } },
    }
  );
  return supabase;
};

export const supabaseClient = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
