import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from './client';

export type ScreeningType = 'autism' | 'adhd' | 'dyslexia';

export interface ScreeningResult {
  id?: string;
  childName: string;
  childAge: number; // stored in months
  childGender: string;
  screeningType: ScreeningType;
  answers: Record<number, string>;
  score: number;
  risk: 'Low' | 'Medium' | 'High';
  aiSummary?: string;
  createdAt?: Timestamp;
}

export const SCREENING_LABELS: Record<ScreeningType, string> = {
  autism: 'Autism (ASD)',
  adhd: 'ADHD',
  dyslexia: 'Dyslexia',
};

export const SCREENING_COLORS: Record<ScreeningType, string> = {
  autism: 'text-indigo-700 bg-indigo-50 border-indigo-200',
  adhd: 'text-pink-700 bg-pink-50 border-pink-200',
  dyslexia: 'text-amber-700 bg-amber-50 border-amber-200',
};

export async function saveScreening(uid: string, data: Omit<ScreeningResult, 'id' | 'createdAt'>) {
  const ref = collection(db, 'users', uid, 'screenings');
  const docRef = await addDoc(ref, { ...data, createdAt: serverTimestamp() });
  return docRef.id;
}

export async function updateScreeningSummary(uid: string, screeningId: string, aiSummary: string): Promise<void> {
  const ref = doc(db, 'users', uid, 'screenings', screeningId);
  await updateDoc(ref, { aiSummary });
}

export async function deleteScreening(uid: string, screeningId: string): Promise<void> {
  const ref = doc(db, 'users', uid, 'screenings', screeningId);
  await deleteDoc(ref);
}

export async function getScreenings(uid: string, count = 20): Promise<ScreeningResult[]> {
  const ref = collection(db, 'users', uid, 'screenings');
  const q = query(ref, orderBy('createdAt', 'desc'), limit(count));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as ScreeningResult));
}

// Calculate age in months from date of birth
export function dobToMonths(dob: string): number {
  const birth = new Date(dob);
  const now = new Date();
  const months = (now.getFullYear() - birth.getFullYear()) * 12
    + (now.getMonth() - birth.getMonth());
  return Math.max(0, months);
}

// Format months as "X years Y months" or "X months"
export function formatAge(months: number): string {
  const y = Math.floor(months / 12);
  const m = months % 12;
  if (y === 0) return `${m} month${m !== 1 ? 's' : ''}`;
  if (m === 0) return `${y} year${y !== 1 ? 's' : ''}`;
  return `${y}y ${m}m`;
}

export function formatDate(ts: Timestamp | undefined | null): string {
  if (!ts) return '';
  // Handle both Firestore Timestamp instances and plain objects from cache
  if (typeof (ts as any).toDate === 'function') {
    return (ts as any).toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
  // Plain object with _seconds (Firestore serialised form)
  if ((ts as any)._seconds) {
    return new Date((ts as any)._seconds * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
  return '';
}
