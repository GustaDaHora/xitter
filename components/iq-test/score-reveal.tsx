"use client";

import { useEffect, useState } from "react";
import { Brain } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Confetti from "react-confetti";
import { useWindowSize } from "@/lib/hooks/use-window-size";

interface ScoreRevealProps {
  score: number;
}

export function ScoreReveal({ score }: ScoreRevealProps) {
  const [displayedScore, setDisplayedScore] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const { width, height } = useWindowSize();

  useEffect(() => {
    // Animation for rolling numbers
    const duration = 2000; // 2 seconds
    const steps = 50;
    const intervalTime = duration / steps;
    const increment = score / steps;

    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        clearInterval(timer);
        setDisplayedScore(score);
        setIsRevealed(true);
      } else {
        setDisplayedScore(Math.floor(current));
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [score]);

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-8 animate-in fade-in duration-500">
      {isRevealed && <Confetti width={width} height={height} recycle={false} />}

      <div className="relative">
        <Brain
          className={cn(
            "w-32 h-32 text-muted-foreground transition-all duration-500",
            isRevealed && "text-primary scale-110 drop-shadow-glow",
          )}
        />
      </div>

      <div className="text-center space-y-2">
        <h2 className="text-2xl font-medium text-muted-foreground">
          Your IQ Score
        </h2>
        <div
          className={cn(
            "text-6xl font-black tabular-nums transition-colors duration-300",
            isRevealed ? "text-primary" : "text-foreground",
          )}
        >
          {displayedScore}
        </div>
      </div>

      {isRevealed && (
        <div className="space-y-4 text-center animate-in slide-in-from-bottom-4 fade-in duration-700 delay-300">
          <p className="text-lg">
            {score > 80 ? "Indisputable genius." : "Room for improvement."}
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/leaderboard">
              <Button variant="outline">View Leaderboard</Button>
            </Link>
            <Link href="/profile">
              <Button>Go to Profile</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
