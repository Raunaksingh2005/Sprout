'use client';

import { useState, useEffect } from 'react';
import { MCHAT_QUESTIONS } from '@/data/mchat-questions';
import { calculateMCHATScore, getRiskLevel } from '@/utils/mchat-scoring';
import { saveScreening } from '@/lib/firebase/screenings';
import { useAuth } from '@/contexts/AuthContext';

interface Question {
  id: number;
  text: string;
  category: string;
  expectedResponse: 'yes' | 'no' | 'sometimes';
  followUpQuestion?: string;
}

interface Answer {
  questionId: number;
  answer: 'yes' | 'no' | 'sometimes' | 'not_sure';
  followUpAnswer?: string;
}

export default function QuestionnaireForm() {
  const { user } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [currentFollowUp, setCurrentFollowUp] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [riskLevel, setRiskLevel] = useState<'low' | 'medium' | 'high' | null>(null);

  const currentQuestionData = MCHAT_QUESTIONS[currentQuestion];
  const totalQuestions = MCHAT_QUESTIONS.length;

  const handleAnswer = (answer: 'yes' | 'no' | 'sometimes' | 'not_sure') => {
    const newAnswers = [...answers];
    const existingAnswerIndex = newAnswers.findIndex(a => a.questionId === currentQuestionData.id);
    
    const answerObj: Answer = {
      questionId: currentQuestionData.id,
      answer
    };

    if (existingAnswerIndex >= 0) {
      newAnswers[existingAnswerIndex] = answerObj;
    } else {
      newAnswers.push(answerObj);
    }

    setAnswers(newAnswers);

    // Check if this question has a follow-up
    if (currentQuestionData.followUpQuestion && answer === 'no' && currentQuestionData.expectedResponse === 'yes') {
      setShowFollowUp(true);
      setCurrentFollowUp(currentQuestionData.followUpQuestion || '');
    } else {
      handleNext();
    }
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      calculateScore();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const calculateScore = () => {
    const score = calculateMCHATScore(answers);
    const riskLevel = getRiskLevel(score);
    setScore(score);
    setRiskLevel(riskLevel);
  };

  const handleSubmit = async () => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      const screeningData = {
        childId: 'child-id-here', // This should come from props or context
        answers,
        score,
        riskLevel,
        completedAt: new Date().toISOString()
      };
      
      await saveScreening(screeningData);
      // Navigate to results page
    } catch (error) {
      console.error('Error saving screening:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Question {currentQuestion + 1} of {totalQuestions}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round(progress)}% complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Question */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Question {currentQuestion + 1}: {MCHAT_QUESTIONS[currentQuestion].text}
        </h2>
        
        <div className="space-y-3 mt-6">
          {['yes', 'no', 'sometimes', 'not_sure'].map((option) => (
            <button
              key={option}
              onClick={() => handleAnswer(option)}
              className="w-full text-left p-4 mb-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="capitalize">{option.replace('_', ' ')}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {currentQuestion === totalQuestions - 1 ? 'Finish' : 'Next'}
        </button>
      </div>

      {/* Follow-up question modal */}
      {showFollowUp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Follow-up Question</h3>
            <p className="mb-4">{currentFollowUp}</p>
            <button onClick={() => setShowFollowUp(false)}>Continue</button>
          </div>
        </div>
      )}
    </div>
  );
}