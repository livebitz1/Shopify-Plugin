import type { VercelRequest, VercelResponse } from '@vercel/node';
import { v4 as uuidv4 } from 'uuid';
import { insertUpload } from '../lib/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { filename, contentType, shopToken } = req.body;
  if (!filename || !contentType || !shopToken) return res.status(400).json({ error: 'missing' });
  // TODO: verify shopToken
  const key = `uploads/${uuidv4()}-${filename}`;
  await insertUpload({ key, shopToken, status: 'presigned' });
  // Client will upload using SUPABASE_ANON_KEY to this path
  res.json({ objectPath: key, bucket: process.env.SUPABASE_BUCKET, supabaseUrl: process.env.SUPABASE_URL });
}
