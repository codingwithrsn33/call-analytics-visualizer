import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://tgqdaayhmhjtjpaytwzb.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRncWRhYXlobWhqdGpwYXl0d3piIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5ODIyMDEsImV4cCI6MjA3NzU1ODIwMX0.1ntLk9-c5RCtU9JVv2SCu1RSNpRthC2hDoI4XiB30Wg";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
