import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const mine = await prisma.mine.findUnique({
    where: { id },
    include: { photos: true, user: true },
  });
  if (!mine) {
    return new Response(JSON.stringify({ error: 'Mine not found' }), { status: 404 });
  }
  return new Response(JSON.stringify(mine), { status: 200, headers: { 'Content-Type': 'application/json' } });
} 