import type { VercelRequest, VercelResponse } from '@vercel/node';
import { insertJob, updateJobStatus } from '../lib/db';
import { v4 as uuidv4 } from 'uuid';
import { createPresign } from '../lib/s3';
import fetch from 'node-fetch';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { objectPath, product_image_url, product_meta, shopToken } = req.body;
  if (!objectPath || !product_image_url || !shopToken) return res.status(400).json({ error: 'missing' });
  // TODO: verify shopToken
  const jobId = uuidv4();
  await insertJob({ id: jobId, shopToken, userImageUrl: objectPath, productImageUrl: product_image_url, status: 'pending' });
  const presign = await createPresign(objectPath, 'image/jpeg', 300);
  handleBanana(jobId, presign.objectUrl, product_image_url).catch(err => console.error(err));
  res.json({ jobId });
}

async function handleBanana(jobId: string, userImageUrl: string, productImage: string) {
  const resp = await fetch('https://api.banana.dev/run', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${process.env.BANANA_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: process.env.BANANA_MODEL_NAME || 'nanao-tryon-model',
      input: { user_image: userImageUrl, product_image: productImage }
    })
  });
  const j: any = await resp.json();
  const resultUrl = j.result_url || (j.output && j.output[0] && j.output[0].url) || null;
  if (!resultUrl) {
    await updateJobStatus(jobId, { status: 'error', error: j });
    return;
  }
  await updateJobStatus(jobId, { status: 'done', finalUrl: resultUrl, updatedAt: new Date() });
}
