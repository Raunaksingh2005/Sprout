import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/firebase/auth';
import Dashboard from '@/components/Dashboard';

export default async function Home() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/login');
  }
  
  return (
    <main className="min-h-screen bg-gray-50">
      <Dashboard user={user} />
    </main>
  );
}