"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ScoreReveal } from "@/components/iq-test/score-reveal";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";

interface Question {
  id: string;
  question: string;
  options: string[];
}

export default function IQTestPage() {
  const { update } = useSession();
  const [questions, setQuestions] = useState<Question[]>([]);
  // Store answers as map: questionId -> option
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch("/api/iq/questions");
        const data = await res.json();
        setQuestions(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load questions", error);
      }
    };

    fetchQuestions();
  }, []);

  const handleAnswer = (option: string) => {
    const currentQ = questions[currentQuestionIndex];
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: option,
    }));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const submitTest = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/iq/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answers }),
      });

      if (res.ok) {
        const data = await res.json();
        setScore(data.iq);
        setSubmitted(true);
        // Refresh session to show new IQ badge in header
        await update();
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Failed to submit test.");
        if (res.status === 403) {
          router.push("/profile");
        }
      }
    } catch (error) {
      console.error("Submission error", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (submitted && score !== null) {
    return (
      <div className="container mx-auto p-4 max-w-2xl min-h-screen flex items-center justify-center">
        <div className="bg-card border border-border rounded-xl p-8 shadow-2xl w-full">
          <ScoreReveal score={score} />
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestionIndex];
  const currentAnswer = answers[currentQ?.id];

  return (
    <div className="container mx-auto p-4 max-w-2xl min-h-screen flex flex-col justify-center">
      <div className="mb-8 text-center space-y-4">
        <h1 className="text-3xl font-bold bg-gradient-iq bg-clip-text text-transparent">
          IQ Assessment
        </h1>
        <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
          <div
            className="bg-primary h-full transition-all duration-300"
            style={{
              width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
            }}
          />
        </div>
        <p className="text-muted-foreground">
          Question {currentQuestionIndex + 1} of {questions.length}
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl p-8 shadow-lg space-y-8">
        <h2 className="text-xl font-medium leading-relaxed">
          {currentQ.question}
        </h2>

        <div className="space-y-3">
          {currentQ.options.map((option) => (
            <Button
              key={option}
              variant={currentAnswer === option ? "default" : "outline"}
              className="w-full justify-start text-left h-auto py-4 px-6 text-base"
              onClick={() => handleAnswer(option)}
            >
              {option}
            </Button>
          ))}
        </div>

        <div className="flex justify-between pt-4 border-t border-border">
          <Button
            variant="ghost"
            onClick={prevQuestion}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>

          {currentQuestionIndex < questions.length - 1 ? (
            <Button onClick={nextQuestion} disabled={!currentAnswer}>
              Next
            </Button>
          ) : (
            <Button
              onClick={submitTest}
              disabled={!currentAnswer || isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Submit Assessment
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
