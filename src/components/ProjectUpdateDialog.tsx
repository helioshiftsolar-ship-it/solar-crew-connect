import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { 
  Plus, 
  Trash2, 
  Upload, 
  Image as ImageIcon,
  CheckCircle,
  Clock,
  MapPin,
  DollarSign,
  Calendar
} from 'lucide-react';

interface Milestone {
  id: string;
  title: string;
  completed: boolean;
}

interface Deal {
  id: string;
  project_id: string;
  project_title: string;
  company_name: string;
  provider_name: string;
  deal_value: number | null;
  location: string | null;
  project_status: string | null;
  provider_updates: string[] | null;
  progress: number | null;
  milestones: Milestone[] | null;
  project_images: string[] | null;
  start_date: string | null;
  completion_date: string | null;
}

interface ProjectUpdateDialogProps {
  deal: Deal | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

export const ProjectUpdateDialog = ({
  deal,
  open,
  onOpenChange,
  onUpdate,
}: ProjectUpdateDialogProps) => {
  const [updateText, setUpdateText] = useState('');
  const [projectStatus, setProjectStatus] = useState('not_started');
  const [progress, setProgress] = useState(0);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [newMilestone, setNewMilestone] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { userRole } = useAuth();

  useEffect(() => {
    if (deal) {
      setProjectStatus(deal.project_status || 'not_started');
      setProgress(deal.progress || 0);
      setMilestones(deal.milestones || []);
    }
  }, [deal]);

  const addMilestone = () => {
    if (newMilestone.trim()) {
      const milestone: Milestone = {
        id: `milestone-${Date.now()}`,
        title: newMilestone.trim(),
        completed: false,
      };
      setMilestones([...milestones, milestone]);
      setNewMilestone('');
    }
  };

  const toggleMilestone = (id: string) => {
    setMilestones(milestones.map(m => 
      m.id === id ? { ...m, completed: !m.completed } : m
    ));
    // Update progress based on completed milestones
    const updatedMilestones = milestones.map(m => 
      m.id === id ? { ...m, completed: !m.completed } : m
    );
    const completedCount = updatedMilestones.filter(m => m.completed).length;
    if (updatedMilestones.length > 0) {
      setProgress(Math.round((completedCount / updatedMilestones.length) * 100));
    }
  };

  const removeMilestone = (id: string) => {
    setMilestones(milestones.filter(m => m.id !== id));
  };

  const handleSubmitUpdate = async () => {
    if (!deal) return;
    
    setLoading(true);
    try {
      const updates = deal.provider_updates || [];
      const timestamp = new Date().toISOString();
      const newUpdates = updateText.trim() 
        ? [...updates, `${timestamp}: ${updateText}`]
        : updates;
      
      const { error } = await supabase
        .from('deals')
        .update({
          provider_updates: newUpdates,
          project_status: projectStatus,
          progress: progress,
          milestones: milestones,
          last_update_at: new Date().toISOString(),
        } as any)
        .eq('id', deal.id);

      if (error) throw error;

      toast({
        title: 'Project Updated',
        description: 'Project details have been saved successfully.',
      });
      
      setUpdateText('');
      onUpdate();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!deal) return null;

  const isProvider = userRole === 'provider';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{deal.project_title}</DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            <span>ID: {deal.project_id}</span>
            <span>•</span>
            <span>{deal.company_name}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Project Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                <DollarSign className="w-4 h-4" />
                Budget
              </div>
              <p className="font-semibold">
                {deal.deal_value ? `$${deal.deal_value.toLocaleString()}` : 'N/A'}
              </p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                <MapPin className="w-4 h-4" />
                Location
              </div>
              <p className="font-semibold">{deal.location || 'N/A'}</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                <Calendar className="w-4 h-4" />
                Start Date
              </div>
              <p className="font-semibold">
                {deal.start_date ? new Date(deal.start_date).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                <Clock className="w-4 h-4" />
                Due Date
              </div>
              <p className="font-semibold">
                {deal.completion_date ? new Date(deal.completion_date).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>

          {/* Progress Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Overall Progress</Label>
              <span className="text-sm font-semibold text-primary">{progress}%</span>
            </div>
            <Progress value={progress} className="h-3" />
            {isProvider && (
              <Input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => setProgress(parseInt(e.target.value))}
                className="w-full"
              />
            )}
          </div>

          {/* Project Status */}
          <div>
            <Label>Project Status</Label>
            <Select
              value={projectStatus}
              onValueChange={setProjectStatus}
              disabled={!isProvider}
            >
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="not_started">Not Started</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="review">Under Review</SelectItem>
                <SelectItem value="on_hold">On Hold</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Milestones */}
          <div className="space-y-3">
            <Label>Project Milestones</Label>
            <div className="space-y-2">
              {milestones.map((milestone) => (
                <div 
                  key={milestone.id} 
                  className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-border/50"
                >
                  <Checkbox
                    checked={milestone.completed}
                    onCheckedChange={() => isProvider && toggleMilestone(milestone.id)}
                    disabled={!isProvider}
                  />
                  <span className={milestone.completed ? 'line-through text-muted-foreground flex-1' : 'flex-1'}>
                    {milestone.title}
                  </span>
                  {milestone.completed && (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  )}
                  {isProvider && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeMilestone(milestone.id)}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            
            {isProvider && (
              <div className="flex gap-2">
                <Input
                  placeholder="Add new milestone..."
                  value={newMilestone}
                  onChange={(e) => setNewMilestone(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addMilestone()}
                />
                <Button onClick={addMilestone} variant="outline" size="icon">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Provider Updates History */}
          <div>
            <Label>Update History</Label>
            <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
              {deal.provider_updates && deal.provider_updates.length > 0 ? (
                deal.provider_updates.slice().reverse().map((update, index) => {
                  const [timestamp, ...messageParts] = update.split(': ');
                  const message = messageParts.join(': ');
                  return (
                    <div key={index} className="p-3 bg-muted/30 rounded-lg border border-border/50">
                      <p className="text-xs text-muted-foreground">
                        {new Date(timestamp).toLocaleString()}
                      </p>
                      <p className="text-sm mt-1">{message}</p>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-muted-foreground p-3 bg-muted/30 rounded-lg">
                  No updates yet
                </p>
              )}
            </div>
          </div>

          {/* Add New Update (Provider Only) */}
          {isProvider && (
            <div className="space-y-2">
              <Label htmlFor="update">Add Project Update</Label>
              <Textarea
                id="update"
                value={updateText}
                onChange={(e) => setUpdateText(e.target.value)}
                placeholder="Enter project update for the company..."
                rows={3}
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Close
            </Button>
            {isProvider && (
              <Button
                onClick={handleSubmitUpdate}
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};