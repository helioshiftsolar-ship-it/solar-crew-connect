import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ShieldCheck, Clock, Users } from "lucide-react";

const consolePanels = [
  { label: "Capacity Under Management", value: "1.2GW+", bar: 74 },
  { label: "Engineers Online Now", value: "480+", bar: 58 },
];

export const Hero = () => {
  return (
    <section className="relative overflow-hidden pt-28 pb-24">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/4 -z-10 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />

      <div className="container relative z-10 mx-auto px-6">
        {/* Headline block */}
        <div className="mx-auto mb-16 max-w-4xl text-center animate-fade-in">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            Next-Gen EPC Marketplace
          </div>

          <h1 className="mb-6 text-5xl font-bold leading-[1.1] text-foreground md:text-7xl">
            The Operating System for{" "}
            <span className="bg-gradient-to-r from-primary to-accent-light bg-clip-text text-transparent">
              Solar EPC
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            Connect with top-tier I&amp;C engineers, tool providers and service specialists — then run
            every milestone, document and payment of the job in one unified interface.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/signup" className="w-full sm:w-auto">
              <Button size="lg" className="w-full rounded-xl px-8 py-6 text-base font-bold shadow-solar transition-transform hover:scale-105">
                Launch a Project
              </Button>
            </Link>
            <Link to="/find-services" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full rounded-xl border-border bg-card px-8 py-6 text-base font-bold text-foreground hover:border-primary/50 hover:bg-card"
              >
                View Directory
              </Button>
            </Link>
          </div>
        </div>

        {/* Live console mockup */}
        <div className="relative mx-auto max-w-5xl animate-pop-in">
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary/30 to-accent/20 opacity-20 blur-2xl" />
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-elevated">
            {/* Console header */}
            <div className="flex items-center justify-between border-b border-border bg-muted/40 px-6 py-4">
              <div className="flex gap-1.5">
                <span className="h-3 w-3 rounded-full border border-destructive/40 bg-destructive/20" />
                <span className="h-3 w-3 rounded-full border border-primary/30 bg-primary/10" />
                <span className="h-3 w-3 rounded-full border border-accent/40 bg-accent/20" />
              </div>
              <div className="hidden gap-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 sm:flex">
                <span>Pipeline</span>
                <span>Marketplace</span>
                <span className="text-primary">Active Projects</span>
              </div>
              <div className="w-12" />
            </div>

            {/* Console body */}
            <div className="grid grid-cols-12 gap-6 p-6">
              <div className="col-span-12 space-y-4 md:col-span-3">
                {consolePanels.map((p) => (
                  <div key={p.label} className="rounded-xl border border-border bg-background p-4">
                    <div className="mb-3 text-[10px] uppercase tracking-tight text-muted-foreground">
                      {p.label}
                    </div>
                    <div className="text-2xl font-bold text-foreground">{p.value}</div>
                    <div className="mt-2 h-1 w-full rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary shadow-solar"
                        style={{ width: `${p.bar}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="col-span-12 space-y-4 md:col-span-9">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">Marketplace Flow</h3>
                  <div className="flex -space-x-2">
                    <span className="h-8 w-8 rounded-full border-2 border-card bg-secondary" />
                    <span className="h-8 w-8 rounded-full border-2 border-card bg-secondary-light" />
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-card bg-primary text-[10px] font-bold text-primary-foreground">
                      +12
                    </span>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 transition-colors hover:bg-primary/10">
                    <div className="mb-4 flex items-start justify-between">
                      <div className="rounded-lg bg-primary/20 p-2 text-primary">
                        <ShieldCheck className="h-5 w-5" />
                      </div>
                      <span className="text-[10px] font-bold text-primary">ACTIVE</span>
                    </div>
                    <div className="mb-1 font-semibold text-foreground">I&amp;C Structural Review</div>
                    <div className="text-xs text-muted-foreground">Engineer: Sarah Jenkins</div>
                  </div>

                  <div className="rounded-xl border border-border bg-muted/40 p-4">
                    <div className="mb-4 flex items-start justify-between">
                      <div className="rounded-lg bg-muted p-2 text-muted-foreground">
                        <Clock className="h-5 w-5" />
                      </div>
                      <span className="text-[10px] font-bold text-muted-foreground/60">PENDING</span>
                    </div>
                    <div className="mb-1 font-semibold text-muted-foreground">Tool Logistics #44</div>
                    <div className="text-xs text-muted-foreground/70">Provider: HeavyGrid Inc.</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-border bg-background p-4">
                  <div className="rounded-lg bg-accent/10 p-2 text-accent">
                    <Users className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-foreground">Commissioning Crew — Phoenix, AZ</div>
                    <div className="text-xs text-muted-foreground">Milestone 3 of 5 · Testing &amp; Commissioning</div>
                  </div>
                  <div className="hidden h-1.5 w-32 rounded-full bg-muted sm:block">
                    <div className="h-full w-3/5 rounded-full bg-accent" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
