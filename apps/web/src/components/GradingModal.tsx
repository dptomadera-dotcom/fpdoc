import React, { useState } from 'react';
import { X, Check, XCircle, MessageSquare, Star, Loader2, ExternalLink, Calendar } from 'lucide-react';
import { monitoringService, Evidence, EvidenceStatus } from '@/services/monitoring.service';

interface GradingModalProps {
  isOpen: boolean;
  onClose: () => void;
  evidence: Evidence;
  taskTitle: string;
  curriculumLinks: any[];
  onGraded?: () => void;
}

export const GradingModal: React.FC<GradingModalProps> = ({ 
  isOpen, 
  onClose, 
  evidence,
  taskTitle,
  curriculumLinks,
  onGraded 
}) => {
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState('');
  const [scores, setScores] = useState<Record<string, number>>({});
  const [generalScore, setGeneralScore] = useState<number>(0);

  if (!isOpen) return null;

  const handleGrade = async (status: EvidenceStatus) => {
    try {
      setLoading(true);
      
      // 1. Format scores
      const formattedScores = Object.entries(scores).map(([curriculumLinkId, score]) => ({
        curriculumLinkId,
        score
      }));

      // 2. Submit assessment
      await monitoringService.checkEvidence({
        evidenceId: evidence.id,
        status,
        scores: formattedScores,
        comment: comment.trim() || undefined
      });

      onGraded?.();
      onClose();
    } catch (error) {
      console.error('Error grading evidence:', error);
      alert('Error al calificar la evidencia.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Evaluar Evidencia</h2>
            <p className="text-xs text-slate-500 mt-0.5">Alumno: {evidence.student?.firstName} {evidence.student?.lastName}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full text-slate-400 hover:text-slate-900 transition-all border border-transparent hover:border-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          {/* File Preview Card */}
          <div className="bg-slate-900 rounded-xl p-4 flex items-center justify-between text-white group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center border border-white/10">
                <ExternalLink className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold truncate max-w-[200px]">{evidence.fileName}</p>
                <p className="text-[10px] text-white/50">{taskTitle}</p>
              </div>
            </div>
            <a 
              href={evidence.fileUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-2 bg-white text-slate-900 rounded-lg text-xs font-bold hover:bg-slate-100 transition-all shadow-sm"
            >
              Ver documento completo
            </a>
          </div>

          {/* Curriculum Section */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500" />
              Calificación por Criterios (RA/CE)
            </h3>
            <div className="space-y-3">
              {curriculumLinks.map((link, idx) => (
                <div key={idx} className="p-4 border border-slate-100 rounded-xl bg-slate-50/30 hover:border-slate-200 transition-all">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-1.5 py-0.5 bg-slate-900 text-white rounded text-[10px] font-bold">
                          {link.learningOutcome?.code}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                          {link.evaluationCriterion?.code || 'RA Global'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {link.evaluationCriterion?.description || link.learningOutcome?.description}
                      </p>
                    </div>
                    <div className="flex-shrink-0 w-24">
                      <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Nota (0-10)</label>
                      <input 
                        type="number" 
                        min="0" 
                        max="10" 
                        step="0.1"
                        className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-bold focus:ring-2 focus:ring-slate-900 focus:outline-none"
                        placeholder="--"
                        onChange={(e) => setScores({ ...scores, [link.id]: parseFloat(e.target.value) })}
                      />
                    </div>
                  </div>
                </div>
              ))}
              {curriculumLinks.length === 0 && (
                <p className="text-xs text-slate-400 text-center py-4 bg-slate-50 rounded-lg italic">
                  Esta tarea no tiene vinculaciones curriculares específicas.
                </p>
              )}
            </div>
          </div>

          {/* Observations Section */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-500" />
              Observaciones y Feedback
            </h3>
            <textarea
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm min-h-[100px] focus:ring-2 focus:ring-slate-900 focus:bg-white focus:outline-none transition-all"
              placeholder="Escribe aquí tus comentarios para el alumno..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex gap-3">
          <button
            onClick={() => handleGrade(EvidenceStatus.RECHAZADA)}
            disabled={loading}
            className="flex-1 py-3 px-4 border border-rose-200 text-rose-600 rounded-xl font-bold hover:bg-rose-50 transition-all text-sm flex items-center justify-center gap-2"
          >
            <XCircle className="w-4 h-4" />
            Rechazar
          </button>
          <button
            onClick={() => handleGrade(EvidenceStatus.ACEPTADA)}
            disabled={loading}
            className="flex-1 py-3 px-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-200"
          >
            <Check className="w-4 h-4" />
            Validar Tarea
          </button>
        </div>
      </div>
    </div>
  );
};
