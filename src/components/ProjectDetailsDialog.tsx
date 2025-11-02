import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, MapPin, DollarSign, TrendingUp } from "lucide-react";

interface Project {
  id: string;
  title: string;
  type: string;
  status: string;
  progress: number;
  team: string;
  location: string;
  startDate: string;
  estimatedCompletion: string;
  budget: string;
  lastUpdate: string;
}

interface ProjectDetailsDialogProps {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "In Progress": return "bg-primary/10 text-primary border-primary/20";
    case "Review": return "bg-accent/10 text-accent border-accent/20";
    case "Completed": return "bg-green-500/10 text-green-600 border-green-500/20";
    default: return "bg-muted text-muted-foreground";
  }
};

export function ProjectDetailsDialog({
  project,
  open,
  onOpenChange,
}: ProjectDetailsDialogProps) {
  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">{project.title}</DialogTitle>
          <DialogDescription>Project ID: {project.id}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Badge variant="secondary">{project.type}</Badge>
            <Badge className={getStatusColor(project.status)}>
              {project.status}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Team</div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="font-medium">{project.team}</span>
                </div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground mb-1">Location</div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="font-medium">{project.location}</span>
                </div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground mb-1">Budget</div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-primary" />
                  <span className="font-medium">{project.budget}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Start Date</div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="font-medium">{project.startDate}</span>
                </div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground mb-1">Est. Completion</div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="font-medium">{project.estimatedCompletion}</span>
                </div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground mb-1">Progress</div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="font-medium">{project.progress}%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              Last update: {project.lastUpdate}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
