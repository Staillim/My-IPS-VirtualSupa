export { supabase } from './client';
export { SupabaseProvider, useSupabase } from './provider';
export { useCollection } from './hooks/use-collection';
export { useDoc } from './hooks/use-doc';

// Server-only export - import directly from './server' in Server Components
// export { createClient } from './server';
