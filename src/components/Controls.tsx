import { Button } from "@/components/ui/button";
import { ArrowUp, RotateCcw, RotateCw } from "lucide-react";

interface ControlsProps {
  onMove: () => void;
  onRotate: (direction: 'left' | 'right') => void;
}

export const Controls = ({ onMove, onRotate }: ControlsProps) => {
  return (
    <div className="flex gap-4 items-center justify-center mt-6">
      <Button
        variant="outline"
        size="lg"
        onClick={() => onRotate('left')}
        className="p-6"
      >
        <RotateCcw className="h-6 w-6" />
      </Button>
      
      <Button
        size="lg"
        onClick={onMove}
        className="p-6"
      >
        <ArrowUp className="h-6 w-6" />
      </Button>
      
      <Button
        variant="outline"
        size="lg"
        onClick={() => onRotate('right')}
        className="p-6"
      >
        <RotateCw className="h-6 w-6" />
      </Button>
    </div>
  );
};