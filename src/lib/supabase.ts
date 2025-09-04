import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "SUPABASE_URL ou SUPABASE_KEY não está definida nas variáveis de ambiente."
  );
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;