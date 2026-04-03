import React, { useState } from 'react';
import { X, Check, XCircle, MessageSquare, Star, Loader2, ExternalLink, Award, Info, ShieldCheck, FileText, ArrowRight } from 'lucide-react';
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
  const [showPreview, setShowPreview] = useState(true);

  if (!isOpen) return null;

  const isImage = evidence.mimeType?.startsWith('image/') || 
                  evidence.fileName.match(/\.(jpg|jpeg|png|gif|webp)$/i);
  const isPdf = evidence.mimeType === 'application/pdf' || 
                evidence.fileName.toLowerCase().endsWith('.pdf');

  const handleGrade = async (status: EvidenceStatus) => {
    try {
      setLoading(true);
      const formattedScores = Object.entries(scores).map(([curriculumLinkId, score]) => ({
        curriculumLinkId,
        score
      }));

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
      alert('Error en la validación académica.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[var(--ink)]/60 backdrop-blur-3xl animate-in fade-in duration-500 overflow-hidden">
      <div className="bg-white rounded-[40px] w-full max-w-[1400px] h-[90vh] shadow-[0_32px_120px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col animate-in zoom-in-95 slide-in-from-bottom-8 duration-700 border border-white/40">
        
        {/* Superior Control Bar */}
        <div className="p-6 md:px-10 border-b border-[#f0eee8] flex items-center justify-between bg-gradient-to-br from-[#f8f7f2] to-white shrink-0 relative">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(var(--ink) 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
          <div className="relative z-10 flex items-center gap-6">
             <div className="w-12 h-12 bg-[var(--ink)] rounded-2xl flex items-center justify-center shadow-2xl shadow-[var(--ink)]/20">
                <ShieldCheck className="w-7 h-7 text-[var(--teal)] transition-transform hover:scale-110" />
             </div>
             <div>
                <h2 className="text-xl font-black text-[var(--ink)] tracking-tight uppercase leading-none mb-1.5 flex items-center gap-2">
                  Protocolo de Auditoría
                  {loading && <Loader2 className="w-5 h-5 animate-spin text-[var(--teal)]" />}
                </h2>
                <div className="flex items-center gap-3">
                   <div className="px-2 py-0.5 bg-[var(--teal)]/10 rounded-md text-[8px] font-black text-[var(--teal)] uppercase tracking-widest border border-[var(--teal)]/20 animate-pulse">LIVE NODE</div>
                   <p className="text-[10px] font-black text-[var(--ink3)] uppercase tracking-[0.2em]">{evidence.student?.firstName} {evidence.student?.lastName} — <span className="text-[var(--ink)]">ID: {evidence.id.slice(0, 8)}</span></p>
                </div>
             </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowPreview(!showPreview)}
              className={`hidden lg:flex items-center gap-2 px-4 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all ${showPreview ? 'bg-[var(--bg1)] text-[var(--ink)]' : 'bg-[var(--teal)] text-white shadow-xl shadow-[var(--teal)]/20'}`}
            >
              {showPreview ? 'Deshabilitar Visor' : 'Habilitar Visor'}
            </button>
            <button 
              onClick={onClose} 
              className="w-12 h-12 flex items-center justify-center bg-white border-2 border-[#f0eee8] rounded-[20px] text-[var(--ink3)] hover:text-[var(--red)] hover:border-[var(--red)] transition-all transform hover:rotate-90"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Binary Layout Core */}
        <div className="flex flex-grow overflow-hidden bg-[var(--bg1)]/30">
          
          {/* Left Wing: Document Visor (Desktop Only or Toggle) */}
          {showPreview && (
          <div className="hidden lg:flex flex-[1.2] flex-col bg-[var(--bg2)] border-r border-[#f0eee8] overflow-hidden relative group">
            <div className="p-4 bg-white border-b border-[#f0eee8] flex items-center justify-between shrink-0">
               <div className="flex items-center gap-3">
                 <FileText className="w-5 h-5 text-[var(--ink)]" />
                 <span className="text-[10px] font-black text-[var(--ink)] uppercase tracking-widest">{evidence.fileName}</span>
               </div>
               <a 
                href={evidence.fileUrl} 
                target="_blank" 
                className="p-2 hover:bg-[var(--bg1)] rounded-lg transition-colors group/link"
                title="Open in new tab"
               >
                 <ExternalLink className="w-4 h-4 text-[var(--ink3)] group-hover/link:text-[var(--ink)]" />
               </a>
            </div>
            <div className="flex-grow bg-[#E5E7EB] flex items-center justify-center relative overflow-hidden">
               {isImage ? (
                 <img 
                  src={evidence.fileUrl} 
                  alt="Evidence" 
                  className="max-w-full max-h-full object-contain shadow-2xl animate-in zoom-in-95"
                 />
               ) : isPdf ? (
                 <iframe 
                  src={`${evidence.fileUrl}#toolbar=0`}
                  className="w-full h-full border-none"
                  title="PDF Evidence Viewer"
                 />
               ) : (
                 <div className="flex flex-col items-center gap-5 p-12 text-center">
                    <div className="w-24 h-24 bg-white/50 rounded-full flex items-center justify-center border-4 border-dashed border-gray-300">
                       <FileText className="w-10 h-10 text-gray-400" />
                    </div>
                    <p className="text-xs font-black text-gray-500 uppercase tracking-widest leading-relaxed">
                      Este formato de archivo {evidence.fileName.split('.').pop()} <br/> requiere ser auditado externamente
                    </p>
                    <a 
                      href={evidence.fileUrl} 
                      target="_blank" 
                      className="px-8 py-3 bg-[var(--ink)] text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-transform"
                    >
                      Descargar para Auditoría
                    </a>
                 </div>
               )}
            </div>
          </div>
          )}

          {/* Right Wing: Metric Engine & Grading */}
          <div className="flex-1 flex flex-col overflow-hidden bg-white">
            <div className="flex-grow overflow-y-auto custom-scrollbar p-10 lg:p-14 space-y-12">
               
               {/* Metrics Panel Header */}
               <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-black text-[var(--ink)] uppercase tracking-tight flex items-center gap-3">
                      <Award className="w-7 h-7 text-[var(--amber)]" />
                      Métrica Académica
                    </h3>
                    <div className="flex items-center gap-2 text-[10px] bg-[var(--bg1)] px-4 py-2 rounded-full border border-[#f0eee8]">
                       <span className="w-1.5 h-1.5 rounded-full bg-[var(--teal)] animate-pulse" />
                       <span className="font-black text-[var(--ink)]">REF: {taskTitle}</span>
                    </div>
                  </div>
                  <div className="p-6 bg-[var(--bg1)]/40 rounded-3xl border border-[#f0eee8] flex items-center gap-4">
                     <Info className="w-5 h-5 text-[var(--teal)]" />
                     <p className="text-[10px] font-medium text-[var(--ink2)] leading-relaxed flex-grow">
                       Valide el cumplimiento de los Resultados de Aprendizaje (RA) asociados. Use la escala decimal [0-10]. 
                     </p>
                  </div>
               </div>

               {/* Competence Matrix */}
               <div className="grid gap-8">
                {curriculumLinks.length > 0 ? curriculumLinks.map((link, idx) => (
                  <div key={idx} className="relative p-8 bg-[var(--bg1)]/20 rounded-[32px] border-2 border-transparent hover:border-[var(--teal)]/40 transition-all duration-500 group/item">
                    <div className="flex flex-col gap-8">
                       <div className="flex-grow">
                          <div className="flex justify-between items-start mb-4">
                             <div className="px-3 py-1 bg-[var(--ink)] text-[var(--teal)] rounded-md text-[9px] font-black tracking-[0.2em] uppercase">
                                CRITERIO {link.evaluationCriterion?.code || 'P.A.'}
                             </div>
                             <div className="text-[9px] font-black text-[var(--ink3)] uppercase tracking-widest">RA {link.learningOutcome?.code}</div>
                          </div>
                          <p className="text-sm font-semibold text-[var(--ink)] leading-snug">
                             {link.evaluationCriterion?.description || link.learningOutcome?.description}
                          </p>
                       </div>
                       
                       <div className="flex items-center gap-6">
                          <div className="relative flex-grow flex items-center gap-2 overflow-x-auto pb-2 noscrollbar">
                             {[0, 2.5, 5, 7.5, 9, 10].map((val) => (
                               <button 
                                key={val}
                                type="button"
                                onClick={() => setScores({ ...scores, [link.id]: val })}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${scores[link.id] === val ? 'bg-[var(--teal)] text-white' : 'bg-white text-[var(--ink3)] border border-[#f0eee8] hover:border-[var(--teal)]'}`}
                               >
                                 {val === 10 ? 'MAX' : val}
                               </button>
                             ))}
                          </div>
                          <div className="w-28 shrink-0 bg-white p-3 rounded-2xl border-2 border-[var(--teal)]/20 focus-within:border-[var(--teal)] transition-all shadow-lg shadow-[var(--teal)]/[0.03]">
                             <input 
                                type="number" 
                                min="0" 
                                max="10" 
                                step="0.5"
                                className="w-full text-xl font-black text-center text-[var(--ink)] outline-none bg-transparent"
                                placeholder="0.0"
                                value={scores[link.id]}
                                onChange={(e) => setScores({ ...scores, [link.id]: parseFloat(e.target.value) })}
                             />
                          </div>
                       </div>
                    </div>
                  </div>
                )) : (
                  <div className="py-20 text-center border-4 border-dashed border-[#f0eee8] rounded-[48px]">
                     <div className="w-20 h-20 bg-[var(--bg1)] rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                        <ShieldCheck className="w-10 h-10" />
                     </div>
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sin vinculaciones académicas integradas</p>
                  </div>
                )}
               </div>

               {/* Observations & Feedback */}
               <div className="space-y-6">
                  <div className="flex items-center gap-3 px-1">
                    <MessageSquare className="w-6 h-6 text-[var(--teal)]" />
                    <h3 className="text-sm font-black text-[var(--ink)] uppercase tracking-tight">Observaciones de Auditoría</h3>
                  </div>
                  <div className="relative">
                    <textarea
                      className="w-full p-8 bg-[var(--bg1)]/40 border-2 border-transparent rounded-[36px] text-sm font-medium min-h-[140px] focus:bg-white focus:border-[var(--teal)] transition-all outline-none resize-none placeholder-[var(--ink3)]/40 shadow-inner group-hover/area:bg-[var(--bg1)]"
                      placeholder="Indique los hallazgos técnicos o justifique la calificación otorgada..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <div className="absolute bottom-6 right-6 px-4 py-1.5 bg-white rounded-full border border-gray-100 text-[10px] font-bold text-[var(--ink3)]">
                       {comment.length} CARACTERES
                    </div>
                  </div>
               </div>
            </div>

            {/* Validation Actions Panel */}
            <div className="p-8 lg:px-14 border-t border-[#f0eee8] bg-white flex flex-col sm:flex-row gap-5 shrink-0">
               <button
                  onClick={() => handleGrade(EvidenceStatus.RECHAZADA)}
                  disabled={loading}
                  className="h-[72px] flex items-center justify-center gap-3 px-8 bg-white border-2 border-[var(--red2)] text-[var(--red)] rounded-[28px] text-[10px] font-black uppercase tracking-widest hover:bg-[var(--red2)] transition-all disabled:opacity-30"
               >
                  <XCircle className="w-5 h-5" />
                  Solicitar Revisión
               </button>
               <button
                  onClick={() => handleGrade(EvidenceStatus.ACEPTADA)}
                  disabled={loading || Object.keys(scores).length < curriculumLinks.length}
                  className="flex-grow h-[72px] flex items-center justify-center gap-4 px-10 bg-[var(--ink)] text-white rounded-[28px] text-[10px] font-black uppercase tracking-[0.2em] hover:scale-[1.01] active:scale-[0.99] transition-all shadow-2xl shadow-[var(--ink)]/30 disabled:opacity-40 disabled:cursor-not-allowed group relative overflow-hidden"
               >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                  {loading ? <Loader2 className="w-5 h-5 animate-spin text-[var(--teal)]" /> : (
                    <div className="w-9 h-9 bg-[var(--teal)] rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg">
                       <ShieldCheck className="w-6 h-6 text-[var(--ink)]" />
                    </div>
                  )}
                  <span className="relative z-10">Certificar y Validar Criterios</span>
                  <ArrowRight className="w-5 h-5 text-white/40 group-hover:translate-x-2 transition-transform" />
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
