'use client';

import { AlertCircle } from 'lucide-react';

export function DisclaimerBanner() {
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
      <div className="flex items-start">
        <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0" />
        <div className="ml-3">
          <p className="text-sm text-yellow-700">
            <span className="font-semibold">Important:</span> This AI assistant provides educational information only. 
            It is not a medical professional and cannot provide diagnoses. 
            Always consult with qualified healthcare providers for medical advice.
          </p>
        </div>
      </div>
    </div>
  );
}