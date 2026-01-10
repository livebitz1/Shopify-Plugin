import { supabase } from './db';

const BUCKET = process.env.SUPABASE_BUCKET!;

export async function createPresign(key: string, contentType: string, expiresSeconds = 300) {
  // Supabase createSignedUrl expects seconds
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(key, expiresSeconds);
  if (error) throw error;
  return { uploadUrl: null, objectUrl: data.signedUrl, key };
}

export async function makePublicUrl(key: string) {
  const { data, error } = await supabase.storage.from(BUCKET).getPublicUrl(key);
  if (error) throw error;
  return data.publicUrl;
}
