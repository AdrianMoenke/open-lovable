"use client";

import { useEffect, useState } from "react";
import ButtonUI from "@/components/ui/shadcn/button";
import Input from "@/components/ui/shadcn/input";
import Textarea from "@/components/ui/shadcn/textarea";

interface Idea {
  id: number;
  title: string;
  description: string;
  created_at: string;
}

export default function IdeasBoard() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch("/api/ideas");
        if (!res.ok) throw new Error("Failed to fetch ideas");
        const data = (await res.json()) as { ideas: Idea[] };
        if (!cancelled) {
          setIdeas(data.ideas);
        }
      } catch (err) {
        if (!cancelled) {
          console.error(err);
          setError("Could not load ideas yet. Try again in a bit.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        const message =
          data?.error ||
          "Unable to submit idea right now. Please try again.";
        throw new Error(message);
      }

      const data = (await res.json()) as { idea: Idea };
      setIdeas((prev) => [data.idea, ...prev].slice(0, 24));
      setTitle("");
      setDescription("");
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Something went wrong submitting.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="rounded-3xl border border-border-faint bg-background-elevated px-6 py-8 md:px-10 md:py-10">
      <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xl space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-soft">
            Live experiment ideas
          </p>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
            What would you build with this template?
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
            Drop a quick idea for how you’d use an AI-native site like this—
            we’ll keep a running wall of concepts from everyone trying the
            template.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-4 w-full max-w-md space-y-3 md:mt-0"
        >
          <Input
            placeholder="Give your idea a name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={120}
          />
          <Textarea
            placeholder="Describe the experience, who it’s for, or the problem it solves."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            maxLength={800}
          />
          {error && (
            <p className="text-xs text-red-400">
              {error}
            </p>
          )}
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] text-muted-foreground">
              Stored in a Postgres table just for this demo. Please avoid
              sharing sensitive data.
            </p>
            <ButtonUI
              type="submit"
              variant="primary"
              disabled={
                submitting ||
                !title.trim() ||
                !description.trim() ||
                description.length < 10
              }
            >
              {submitting ? "Sending..." : "Publish idea"}
            </ButtonUI>
          </div>
        </form>
      </div>

      <div className="mt-8 h-px w-full bg-border-faint" />

      <div className="mt-6">
        {loading ? (
          <p className="text-xs text-muted-foreground">Loading recent ideas…</p>
        ) : ideas.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            No ideas yet. Be the first to sketch something out.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {ideas.map((idea) => (
              <article
                key={idea.id}
                className="group flex flex-col justify-between rounded-2xl border border-border-faint bg-background-base/70 px-4 py-4 transition-colors hover:border-accent-soft"
              >
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-foreground line-clamp-2">
                    {idea.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-4">
                    {idea.description}
                  </p>
                </div>
                <p className="mt-3 text-[11px] text-muted-foreground">
                  {new Intl.DateTimeFormat(undefined, {
                    month: "short",
                    day: "numeric",
                  }).format(new Date(idea.created_at))}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

