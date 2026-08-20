import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nbulhbstberjkphoorot.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5idWxoYnN0YmVyamtwaG9vcm90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcwNjkwMzMsImV4cCI6MjEwMjY0NTAzM30.8Hkqzj8us2yTk8NFmLXmG3Wxn37V5yYoCnUt2WCluCw';

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});

export interface Collection {
  id: string;
  slug: string;
  label: string;
  sort_order: number;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  collection: string;
  collection_label: string;
  tagline: string;
  description: string;
  story: string;
  price: string;
  fabric: string;
  work: string;
  color: string;
  pieces: string;
  includes: string[];
  video_url: string;
  image: string;
  gallery: string[];
  palette: string[];
  sort_order: number;
  created_at: string;
}

export interface ProductInput {
  name: string;
  slug: string;
  collection: string;
  collection_label: string;
  tagline: string;
  description: string;
  story: string;
  price: string;
  fabric: string;
  work: string;
  color: string;
  pieces: string;
  includes: string[];
  video_url: string;
  image: string;
  gallery: string[];
  palette: string[];
  sort_order: number;
}
