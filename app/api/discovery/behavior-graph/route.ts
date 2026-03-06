import { NextRequest, NextResponse } from 'next/server';
import { discoverySessionStore } from '../start/route';
import type { DiscoveredPage, DiscoveredElement, DiscoveredForm } from '@/types/discovery';
import { buildBehaviorGraph } from '@/lib/behavior-graph-builder';

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

  // For the MVP, we synthesize a trivial behavior graph based on placeholder discovery data.
  // Future iterations should hydrate these from real scraping and probing artifacts.
  const pages: DiscoveredPage[] = [
    {
      id: 'page-0',
      url: session.targetUrl,
      title: session.targetUrl,
      description: 'Root page inferred from discovery session',
      contentSummary: '',
      pathDepth: 0,
      isAuthenticatedArea: session.scope === 'authenticated_area',
    },
  ];

  const elements: DiscoveredElement[] = [];
  const forms: DiscoveredForm[] = [];

  const graph = buildBehaviorGraph({
    sessionId: session.id,
    pages,
    elements,
    forms,
  });

  return NextResponse.json({ behaviorGraph: graph });
}

