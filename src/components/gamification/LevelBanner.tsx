import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Award, Flame, Rocket, Shield, Star, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

const LEVELS = [
  { name: "Starter", min: 0, icon: Rocket },
  { name: "Pro", min: 3, icon: Shield },
  { name: "Expert", min: 8, icon: Star },
  { name: "Elite", min: 15, icon: Trophy },
];

interface LevelBannerProps {
  name: string;
  completed: number;
  active: number;
  rating?: number;
  coins?: number;
  subtitle?: string;
}

export const LevelBanner = ({ name, completed, active, rating = 0, coins = 0, subtitle }: LevelBannerProps) => {
  const idx = LEVELS.reduce((acc, l, i) => (completed >= l.min ? i : acc), 0);
  const level = LEVELS[idx];
  const next = LEVELS[idx + 1];
  const floor = level.min;
  const ceil = next ? next.min : level.min + 5;
  const pct = Math.min(100, Math.round(((completed - floor) / (ceil - floor)) * 100));
  const LevelIcon = level.icon;

  const achievements = [
    { label: "First Deal", earned: completed + active > 0, icon: Rocket },
    { label: "Trusted", earned: rating >= 4, icon: Star },
    { label: "On a Roll", earned: active >= 2, icon: Flame },
    { label: "Coin Collector", earned: coins >= 100, icon: Award },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-hero p-6 mb-8 shadow-elevated animate-fade-in">
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/25 blur-3xl" />
      <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-foreground/10 ring-1 ring-primary-foreground/20 backdrop-blur-sm">
            <LevelIcon className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-primary-foreground/70">Level {idx + 1} · {level.name}</p>
            <h2 className="text-2xl font-bold text-primary-foreground">{name}</h2>
            {subtitle && <p className="text-sm text-primary-foreground/70">{subtitle}</p>}
          </div>
        </div>

        <div className="w-full md:max-w-sm">
          <div className="mb-2 flex items-center justify-between text-xs text-primary-foreground/80">
            <span>Progress to {next ? next.name : "Legend"}</span>
            <span className="font-semibold">{completed}/{ceil} projects</span>
          </div>
          <Progress value={pct} className="h-2 bg-primary-foreground/20" />
          <div className="mt-4 flex flex-wrap gap-2">
            {achievements.map((a) => (
              <Badge
                key={a.label}
                variant="outline"
                className={cn(
                  "gap-1 border-primary-foreground/25 bg-primary-foreground/10 text-primary-foreground backdrop-blur-sm transition-opacity",
                  !a.earned && "opacity-40"
                )}
              >
                <a.icon className="h-3 w-3" />
                {a.label}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
