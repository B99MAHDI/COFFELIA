import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "../config.js";

export const isConfigured = !SUPABASE_URL.includes("VOTRE") && !SUPABASE_ANON_KEY.includes("VOTRE");

export const sb = isConfigured ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;
