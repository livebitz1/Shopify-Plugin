import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getJobById } from '../../lib/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { jobId } = req.query as { jobId: string };
  if (!jobId) return res.status(400).json({ error: 'missing' });
  const r = await getJobById(jobId);
  if (!r) return res.status(404).json({ error: 'not found' });
  res.json({ jobId: r.id, status: r.status, finalUrl: r.finalUrl, error: r.error });
}
