import { Battery } from "lucide-react";

interface BatteryIndicatorProps {
  battery: number;
}

export const BatteryIndicator = ({ battery }: BatteryIndicatorProps) => {
  return (
    <div className="flex items-center gap-2 justify-center">
      <Battery className="w-6 h-6" />
      <div className="w-32 h-4 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-green-500 transition-all duration-300"
          style={{ width: `${battery}%` }}
        />
      </div>
    </div>
  );
};