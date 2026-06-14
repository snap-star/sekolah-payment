import { RefreshCcw } from 'lucide-react';
import { Label } from '../ui/label';
import { Progress } from '../ui/progress';

interface LoadingStateProps {
  progress: number;
}

export function LoadingState({ progress }: LoadingStateProps) {
  return (
    <div className="p-4 select-none flex flex-col gap-4 items-center justify-center min-h-[60vh]">
      <RefreshCcw className="animate-spin mr-2 inline-block h-8 w-8 text-primary" />
      <Label htmlFor="progress" className="text-2xl font-semibold">Memuat data siswa ...</Label>
      <div className="w-80 mt-2">
        <Progress value={progress} className="w-full h-3" />
        <p className="text-center text-sm text-muted-foreground mt-2">{Math.round(progress)}%</p>
      </div>
    </div>
  );
}