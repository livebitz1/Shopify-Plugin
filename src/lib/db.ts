import { createClient } from '@supabase/supabase-js';
import { PrismaClient } from '@prisma/client';

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const BUCKET = process.env.SUPABASE_BUCKET!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
export const prisma = new PrismaClient();

export async function insertUpload(record: { key: string; shopToken: string; status: string }) {
  return prisma.upload.create({ data: { key: record.key, shopToken: record.shopToken, status: record.status } });
}

export async function insertJob(record: any) {
  return prisma.job.create({ data: record });
}

export async function updateJobStatus(id: string, patch: any) {
  return prisma.job.update({ where: { id }, data: patch });
}

export async function getJobById(id: string) {
  return prisma.job.findUnique({ where: { id } });
}
