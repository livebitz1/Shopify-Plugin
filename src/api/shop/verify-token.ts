import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../../lib/db';
import crypto from 'crypto';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { shopDomain, token } = req.body;
  if (!shopDomain || !token) return res.status(400).json({ error: 'missing' });
  const shop = await prisma.shop.findUnique({ where: { domain: shopDomain } });
  if (!shop) return res.status(404).json({ error: 'shop not found' });
  const computed = crypto.createHmac('sha256', process.env.SHOP_TOKEN_SECRET || 'fallback').update(token).digest('hex');
  if (computed !== shop.tokenHash) return res.status(401).json({ error: 'invalid token' });
  res.json({ ok: true });
}
