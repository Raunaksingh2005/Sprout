import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AutiScan - Early Autism Screening Tool',
  description: 'AI-powered early screening tool for autism traits in children aged 16-48 months',
  keywords: ['autism', 'screening', 'children', 'development', 'M-CHAT-R/F', 'early detection'],
  authors: [{ name: 'AutiScan Team' }],
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  robots: 'noindex, nofollow', // Medical tool - don't index
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                  <div className="flex items-center">
                    <div className="text-2xl font-bold text-blue-600">AutiScan</div>
                    <div className="ml-4 text-sm text-gray-500">
                      Early Autism Screening Tool
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 italic">
                    This assessment is not a medical diagnosis. Please consult a qualified healthcare professional.
                  </div>
                </div>
              </div>
            </header>
            <main>{children}</main>
            <footer className="bg-white border-t mt-8">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="text-center text-sm text-gray-500">
                  <p>© {new Date().getFullYear()} AutiScan. All rights reserved.</p>
                  <p className="mt-2">
                    This tool is based on the M-CHAT-R/F screening instrument. 
                    It is intended for screening purposes only and does not provide a diagnosis.
                  </p>
                  <p className="mt-2">
                    If you have concerns about your child's development, please consult with a healthcare professional.
                  </p>
                </div>
              </div>
            </footer>
          </div>
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}