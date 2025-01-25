import { Direction } from "@/lib/gameLogic";

const directionRotation = {
  up: "rotate-0",
  right: "rotate-90",
  down: "rotate-180",
  left: "-rotate-90"
};

export const Robot = ({ direction }: { direction: Direction }) => {
  return (
    <div className={`w-full h-full robot-transition ${directionRotation[direction]}`}>
      <div className="w-full h-full bg-primary rounded-full flex items-center justify-center transform">
        <div className="w-1/2 h-1 bg-white rounded-full transform -translate-y-1"></div>
      </div>
    </div>
  );
};