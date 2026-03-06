import { NextRequest, NextResponse } from 'next/server';
import { discoverySessionStore } from '../start/route';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 });
  }

  const session = discoverySessionStore.get(id);

  if (!session) {
    return NextResponse.json({ error: 'Discovery session not found' }, { status: 404 });
  }

  return NextResponse.json({ session });
}

