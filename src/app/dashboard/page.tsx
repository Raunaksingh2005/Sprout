'use client';

import { useEffect, useState } from 'react';
import AuthGuard from '@/components/AuthGuard';
import Navbar from '@/components/layout/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { ArrowRight, FileText, MessageSquare, Clock, Plus, Loader2, Download, Trash2, AlertTriangle, X } from 'lucide-react';
import { getScreenings, deleteScreening, formatAge, formatDate, type ScreeningResult, SCREENING_LABELS, SCREENING_COLORS } from '@/lib/firebase/screenings';
import { generatePDF } from '@/lib/generateReport';
import { getCached, setCache } from '@/lib/screeningCache';
import { motion } from 'framer-motion';

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const fadeUpItem = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const riskStyle = {
  Low: 'text-blue-700 bg-blue-50 border-blue-100',
  Medium: 'text-amber-700 bg-amber-50 border-amber-200',
  High: 'text-red-700 bg-red-50 border-red-200',
};

function DeleteModal({ screening, onConfirm, onCancel, deleting }: {
  screening: ScreeningResult;
  onConfirm: () => void;
  onCancel: () => void;
  deleting: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-5">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-fade-up">
        <button onClick={onCancel} className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
          <X className="w-4 h-4" />
        </button>
        <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6 text-red-600" />
        </div>
        <h2 className="text-lg font-extrabold text-gray-900 mb-1">Delete screening?</h2>
        <p className="text-sm text-gray-500 mb-3">
          You're about to delete the <strong>{SCREENING_LABELS[screening.screeningType ?? 'autism']}</strong> screening for <strong>{screening.childName}</strong>.
        </p>
        <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-xs text-red-700 leading-relaxed">
          <strong>This cannot be undone.</strong> Once deleted, this screening data is permanently removed and cannot be traced back or recovered.
        </div>
        <div className="flex gap-3 mt-5">
          <button onClick={onCancel} disabled={deleting}
            className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 text-gray-700 hover:border-gray-300 text-sm font-semibold transition-colors disabled:opacity-50">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={deleting}
            className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {deleting ? <><Loader2 className="w-4 h-4 animate-spin" /> Deleting...</> : 'Yes, delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const firstName = user?.displayName?.split(' ')[0] ?? 'there';

  const [screenings, setScreenings] = useState<ScreeningResult[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ScreeningResult | null>(null);

  const handleDownload = (s: ScreeningResult) => {
    setDownloadingId(s.id!);
    try {
      generatePDF({
        childName: s.childName,
        childAge: s.childAge,
        childGender: s.childGender,
        screeningType: s.screeningType,
        score: s.score,
        risk: s.risk,
        answers: s.answers,
        parentName: user?.displayName ?? undefined,
        date: formatDate(s.createdAt),
        aiSummary: s.aiSummary,
      });
    } finally {
      setDownloadingId(null);
    }
  };

  const confirmDelete = async () => {
    if (!user || !deleteTarget) return;
    setDeletingId(deleteTarget.id!);
    try {
      await deleteScreening(user.uid, deleteTarget.id!);
      const updated = screenings.filter(r => r.id !== deleteTarget.id);
      setScreenings(updated);
      setCache(user.uid, updated);
      setDeleteTarget(null);
    } catch (e) {
      console.error('Delete failed:', e);
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    if (!user) return;
    const cached = getCached(user.uid);
    if (cached) {
      setScreenings(cached);
      setLoadingData(false);
      getScreenings(user.uid).then(fresh => {
        setScreenings(fresh);
        setCache(user.uid, fresh);
      }).catch(console.error);
    } else {
      getScreenings(user.uid)
        .then(data => { setScreenings(data); setCache(user.uid, data); })
        .catch(console.error)
        .finally(() => setLoadingData(false));
    }
  }, [user]);

  const total = screenings.length;
  const uniqueChildren = new Set(screenings.map(s => s.childName)).size;
  const lastDate = screenings[0] ? formatDate(screenings[0].createdAt) : '—';
  const avgRisk = (() => {
    if (!total) return '—';
    const avg = screenings.reduce((sum, s) => sum + s.score, 0) / total;
    if (avg <= 2) return 'Low';
    if (avg <= 7) return 'Medium';
    return 'High';
  })();

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <Navbar />

        {deleteTarget && (
          <DeleteModal
            screening={deleteTarget}
            onConfirm={confirmDelete}
            onCancel={() => setDeleteTarget(null)}
            deleting={deletingId === deleteTarget.id}
          />
        )}

        <main className="max-w-5xl mx-auto px-5 py-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mb-8"
          >
            <p className="text-xs font-mono font-bold text-brand-600 uppercase tracking-widest mb-1">dashboard</p>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Hey, {firstName} 👋
            </h1>
            <p className="text-sm text-gray-500 mt-1 font-medium">Here's your screening overview.</p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8"
          >
            {[
              { label: 'Total screenings', value: loadingData ? '…' : String(total) },
              { label: 'Children tracked', value: loadingData ? '…' : String(uniqueChildren) },
              { label: 'Avg risk', value: loadingData ? '…' : avgRisk },
              { label: 'Last screening', value: loadingData ? '…' : lastDate },
            ].map(({ label, value }) => (
              <motion.div key={label} variants={fadeUpItem} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-premium transition-colors hover:border-gray-200">
                <p className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wider">{label}</p>
                <p className="text-2xl font-extrabold font-mono text-gray-900 tracking-tight">{value}</p>
              </motion.div>
            ))}
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-5">
            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-gray-900">Recent screenings</h2>
                <Link href="/screening/new" className="flex items-center gap-1 text-xs text-blue-700 hover:text-blue-900 transition-colors font-bold">
                  <Plus className="w-3.5 h-3.5" /> New
                </Link>
              </div>

              {loadingData ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="w-6 h-6 text-blue-700 animate-spin" />
                </div>
              ) : screenings.length === 0 ? (
                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center bg-white">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <FileText className="w-6 h-6 text-blue-400" />
                  </div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">No screenings yet</p>
                  <p className="text-xs text-gray-400 mb-4">Complete your first screening to see results here.</p>
                  <Link href="/screening/new" className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-700 hover:text-blue-900 transition-colors">
                    Start first screening <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {screenings.map((s, index) => (
                    <motion.div 
                      key={s.id} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -2 }}
                      className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:border-brand-100 shadow-sm transition-all group bg-white"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center font-bold text-brand-900">
                          {s.childName[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm group-hover:text-brand-900 transition-colors">{s.childName}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <p className="text-xs text-gray-400">{formatAge(s.childAge)} · {formatDate(s.createdAt)}</p>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${SCREENING_COLORS[s.screeningType ?? 'autism']}`}>
                              {SCREENING_LABELS[s.screeningType ?? 'autism']}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${riskStyle[s.risk]}`}>
                          {s.risk}
                        </span>
                        <span className="text-xs text-gray-400 font-mono hidden sm:block mx-2">{s.score}/20</span>
                        <button onClick={() => handleDownload(s)} disabled={downloadingId === s.id}
                          title="Download PDF"
                          className="p-2 rounded-xl text-gray-400 hover:text-brand-600 hover:bg-brand-50 transition-colors disabled:opacity-50">
                          {downloadingId === s.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                        </button>
                        <button onClick={() => setDeleteTarget(s)}
                          title="Delete screening"
                          className="p-2 rounded-xl bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <h2 className="text-sm font-bold text-gray-900 mb-4">Quick actions</h2>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link href="/screening/new"
                  className="flex items-center gap-4 p-5 rounded-2xl bg-brand-900 text-white hover:bg-brand-800 transition-colors shadow-premium">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white flex-shrink-0" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold">New screening</p>
                    <p className="text-xs text-brand-100 mt-0.5">ASD, ADHD or Dyslexia</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-brand-100 group-hover:text-white transition-colors flex-shrink-0" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link href="/chat"
                  className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-gray-200 hover:border-gray-300 transition-colors shadow-sm group">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-gray-600 group-hover:text-brand-900 transition-colors flex-shrink-0" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900">AI Assistant</p>
                    <p className="text-xs text-gray-500 mt-0.5">Ask about development</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-brand-900 transition-colors flex-shrink-0" />
                </Link>
              </motion.div>
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                <div className="flex items-start gap-2">
                  <Clock className="w-3.5 h-3.5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-amber-700 leading-relaxed font-medium">
                    Screening results are not a medical diagnosis. Always consult a healthcare professional.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
