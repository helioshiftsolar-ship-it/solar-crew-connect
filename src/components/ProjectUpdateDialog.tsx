import { useState, useEffect, useRef } from 'react';
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
  Calendar,
  X,
  Loader2,
  FileText,
  Download,
  File
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
  company_documents: string[] | null;
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
  const [projectImages, setProjectImages] = useState<string[]>([]);
  const [companyDocuments, setCompanyDocuments] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { userRole } = useAuth();

  useEffect(() => {
    if (deal) {
      setProjectStatus(deal.project_status || 'not_started');
      setProgress(deal.progress || 0);
      setMilestones(deal.milestones || []);
      setProjectImages(deal.project_images || []);
      setCompanyDocuments(deal.company_documents || []);
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
    const updatedMilestones = milestones.map(m => 
      m.id === id ? { ...m, completed: !m.completed } : m
    );
    setMilestones(updatedMilestones);
    
    // Update progress based on completed milestones
    const completedCount = updatedMilestones.filter(m => m.completed).length;
    if (updatedMilestones.length > 0) {
      setProgress(Math.round((completedCount / updatedMilestones.length) * 100));
    }
  };

  const removeMilestone = (id: string) => {
    const updatedMilestones = milestones.filter(m => m.id !== id);
    setMilestones(updatedMilestones);
    
    // Recalculate progress
    const completedCount = updatedMilestones.filter(m => m.completed).length;
    if (updatedMilestones.length > 0) {
      setProgress(Math.round((completedCount / updatedMilestones.length) * 100));
    } else {
      setProgress(0);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !deal) return;

    setUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (const file of Array.from(files)) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${deal.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { error: uploadError, data } = await supabase.storage
          .from('project-images')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('project-images')
          .getPublicUrl(fileName);

        uploadedUrls.push(publicUrl);
      }

      setProjectImages([...projectImages, ...uploadedUrls]);
      toast({
        title: 'Images Uploaded',
        description: `${uploadedUrls.length} image(s) uploaded successfully.`,
      });
    } catch (error: any) {
      toast({
        title: 'Upload Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = (urlToRemove: string) => {
    setProjectImages(projectImages.filter(url => url !== urlToRemove));
  };

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !deal) return;

    setUploadingDoc(true);
    const uploadedUrls: string[] = [];

    try {
      for (const file of Array.from(files)) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${deal.id}/${Date.now()}-${file.name}`;

        const { error: uploadError, data } = await supabase.storage
          .from('project-documents')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('project-documents')
          .getPublicUrl(fileName);

        uploadedUrls.push(publicUrl);
      }

      setCompanyDocuments([...companyDocuments, ...uploadedUrls]);
      toast({
        title: 'Documents Uploaded',
        description: `${uploadedUrls.length} document(s) uploaded successfully.`,
      });
    } catch (error: any) {
      toast({
        title: 'Upload Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setUploadingDoc(false);
      if (docInputRef.current) {
        docInputRef.current.value = '';
      }
    }
  };

  const removeDocument = (urlToRemove: string) => {
    setCompanyDocuments(companyDocuments.filter(url => url !== urlToRemove));
  };

  const getFileNameFromUrl = (url: string) => {
    const parts = url.split('/');
    const fileName = parts[parts.length - 1];
    // Remove timestamp prefix if present
    const nameWithoutTimestamp = fileName.replace(/^\d+-/, '');
    return decodeURIComponent(nameWithoutTimestamp);
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
          project_images: projectImages,
          company_documents: companyDocuments,
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
              <SelectTrigger className="mt-2 bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-background border shadow-lg z-50">
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
              {milestones.length === 0 ? (
                <p className="text-sm text-muted-foreground p-3 bg-muted/30 rounded-lg">
                  No milestones added yet
                </p>
              ) : (
                milestones.map((milestone) => (
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
                ))
              )}
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

          {/* Project Images */}
          <div className="space-y-3">
            <Label>Project Images</Label>
            
            {/* Image Grid */}
            {projectImages.length > 0 && (
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                {projectImages.map((url, index) => (
                  <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border border-border">
                    <img 
                      src={url} 
                      alt={`Project image ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                    {isProvider && (
                      <button
                        onClick={() => removeImage(url)}
                        className="absolute top-1 right-1 p-1 bg-destructive/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Upload Button */}
            {isProvider && (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="gap-2"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Upload Images
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Document Sharing Section */}
            <div className="space-y-3 p-4 bg-muted/30 rounded-lg border border-border/50">
              <Label className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                {isProvider ? 'Shared Documents from Company' : 'Share Documents with Provider'}
              </Label>
              
              {/* Display uploaded documents */}
              {companyDocuments.length > 0 && (
                <div className="space-y-2">
                  {companyDocuments.map((url, index) => (
                    <div 
                      key={index} 
                      className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border"
                    >
                      <File className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-sm flex-1 truncate">{getFileNameFromUrl(url)}</span>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => window.open(url, '_blank')}
                          className="h-8 w-8"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        {!isProvider && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeDocument(url)}
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            title="Remove"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {companyDocuments.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  {isProvider ? 'No documents shared yet' : 'Share project-related documents, specifications, or files with the service provider.'}
                </p>
              )}

              {/* Upload Button for Companies */}
              {!isProvider && (
                <div>
                  <input
                    ref={docInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.png,.jpg,.jpeg,.zip"
                    multiple
                    onChange={handleDocumentUpload}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    onClick={() => docInputRef.current?.click()}
                    disabled={uploadingDoc}
                    className="gap-2 w-full"
                  >
                    {uploadingDoc ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        Upload Documents
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
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