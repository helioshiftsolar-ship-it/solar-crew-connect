import { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Video, VideoOff, PhoneOff, MonitorUp, Users } from 'lucide-react';

interface VideoCallDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipientName: string;
  dealTitle: string;
}

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

export function VideoCallDialog({
  open,
  onOpenChange,
  recipientName,
  dealTitle,
}: VideoCallDialogProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [connected, setConnected] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const stopStream = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  };

  useEffect(() => {
    if (!open) {
      stopStream();
      setConnected(false);
      setSeconds(0);
      setMicOn(true);
      setCamOn(true);
      setCameraError(null);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch {
        if (!cancelled) setCameraError('Camera unavailable — joining with video off.');
      }
    })();

    const connectTimer = setTimeout(() => setConnected(true), 1600);
    return () => {
      cancelled = true;
      clearTimeout(connectTimer);
      stopStream();
    };
  }, [open]);

  useEffect(() => {
    if (!connected) return;
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [connected]);

  const toggleMic = () => {
    const next = !micOn;
    setMicOn(next);
    streamRef.current?.getAudioTracks().forEach((t) => (t.enabled = next));
  };

  const toggleCam = () => {
    const next = !camOn;
    setCamOn(next);
    streamRef.current?.getVideoTracks().forEach((t) => (t.enabled = next));
  };

  const duration = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden border-border/60">
        <DialogTitle className="sr-only">Video call with {recipientName}</DialogTitle>

        <div className="relative aspect-video bg-gradient-to-br from-muted/40 via-background to-background">
          {/* Remote participant */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <Avatar className="h-24 w-24 border border-primary/30">
              <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                {getInitials(recipientName)}
              </AvatarFallback>
            </Avatar>
            <p className="text-lg font-semibold">{recipientName}</p>
            <Badge variant="outline" className="border-primary/30 text-primary">
              {connected ? `Connected · ${duration}` : 'Connecting…'}
            </Badge>
          </div>

          {/* Local preview */}
          <div className="absolute bottom-4 right-4 w-40 aspect-video rounded-lg overflow-hidden border border-border/70 bg-muted/60 shadow-lg">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className={`w-full h-full object-cover ${camOn && !cameraError ? '' : 'hidden'}`}
            />
            {(!camOn || cameraError) && (
              <div className="w-full h-full flex items-center justify-center">
                <VideoOff className="w-5 h-5 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Header info */}
          <div className="absolute top-4 left-4 space-y-1">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Project call</p>
            <p className="text-sm font-medium">{dealTitle}</p>
            {cameraError && <p className="text-xs text-muted-foreground">{cameraError}</p>}
          </div>

          <div className="absolute top-4 right-4 flex items-center gap-1 text-xs text-muted-foreground">
            <Users className="w-3.5 h-3.5" /> 2
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3 p-4 border-t bg-card">
          <Button variant={micOn ? 'outline' : 'secondary'} size="icon" onClick={toggleMic} aria-label="Toggle microphone">
            {micOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
          </Button>
          <Button variant={camOn ? 'outline' : 'secondary'} size="icon" onClick={toggleCam} aria-label="Toggle camera">
            {camOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
          </Button>
          <Button variant="outline" size="icon" aria-label="Share screen">
            <MonitorUp className="w-4 h-4" />
          </Button>
          <Button variant="destructive" className="gap-2" onClick={() => onOpenChange(false)}>
            <PhoneOff className="w-4 h-4" />
            End call
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
