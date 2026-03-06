import { NextRequest, NextResponse } from 'next/server';
import { discoverySessionStore } from '../start/route';
import { inferDataModel, inferApiSpec } from '@/lib/data-api-inference';

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

  const dataModel = inferDataModel({
    sessionId: session.id,
    url: session.targetUrl,
  });

  const apiSpec = inferApiSpec({
    sessionId: session.id,
    url: session.targetUrl,
  });

  return NextResponse.json({ dataModel, apiSpec });
}

