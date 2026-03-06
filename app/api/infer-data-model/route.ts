import { NextRequest, NextResponse } from 'next/server';
import { inferDataModel, inferApiSpec } from '@/lib/data-api-inference';

export async function POST(req: NextRequest) {
  try {
    const { sessionId, url, markdown } = await req.json();

    if (!sessionId || !url) {
      return NextResponse.json(
        { error: 'sessionId and url are required' },
        { status: 400 }
      );
    }

    const dataModel = inferDataModel({ sessionId, url, markdown });
    const apiSpec = inferApiSpec({ sessionId, url, markdown });

    return NextResponse.json({ dataModel, apiSpec });
  } catch (error) {
    console.error('[infer-data-model] Error:', error);
    return NextResponse.json(
      { error: 'Failed to infer data model' },
      { status: 500 }
    );
  }
}

