import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, X } from "lucide-react";

interface Milestone {
  id: string;
  title: string;
  completed: boolean;
}

interface CreateDealDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  providerId: string;
  providerName: string;
  providerType: string;
}

const PRESET_MILESTONES = [
  "Team Mobilization",
  "Site Survey Complete",
  "Material Procurement",
  "Installation Started",
  "Installation Complete",
  "Testing & Commissioning",
  "Documentation Handover",
  "Project Closeout"
];

export function CreateDealDialog({
  open,
  onOpenChange,
  providerId,
  providerName,
  providerType,
}: CreateDealDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [newMilestone, setNewMilestone] = useState("");
  const [formData, setFormData] = useState({
    projectId: "",
    projectTitle: "",
    companyName: "",
    companyEmail: "",
    contactPhone: "",
    dealType: "",
    dealValue: "",
    location: "",
    notes: "",
  });

  const addMilestone = (title: string) => {
    if (title.trim() && !milestones.find(m => m.title === title.trim())) {
      const milestone: Milestone = {
        id: `milestone-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        title: title.trim(),
        completed: false,
      };
      setMilestones([...milestones, milestone]);
      setNewMilestone("");
    }
  };

  const removeMilestone = (id: string) => {
    setMilestones(milestones.filter(m => m.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const insertData = {
        project_id: formData.projectId,
        project_title: formData.projectTitle,
        company_name: formData.companyName,
        company_email: formData.companyEmail || null,
        contact_phone: formData.contactPhone || null,
        provider_id: providerId,
        provider_name: providerName,
        provider_type: providerType,
        deal_type: formData.dealType,
        deal_value: formData.dealValue ? parseFloat(formData.dealValue) : null,
        location: formData.location || null,
        notes: formData.notes || null,
        status: "pending",
        start_date: new Date().toISOString(),
        milestones: milestones as any,
        progress: 0,
        project_status: "not_started",
      };
      const { error } = await supabase.from("deals").insert(insertData as any);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Deal created successfully! You can track it in the Deals page.",
      });

      // Reset form
      setFormData({
        projectId: "",
        projectTitle: "",
        companyName: "",
        companyEmail: "",
        contactPhone: "",
        dealType: "",
        dealValue: "",
        location: "",
        notes: "",
      });
      setMilestones([]);

      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Deal with {providerName}</DialogTitle>
          <DialogDescription>
            Fill in the details to create a deal. This will be tracked in the Deals page.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="projectId">Project ID *</Label>
              <Input
                id="projectId"
                required
                value={formData.projectId}
                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                placeholder="PRJ-001"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectTitle">Project Title *</Label>
              <Input
                id="projectTitle"
                required
                value={formData.projectTitle}
                onChange={(e) => setFormData({ ...formData, projectTitle: e.target.value })}
                placeholder="Solar Farm Installation"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name *</Label>
              <Input
                id="companyName"
                required
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="Your Company"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyEmail">Company Email</Label>
              <Input
                id="companyEmail"
                type="email"
                value={formData.companyEmail}
                onChange={(e) => setFormData({ ...formData, companyEmail: e.target.value })}
                placeholder="contact@company.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Contact Phone</Label>
              <Input
                id="contactPhone"
                type="tel"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Phoenix, AZ"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dealType">Deal Type *</Label>
              <Input
                id="dealType"
                required
                value={formData.dealType}
                onChange={(e) => setFormData({ ...formData, dealType: e.target.value })}
                placeholder="I&C Services, Tool Rental, etc."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dealValue">Deal Value ($)</Label>
              <Input
                id="dealValue"
                type="number"
                min="0"
                step="0.01"
                value={formData.dealValue}
                onChange={(e) => setFormData({ ...formData, dealValue: e.target.value })}
                placeholder="45000"
              />
            </div>
          </div>

          {/* Milestones Section */}
          <div className="space-y-3">
            <Label>Project Milestones</Label>
            
            {/* Preset Milestones */}
            <div className="flex flex-wrap gap-2">
              {PRESET_MILESTONES.map((preset) => {
                const isAdded = milestones.find(m => m.title === preset);
                return (
                  <Button
                    key={preset}
                    type="button"
                    variant={isAdded ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => isAdded ? removeMilestone(milestones.find(m => m.title === preset)!.id) : addMilestone(preset)}
                    className="text-xs"
                  >
                    {isAdded ? <X className="w-3 h-3 mr-1" /> : <Plus className="w-3 h-3 mr-1" />}
                    {preset}
                  </Button>
                );
              })}
            </div>

            {/* Custom Milestone Input */}
            <div className="flex gap-2">
              <Input
                placeholder="Add custom milestone..."
                value={newMilestone}
                onChange={(e) => setNewMilestone(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMilestone(newMilestone))}
              />
              <Button 
                type="button" 
                onClick={() => addMilestone(newMilestone)} 
                variant="outline" 
                size="icon"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Added Milestones */}
            {milestones.length > 0 && (
              <div className="flex flex-wrap gap-2 p-3 bg-muted/30 rounded-lg border border-border/50">
                {milestones.map((milestone) => (
                  <Badge key={milestone.id} variant="secondary" className="gap-1 pr-1">
                    {milestone.title}
                    <button
                      type="button"
                      onClick={() => removeMilestone(milestone.id)}
                      className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional details about the project..."
              rows={4}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Create Deal
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}