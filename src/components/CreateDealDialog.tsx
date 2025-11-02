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
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface CreateDealDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  providerId: string;
  providerName: string;
  providerType: string;
}

export function CreateDealDialog({
  open,
  onOpenChange,
  providerId,
  providerName,
  providerType,
}: CreateDealDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("deals").insert({
        project_id: formData.projectId,
        project_title: formData.projectTitle,
        company_name: formData.companyName,
        company_email: formData.companyEmail,
        contact_phone: formData.contactPhone,
        provider_id: providerId,
        provider_name: providerName,
        provider_type: providerType,
        deal_type: formData.dealType,
        deal_value: formData.dealValue ? parseFloat(formData.dealValue) : null,
        location: formData.location,
        notes: formData.notes,
        status: "pending",
        start_date: new Date().toISOString(),
      });

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
