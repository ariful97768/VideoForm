'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Submission {
  _id: string;
  sessionId: string;
  submittedAt: string;
  ipAddress?: string;
  [key: string]: any;
}

export default function AdminPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/submit');
      
      if (!response.ok) {
        throw new Error('Failed to fetch submissions');
      }
      
      const data = await response.json();
      setSubmissions(data.submissions || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="text-white text-xl font-sans">Chargement...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="text-red-400 text-xl font-sans">Erreur: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-dark p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-display font-bold text-white mb-2">
            Soumissions de formulaires
          </h1>
          <p className="text-white/60 font-sans">
            Total: {submissions.length} soumissions
          </p>
        </motion.div>

        {/* Submissions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {submissions.map((submission, index) => (
            <motion.div
              key={submission._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedSubmission(submission)}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6
                       hover:bg-white/10 hover:border-accent/50 transition-all duration-300
                       cursor-pointer group"
            >
              {/* Date */}
              <div className="text-accent text-sm font-sans mb-4">
                {formatDate(submission.submittedAt)}
              </div>

              {/* Preview Data */}
              <div className="space-y-2">
                {Object.entries(submission).map(([key, value]) => {
                  // Skip technical fields
                  if (['_id', 'sessionId', 'submittedAt', 'ipAddress', 'userAgent'].includes(key)) {
                    return null;
                  }

                  return (
                    <div key={key} className="flex items-start gap-2">
                      <span className="text-white/50 text-sm font-sans capitalize min-w-24">
                        {key}:
                      </span>
                      <span className="text-white text-sm font-sans flex-1 truncate">
                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Session ID */}
              <div className="mt-4 pt-4 border-t border-white/10">
                <span className="text-white/40 text-xs font-mono">
                  {submission.sessionId}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* No submissions */}
        {submissions.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-white/60 text-lg font-sans">
              Aucune soumission pour le moment
            </p>
          </motion.div>
        )}

        {/* Detail Modal */}
        {selectedSubmission && (
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedSubmission(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background-dark border border-white/20 rounded-3xl p-8 max-w-2xl w-full
                       max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between mb-6">
                <h2 className="text-2xl font-display font-bold text-white">
                  Détails de la soumission
                </h2>
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                {Object.entries(selectedSubmission).map(([key, value]) => (
                  <div key={key} className="border-b border-white/10 pb-4">
                    <div className="text-accent text-sm font-sans uppercase tracking-wider mb-2">
                      {key}
                    </div>
                    <div className="text-white font-sans">
                      {typeof value === 'object' 
                        ? JSON.stringify(value, null, 2) 
                        : String(value)}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
