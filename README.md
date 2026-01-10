# Minimal Vercel backend for Nanao Try-On using Banana API and Supabase Storage

Environment variables (set in Vercel dashboard):
- SUPABASE_DB_URL - Postgres connection string for Supabase (replaces Neon)
- SUPABASE_URL - your Supabase project URL
- SUPABASE_SERVICE_ROLE_KEY - Supabase service role key (server-side only)
- SUPABASE_BUCKET - Supabase storage bucket name
- BANANA_API_KEY - Banana API key
- SHOP_TOKEN_SECRET - secret to validate shop tokens injected into theme

Endpoints:
- POST /api/presign { filename, contentType, shopToken } (optional, server returns signed download URL)
- POST /api/start-tryon { user_image_url or multipart file, product_image_url, product_meta, shopToken }
- GET /api/status/:jobId

DB schema (Postgres on Supabase):

CREATE TABLE uploads (
  id SERIAL PRIMARY KEY,
  key TEXT UNIQUE,
  shop_token TEXT,
  status TEXT,
  created_at TIMESTAMP
);

CREATE TABLE jobs (
  id UUID PRIMARY KEY,
  shop_token TEXT,
  user_image_url TEXT,
  product_image_url TEXT,
  run_id TEXT,
  status TEXT,
  final_url TEXT,
  error JSONB,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
