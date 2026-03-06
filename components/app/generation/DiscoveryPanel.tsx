"use client";

import { useEffect, useState } from "react";

interface DiscoveryPanelProps {
  sessionId: string | null;
}

export function DiscoveryPanel({ sessionId }: DiscoveryPanelProps) {
  const [status, setStatus] = useState<any | null>(null);
  const [graph, setGraph] = useState<any | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    let cancelled = false;

    const fetchData = async () => {
      try {
        const [statusRes, graphRes] = await Promise.all([
          fetch(`/api/discovery/status?id=${encodeURIComponent(sessionId)}`),
          fetch(`/api/discovery/behavior-graph?id=${encodeURIComponent(sessionId)}`),
        ]);

        if (!cancelled) {
          if (statusRes.ok) {
            const data = await statusRes.json();
            setStatus(data.session);
          }

          if (graphRes.ok) {
            const data = await graphRes.json();
            setGraph(data.behaviorGraph);
          }
        }
      } catch (err) {
        console.warn("[DiscoveryPanel] Failed to load discovery data", err);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 8000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [sessionId]);

  if (!sessionId) return null;

  return (
    <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4 text-xs text-gray-700">
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-gray-900">Discovery</span>
        <span className="rounded-full bg-gray-200 px-2 py-0.5 text-[10px] uppercase tracking-wide">
          {status?.status ?? "running"}
        </span>
      </div>
      {status && (
        <div className="mb-2 space-y-1">
          <div>Target: {status.targetUrl}</div>
          <div>Scope: {status.scope}</div>
        </div>
      )}
      {graph && (
        <div className="mt-2">
          <div className="font-medium mb-1">Behavior graph</div>
          <div className="space-y-1">
            <div>States: {graph.states?.length ?? 0}</div>
            <div>Transitions: {graph.transitions?.length ?? 0}</div>
          </div>
        </div>
      )}
    </div>
  );
}

