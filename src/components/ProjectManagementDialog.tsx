import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Deal {
  id: string;
  project_title: string;
  company_name: string;
  provider_name: string;
  deal_value: number | null;
  location: string | null;
  project_status: string | null;
  provider_updates: string[] | null;
}

interface ProjectManagementDialogProps {
  deal: Deal | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

export const ProjectManagementDialog = ({
  deal,
  open,
  onOpenChange,
  onUpdate,
}: ProjectManagementDialogProps) => {
  const [updateText, setUpdateText] = useState('');
  const [projectStatus, setProjectStatus] = useState(deal?.project_status || 'not_started');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { userRole } = useAuth();

  const handleSubmitUpdate = async () => {
    if (!deal) return;
    
    setLoading(true);
    try {
      const updates = deal.provider_updates || [];
      const timestamp = new Date().toISOString();
      const newUpdate = `${timestamp}: ${updateText}`;
      
      const { error } = await supabase
        .from('deals')
        .update({
          provider_updates: [...updates, newUpdate],
          project_status: projectStatus,
        } as any)
        .eq('id', deal.id);

      if (error) throw error;

      toast({
        title: 'Update Posted',
        description: 'Project update has been shared with the company.',
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
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Project: {deal.project_title}</DialogTitle>
          <DialogDescription>
            {deal.company_name} • {deal.provider_name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Project Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Deal Value</p>
              <p className="text-lg font-semibold">
                {deal.deal_value ? `$${deal.deal_value.toLocaleString()}` : 'Not specified'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="text-lg font-semibold">{deal.location || 'Not specified'}</p>
            </div>
          </div>

          {/* Project Status */}
          <div>
            <Label>Project Status</Label>
            <Select
              value={projectStatus}
              onValueChange={setProjectStatus}
              disabled={!isProvider}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="not_started">Not Started</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="on_hold">On Hold</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Provider Updates */}
          <div>
            <Label>Project Updates</Label>
            <div className="mt-2 space-y-2 max-h-60 overflow-y-auto">
              {deal.provider_updates && deal.provider_updates.length > 0 ? (
                deal.provider_updates.map((update, index) => {
                  const [timestamp, ...messageParts] = update.split(': ');
                  const message = messageParts.join(': ');
                  return (
                    <div key={index} className="p-3 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        {new Date(timestamp).toLocaleString()}
                      </p>
                      <p className="text-sm mt-1">{message}</p>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-muted-foreground">No updates yet</p>
              )}
            </div>
          </div>

          {/* Add New Update (Provider Only) */}
          {isProvider && (
            <div>
              <Label htmlFor="update">Add Update</Label>
              <Textarea
                id="update"
                value={updateText}
                onChange={(e) => setUpdateText(e.target.value)}
                placeholder="Enter project update for the company..."
                className="mt-2"
                rows={4}
              />
              <Button
                onClick={handleSubmitUpdate}
                disabled={!updateText.trim() || loading}
                className="mt-2"
              >
                {loading ? 'Posting...' : 'Post Update'}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
