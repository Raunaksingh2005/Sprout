'use client';

import { ArrowLeft, MessageSquare, Plus, History, Download, Share2, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export function ChatHeader() {
  const router = useRouter();

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between max-w-3xl mx-auto">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg"
            title="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="bg-purple-100 p-2 rounded-lg">
              <MessageSquare className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h1 className="font-semibold text-gray-900">AutiScan Assistant</h1>
              <p className="text-sm text-gray-500">AI-powered autism screening assistant</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Plus className="h-5 w-5" />
          </button>
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <History className="h-5 w-5" />
          </button>
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Download className="h-5 w-5" />
          </button>
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Share2 className="h-5 w-5" />
          </button>
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}