\"use client\";

import { useMemo, useState } from "react";
import Link from "next/link";
import ButtonUI from "@/components/ui/shadcn/button";

type UseCase = "docs" | "blog" | "product" | "other";

interface WizardState {
  useCase: UseCase | null;
  pagesPerMonth: number | null;
  teamSize: number | null;
}

const steps = ["Choose use case", "Traffic & team", "Launch plan"];

export default function OnboardingWizard() {
  const [step, setStep] = useState(0);
  const [state, setState] = useState<WizardState>({
    useCase: null,
    pagesPerMonth: 200,
    teamSize: 3,
  });

  const canGoNext =
    (step === 0 && state.useCase !== null) ||
    (step === 1 && state.pagesPerMonth !== null && state.teamSize !== null) ||
    step === 2;

  const next = () => {
    if (!canGoNext) return;
    setStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const prev = () => {
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const trafficLabel = useMemo(() => {
    if (!state.pagesPerMonth) return "We’ll infer this from your docs.";
    if (state.pagesPerMonth <= 200) return "Great for early-stage / pilot rollout.";
    if (state.pagesPerMonth <= 2000) return "Comfortable for growing teams and active docs.";
    return "Plan for higher-throughput ingestion and monitoring.";
  }, [state.pagesPerMonth]);

  const teamLabel = useMemo(() => {
    if (!state.teamSize) return "You can start solo and add people later.";
    if (state.teamSize === 1) return "Perfect for a single owner proving value.";
    if (state.teamSize <= 5) return "Strong core group to own content & QA.";
    return "Consider light process around ownership and approvals.";
  }, [state.teamSize]);

  return (
    <section className="bg-background-elevated border border-border-faint rounded-3xl px-16 py-16 md:px-24 md:py-24 shadow-[0_18px_60px_rgba(15,23,42,0.45)]">
      <div className="flex flex-col gap-14">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-accent-soft">
              Guided setup
            </p>
            <h2 className="mt-3 text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              Shape this template around your team
            </h2>
            <p className="mt-3 text-sm md:text-base text-muted-foreground max-w-xl">
              In about 30 seconds, you’ll get a recommended rollout plan that
              you can follow after cloning the GitHub template.
            </p>
          </div>

          {/* Progress indicator */}
          <div className="flex flex-col items-start md:items-end gap-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-accent/10 text-[11px] font-semibold text-accent">
                {step + 1}
              </span>
              <span>
                Step {step + 1} of {steps.length} · {steps[step]}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {steps.map((label, index) => {
                const isActive = index === step;
                const isComplete = index < step;
                return (
                  <div
                    key={label}
                    className="flex items-center gap-2 text-xs md:text-[13px]"
                  >
                    <div
                      className={[
                        "h-2.5 w-8 md:w-10 rounded-full transition-colors",
                        isComplete
                          ? "bg-accent"
                          : isActive
                          ? "bg-accent/80"
                          : "bg-border-faint",
                      ].join(" ")}
                    />
                    <span
                      className={
                        "hidden md:inline text-[11px] " +
                        (isActive
                          ? "text-foreground font-medium"
                          : "text-muted-foreground")
                      }
                    >
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </header>

        {/* Step content */}
        <div className="grid gap-10 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] items-start">
          <div className="space-y-8">
            {step === 0 && (
              <StepUseCase
                value={state.useCase}
                onChange={(useCase) =>
                  setState((prev) => ({ ...prev, useCase }))
                }
              />
            )}

            {step === 1 && (
              <StepDetails
                pagesPerMonth={state.pagesPerMonth ?? 0}
                teamSize={state.teamSize ?? 1}
                onChange={(partial) =>
                  setState((prev) => ({ ...prev, ...partial }))
                }
              />
            )}

            {step === 2 && <StepReview state={state} />}

            <div className="flex flex-col gap-3 pt-4 border-t border-border-faint">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={prev}
                  disabled={step === 0}
                  className="text-xs md:text-sm text-muted-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:text-foreground transition-colors"
                >
                  Back
                </button>

                <div className="flex items-center gap-3">
                  <span className="hidden md:inline text-xs text-muted-foreground">
                    {step < steps.length - 1
                      ? "You can tweak details after cloning."
                      : "This plan maps directly to your first week with the template."}
                  </span>
                  {step < steps.length - 1 ? (
                    <ButtonUI
                      type="button"
                      variant="primary"
                      onClick={next}
                      disabled={!canGoNext}
                    >
                      Continue
                    </ButtonUI>
                  ) : (
                    <Link
                      href="https://github.com/mendableai/open-lovable"
                      target="_blank"
                      className="contents"
                    >
                      <ButtonUI type="button" variant="primary">
                        Clone template with this plan
                      </ButtonUI>
                    </Link>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-3 text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1 rounded-full border border-border-faint bg-background-base/60 px-2.5 py-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  {trafficLabel}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-border-faint bg-background-base/60 px-2.5 py-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent/70" />
                  {teamLabel}
                </span>
              </div>
            </div>
          </div>

          {/* Side panel / live summary */}
          <aside className="space-y-5 rounded-2xl border border-border-faint bg-background-base/60 px-6 py-6 md:px-8 md:py-7">
            <p className="text-xs font-semibold tracking-[0.16em] uppercase text-accent-soft">
              Live outline
            </p>

            <div className="space-y-3 text-sm text-muted-foreground">
              <SummaryRow label="Use case">
                {state.useCase
                  ? formatUseCase(state.useCase)
                  : "Pick the surface that matters most right now."}
              </SummaryRow>
              <SummaryRow label="Content volume">
                {state.pagesPerMonth
                  ? `${state.pagesPerMonth.toLocaleString()} pages indexed / month`
                  : "We’ll estimate ingestion volume based on your docs."}
              </SummaryRow>
              <SummaryRow label="Core team">
                {state.teamSize
                  ? `${state.teamSize} teammate${
                      state.teamSize > 1 ? "s" : ""
                    }`
                  : "Add collaborators when you’re ready."}
              </SummaryRow>
            </div>

            <div className="mt-4 grid gap-3 text-xs text-muted-foreground">
              <div className="rounded-xl border border-dashed border-accent-soft/60 bg-background-elevated/60 px-4 py-3 space-y-1.5">
                <p className="text-[11px] font-medium text-foreground">
                  Week 0 · Before rollout
                </p>
                <p>
                  Clone the repo, wire your content source, and validate answers
                  internally.
                </p>
              </div>
              <div className="rounded-xl border border-border-faint bg-background-elevated/40 px-4 py-3 space-y-1.5">
                <p className="text-[11px] font-medium text-foreground">
                  Week 1 · Pilot
                </p>
                <p>
                  Ship to a small slice of traffic, gather real questions, and
                  adjust prompts.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

interface StepUseCaseProps {
  value: UseCase | null;
  onChange: (value: UseCase) => void;
}

function StepUseCase({ value, onChange }: StepUseCaseProps) {
  const options: { id: UseCase; title: string; description: string }[] = [
    {
      id: "docs",
      title: "Product docs / knowledge base",
      description:
        "Turn your existing docs into a searchable, conversational assistant.",
    },
    {
      id: "blog",
      title: "Blog / content hub",
      description:
        "Let visitors explore your long-form content via natural language.",
    },
    {
      id: "product",
      title: "Product marketing site",
      description:
        "Help users discover the right features, plans, and case studies.",
    },
    {
      id: "other",
      title: "Something more custom",
      description: "You have a less standard use case in mind.",
    },
  ];

  return (
    <div className="space-y-5">
      <h3 className="text-base md:text-lg font-semibold text-foreground">
        What are you primarily building with this template?
      </h3>
      <p className="text-sm text-muted-foreground max-w-xl">
        This helps us suggest the right information architecture and first data
        sources to connect.
      </p>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {options.map((option) => {
          const selected = value === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChange(option.id)}
              className={[
                "group text-left rounded-2xl border px-4 py-4 md:px-5 md:py-5 transition-all",
                selected
                  ? "border-accent bg-accent/5 shadow-[0_0_0_1px_rgba(248,250,252,0.12)]"
                  : "border-border-faint hover:border-accent-soft hover:bg-background-base/60",
              ].join(" ")}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {option.title}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {option.description}
                  </p>
                </div>
                <span
                  className={[
                    "mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full border text-[10px] font-medium",
                    selected
                      ? "border-accent bg-accent text-accent-black"
                      : "border-border-faint text-muted-foreground group-hover:border-accent-soft",
                  ].join(" ")}
                >
                  {selected ? "✓" : ""}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface StepDetailsProps {
  pagesPerMonth: number;
  teamSize: number;
  onChange: (partial: Partial<WizardState>) => void;
}

function StepDetails({
  pagesPerMonth,
  teamSize,
  onChange,
}: StepDetailsProps) {
  const clampedPages = Math.min(Math.max(pagesPerMonth || 10, 10), 100000);
  const clampedTeam = Math.min(Math.max(teamSize || 1, 1), 50);

  return (
    <div className="space-y-6">
      <h3 className="text-base md:text-lg font-semibold text-foreground">
        Tell us about expected traffic and collaboration.
      </h3>
      <p className="text-sm text-muted-foreground max-w-xl">
        These don’t need to be precise. They just help us size ingestion and
        decide how opinionated to be about governance.
      </p>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-3">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-foreground">
              Pages to index per month
            </span>
            <span className="text-xs text-muted-foreground">
              Docs, blog posts, or other distinct pieces of content.
            </span>
          </label>

          <div className="space-y-2">
            <input
              type="range"
              min={10}
              max={100000}
              step={10}
              value={clampedPages}
              onChange={(e) =>
                onChange({
                  pagesPerMonth: Number(e.target.value),
                })
              }
              className="w-full accent-accent"
            />
            <div className="flex items-center justify-between gap-3">
              <input
                type="number"
                min={10}
                max={100000}
                step={10}
                value={clampedPages}
                onChange={(e) =>
                  onChange({
                    pagesPerMonth: Number.isNaN(Number(e.target.value))
                      ? 10
                      : Number(e.target.value),
                  })
                }
                className="w-28 rounded-lg border border-border-faint bg-background-base px-3 py-1.5 text-sm outline-none ring-0 focus:border-accent-soft focus:ring-2 focus:ring-accent-soft/40"
              />
              <p className="text-[11px] text-muted-foreground">
                We’ll assume a steady stream instead of one giant import.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-foreground">Core team size</span>
            <span className="text-xs text-muted-foreground">
              Who will maintain content, prompts, and analytics?
            </span>
          </label>

          <div className="space-y-2">
            <input
              type="range"
              min={1}
              max={50}
              step={1}
              value={clampedTeam}
              onChange={(e) =>
                onChange({
                  teamSize: Number(e.target.value),
                })
              }
              className="w-full accent-accent"
            />
            <div className="flex items-center justify-between gap-3">
              <input
                type="number"
                min={1}
                max={50}
                step={1}
                value={clampedTeam}
                onChange={(e) =>
                  onChange({
                    teamSize: Number.isNaN(Number(e.target.value))
                      ? 1
                      : Number(e.target.value),
                  })
                }
                className="w-24 rounded-lg border border-border-faint bg-background-base px-3 py-1.5 text-sm outline-none ring-0 focus:border-accent-soft focus:ring-2 focus:ring-accent-soft/40"
              />
              <p className="text-[11px] text-muted-foreground">
                You can always invite more collaborators later.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface StepReviewProps {
  state: WizardState;
}

function StepReview({ state }: StepReviewProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-base md:text-lg font-semibold text-foreground">
        Here’s the rollout path we recommend.
      </h3>
      <p className="text-sm text-muted-foreground max-w-xl">
        Based on your answers, this is how we’d use this template over the
        first 2–3 weeks. Adjust anything after you clone—this is just a
        starting point.
      </p>

      <ol className="space-y-4 text-sm">
        <li className="flex gap-3">
          <span className="mt-1 h-5 w-5 shrink-0 rounded-full bg-accent/10 text-[11px] font-semibold text-accent flex items-center justify-center">
            1
          </span>
          <div>
            <p className="font-medium text-foreground">
              Stand up your {state.useCase ? formatUseCase(state.useCase) : "primary"} surface.
            </p>
            <p className="text-xs mt-1 text-muted-foreground">
              Connect your main content source and confirm search and chat
              quality in a staging environment before exposing it broadly.
            </p>
          </div>
        </li>
        <li className="flex gap-3">
          <span className="mt-1 h-5 w-5 shrink-0 rounded-full bg-accent/10 text-[11px] font-semibold text-accent flex items-center justify-center">
            2
          </span>
          <div>
            <p className="font-medium text-foreground">
              Plan for{" "}
              {state.pagesPerMonth
                ? `${state.pagesPerMonth.toLocaleString()} pages / month`
                : "ongoing content changes"}
              .
            </p>
            <p className="text-xs mt-1 text-muted-foreground">
              Use incremental crawls or webhooks so that new content is always
              reflected in your AI experience without manual re-ingestion.
            </p>
          </div>
        </li>
        <li className="flex gap-3">
          <span className="mt-1 h-5 w-5 shrink-0 rounded-full bg-accent/10 text-[11px] font-semibold text-accent flex items-center justify-center">
            3
          </span>
          <div>
            <p className="font-medium text-foreground">
              Roll out with a{" "}
              {state.teamSize
                ? `${state.teamSize}-person`
                : "small"}
              {" "}core team.
            </p>
            <p className="text-xs mt-1 text-muted-foreground">
              Start with power users who can triage feedback, tune prompts, and
              propose improvements before shipping to every visitor.
            </p>
          </div>
        </li>
      </ol>
    </div>
  );
}

interface SummaryRowProps {
  label: string;
  children: React.ReactNode;
}

function SummaryRow({ label, children }: SummaryRowProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-xs font-medium text-foreground/80">{label}</span>
      <span className="text-xs text-muted-foreground text-right">
        {children}
      </span>
    </div>
  );
}

function formatUseCase(useCase: UseCase): string {
  switch (useCase) {
    case "docs":
      return "documentation assistant";
    case "blog":
      return "content discovery hub";
    case "product":
      return "product marketing companion";
    case "other":
      return "custom AI surface";
    default:
      return "site";
  }
}

