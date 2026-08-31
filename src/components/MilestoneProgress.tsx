import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle } from 'lucide-react';
import { DEFAULT_MILESTONES, type Milestone } from '@/lib/milestones';

interface MilestoneProgressProps {
  milestones?: Milestone[] | null;
}

export function MilestoneProgress({ milestones }: MilestoneProgressProps) {
  const list: Milestone[] =
    milestones && milestones.length > 0 ? milestones : DEFAULT_MILESTONES;
  const completed = list.filter((m) => m.completed).length;
  const percent = Math.round((completed / list.length) * 100);

  return (
    <div className="border-t pt-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium">Milestones</p>
        <span className="text-xs text-muted-foreground">
          {completed} of {list.length} completed · {percent}%
        </span>
      </div>
      <Progress value={percent} className="h-1.5 mb-3" />
      <div className="flex flex-wrap gap-2">
        {list.map((milestone) => (
          <Badge
            key={milestone.id}
            variant={milestone.completed ? 'default' : 'outline'}
            className={
              milestone.completed
                ? 'bg-green-500/10 text-green-600 border-green-500/20'
                : 'text-muted-foreground'
            }
          >
            {milestone.completed ? (
              <CheckCircle className="w-3 h-3 mr-1" />
            ) : (
              <Circle className="w-3 h-3 mr-1" />
            )}
            {milestone.title}
          </Badge>
        ))}
      </div>
    </div>
  );
}
