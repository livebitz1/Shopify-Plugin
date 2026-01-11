import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../../lib/db';
import crypto from 'crypto';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { shopDomain } = req.body;
  if (!shopDomain) return res.status(400).json({ error: 'missing shopDomain' });
  // generate token
  const token = crypto.randomBytes(32).toString('hex');
  const hash = crypto.createHmac('sha256', process.env.SHOP_TOKEN_SECRET || 'fallback').update(token).digest('hex');
  // upsert shop
  await prisma.shop.upsert({ where: { domain: shopDomain }, update: { tokenHash: hash }, create: { domain: shopDomain, tokenHash: hash } });
  // return plaintext token to merchant (they must inject into theme securely)
  res.json({ token });
}
