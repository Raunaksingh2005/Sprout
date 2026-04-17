'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { MCHAT_QUESTIONS } from '@/data/mchat-questions';

interface MCHATQuestionnaireProps {
  onComplete: (answers: any[]) => void;
  onBack: () => void;
}

export function MCHATQuestionnaire({ onComplete, onBack }: MCHATQuestionnaireProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [followUpAnswer, setFollowUpAnswer] = useState('');

  const currentQuestionData = MCHAT_QUESTIONS[currentQuestion];
  const totalQuestions = MCHAT_QUESTIONS.length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  const handleAnswer = (answer: string) => {
    const newAnswers = { ...answers, [currentQuestion]: answer };
    setAnswers(newAnswers);
    
    // Check if this question has a follow-up
    const question = MCHAT_QUESTIONS[currentQuestion];
    if (question.followUpQuestion && answer === 'no') {
      setShowFollowUp(true);
    } else {
      handleNext();
    }
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Calculate score and complete
      const score = calculateScore(answers);
      onComplete({ answers, score });
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    } else {
      onBack();
    }
  };

  const calculateScore = (answers: Record<number, string>) => {
    let score = 0;
    // Scoring logic based on M-CHAT-R/F scoring rules
    return score;
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>M-CHAT-R/F Questionnaire</CardTitle>
          <CardDescription>
            Question {currentQuestion + 1} of {totalQuestions}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">
              {MCHAT_QUESTIONS[currentQuestion].text}
            </h3>
            
            <div className="space-y-2">
              {MCHAT_QUESTIONS[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option.value)}
                  className="w-full text-left p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={handlePrevious}>
              Back
            </Button>
            <Button onClick={handleNext}>
              {currentQuestion === totalQuestions - 1 ? 'Complete' : 'Next'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}