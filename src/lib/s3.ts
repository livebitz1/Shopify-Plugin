import { supabase } from './db';

const BUCKET = process.env.SUPABASE_BUCKET!;

export async function createPresign(key: string, contentType: string, expiresSeconds = 300) {
  // Supabase createSignedUrl expects seconds
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(key, expiresSeconds);
  if (error) throw error;
  return { uploadUrl: null, objectUrl: (data as any)?.signedUrl, key };
}

export async function makePublicUrl(key: string) {
  const result: any = await supabase.storage.from(BUCKET).getPublicUrl(key);
  if (result?.error) throw result.error;
  return result?.data?.publicUrl;
}
