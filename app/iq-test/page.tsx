"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Question {
  question: string;
  options: string[];
  answer: string;
}

export default function IQTestPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchQuestions = async () => {
      const res = await fetch("/api/iq/questions");
      const data = await res.json();
      setQuestions(data);
      setAnswers(new Array(data.length).fill(""));
      setLoading(false);
    };

    fetchQuestions();
  }, []);

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const submitTest = async () => {
    const res = await fetch("/api/iq/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ answers }),
    });

    if (res.ok) {
      router.push("/profile");
    }
  };

  if (loading) {
    return (
      <div className="animate-fade-in-up p-6 bg-card text-card-foreground rounded-2xl shadow-lg max-w-md mx-auto mt-20">
        <h1 className="text-2xl font-bold mb-2">Hello, world!</h1>
        <p className="text-muted-foreground">
          This is a simple animated component using Tailwind CSS.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">IQ Test</h1>
      <div>
        <h2 className="text-xl mb-2">{questions[currentQuestion].question}</h2>
        <div className="grid grid-cols-2 gap-4">
          {questions[currentQuestion].options.map((option) => (
            <Button
              key={option}
              variant={
                answers[currentQuestion] === option ? "default" : "outline"
              }
              onClick={() => handleAnswer(option)}
            >
              {option}
            </Button>
          ))}
        </div>
        <div className="mt-4">
          {currentQuestion < questions.length - 1 ? (
            <Button onClick={nextQuestion}>Next</Button>
          ) : (
            <Button onClick={submitTest}>Submit</Button>
          )}
        </div>
      </div>
    </div>
  );
}
