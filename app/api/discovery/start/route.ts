import { NextRequest, NextResponse } from 'next/server';
import { DiscoverySession, DiscoveryScope } from '@/types/discovery';
import { v4 as uuidv4 } from 'uuid';

// In-memory store for discovery sessions for the MVP.
// In a production setting this should be replaced with a durable store.
const sessions = new Map<string, DiscoverySession>();

export async function POST(req: NextRequest) {
  try {
    const { url, scope }: { url?: string; scope?: DiscoveryScope } = await req.json();

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid url' }, { status: 400 });
    }

    const normalizedScope: DiscoveryScope = scope || 'single_page';

    const id = uuidv4();
    const now = Date.now();

    const session: DiscoverySession = {
      id,
      targetUrl: url,
      scope: normalizedScope,
      createdAt: now,
      updatedAt: now,
      status: 'running',
      progress: {
        scrapeCompleted: false,
        behaviorAnalysisCompleted: false,
        dataModelInferenceCompleted: false,
        designSystemExtractionCompleted: false,
        qualityAnalysisCompleted: false,
      },
      artifacts: {},
    };

    sessions.set(id, session);

    // For the MVP, we immediately mark scrape as completed once a session is created.
    // Future iterations can hook into existing Firecrawl scraping flows and update the session as work completes.
    session.progress.scrapeCompleted = true;
    session.updatedAt = Date.now();

    return NextResponse.json({ session });
  } catch (error) {
    console.error('[discovery/start] Failed to start discovery session', error);
    return NextResponse.json({ error: 'Failed to start discovery session' }, { status: 500 });
  }
}

// Export the sessions map so that related discovery routes can access shared state.
export { sessions as discoverySessionStore };

