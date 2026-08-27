import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatTileProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  tone?: "primary" | "accent" | "secondary";
  hint?: string;
  delay?: number;
}

const toneMap = {
  primary: "text-primary bg-primary/10 ring-primary/20",
  accent: "text-accent bg-accent/10 ring-accent/20",
  secondary: "text-secondary bg-secondary/10 ring-secondary/20",
};

export const StatTile = ({ icon: Icon, value, label, tone = "primary", hint, delay = 0 }: StatTileProps) => (
  <div
    className="group relative overflow-hidden rounded-xl border border-border/60 bg-card p-5 shadow-card-hover transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated animate-fade-in"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-gradient-to-br from-primary/5 via-transparent to-accent/10" />
    <div className="relative flex items-center gap-3">
      <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl ring-1 transition-transform duration-300 group-hover:scale-110", toneMap[tone])}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-bold leading-tight tracking-tight truncate">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
    {hint && <p className="relative mt-3 text-[11px] font-medium text-primary">{hint}</p>}
  </div>
);
