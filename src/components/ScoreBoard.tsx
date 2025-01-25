import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ScoreBoardProps {
  score: number;
  remainingDirt: number;
}

export const ScoreBoard = ({ score, remainingDirt }: ScoreBoardProps) => {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-center">Score</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-around text-lg">
          <div>
            <span className="font-bold">{score}</span> cleaned
          </div>
          <div>
            <span className="font-bold">{remainingDirt}</span> remaining
          </div>
        </div>
      </CardContent>
    </Card>
  );
};