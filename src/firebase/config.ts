// Configuración de Supabase
// Las variables de entorno deben estar en .env.local

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
}

export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
};

// Configuración anterior de Firebase (mantener por si se necesita rollback)
export const firebaseConfig = {
  "projectId": "studio-6018430627-f266c",
  "appId": "1:646696636227:web:f071152b6f19df3a8029f6",
  "apiKey": "AIzaSyA5hyXPFIsSqbw85GlEJr6P6QuACSs3JJM",
  "authDomain": "studio-6018430627-f266c.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "646696636227"
};
