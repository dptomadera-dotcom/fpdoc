import React, { useState } from 'react';
import { X, Upload, Check, Loader2, FileIcon, ShieldCheck } from 'lucide-react';
import { monitoringService } from '@/services/monitoring.service';

interface EvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: string;
  taskTitle: string;
  onSubmitted?: () => void;
}

export const EvidenceModal: React.FC<EvidenceModalProps> = ({ 
  isOpen, 
  onClose, 
  taskId, 
  taskTitle,
  onSubmitted 
}) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [preview, setPreview] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (selectedFile: File) => {
    setFile(selectedFile);
    setFileName(selectedFile.name);
    
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    try {
      setLoading(true);
      const uploadResult = await monitoringService.uploadFile(file, taskId);
      await monitoringService.submitEvidence(
        taskId, 
        uploadResult.fileName, 
        uploadResult.url, 
        uploadResult.mimeType || file.type
      );

      setSuccess(true);
      setTimeout(() => {
        onSubmitted?.();
        onClose();
        setSuccess(false);
        setFile(null);
        setFileName('');
        setPreview(null);
      }, 2000);
    } catch (error) {
      console.error('Error submitting evidence:', error);
      alert('Error crítico en el proceso de carga.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[var(--ink)]/40 backdrop-blur-xl animate-in fade-in duration-500">
      <div className="bg-white rounded-[40px] w-full max-w-xl shadow-[0_32px_128px_rgba(0,0,0,0.15)] overflow-hidden animate-in zoom-in-95 duration-500 border border-white/40">
        <div className="p-10 border-b border-[#f0eee8] flex items-center justify-between bg-gradient-to-br from-[var(--bg1)] to-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--teal)]/5 rounded-full -mr-24 -mt-24 blur-3xl opacity-50" />
          <div className="relative z-10">
            <h2 className="text-xl font-black text-[var(--ink)] tracking-tight uppercase flex items-center gap-2">
              <Upload className="w-5 h-5 text-[var(--teal)]" />
              Depósito Digital
            </h2>
            <p className="text-[10px] font-bold text-[var(--ink3)] mt-1 uppercase tracking-[0.25em] truncate max-w-[300px]">
              Nodo: <span className="text-[var(--teal)]">{taskTitle}</span>
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="relative z-10 w-11 h-11 flex items-center justify-center bg-white border border-[#f0eee8] rounded-2xl text-[var(--ink3)] hover:text-[var(--ink)] hover:border-[var(--teal)] transition-all shadow-sm group active:scale-90"
          >
            <X className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          {success ? (
            <div className="flex flex-col items-center justify-center py-12 text-center animate-in zoom-in-95 duration-700">
              <div className="w-24 h-24 bg-[var(--teal)]/10 text-[var(--teal)] rounded-[40px] flex items-center justify-center mb-8 shadow-xl shadow-[var(--teal)]/10 border border-[var(--teal)]/20 animate-bounce">
                <ShieldCheck className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-black text-[var(--ink)] tracking-tight uppercase italic">Indexación Completa</h3>
              <p className="text-[var(--ink3)] mt-4 font-black uppercase text-[10px] tracking-widest max-w-[300px] leading-relaxed">La evidencia ha sido vinculada al bloque operativo de forma satisfactoria.</p>
            </div>
          ) : (
            <>
              {!file ? (
                <div 
                  className="relative p-16 border-2 border-dashed border-[#f0eee8] rounded-[40px] bg-[var(--bg1)]/30 flex flex-col items-center justify-center text-center group hover:border-[var(--teal)] hover:bg-white transition-all cursor-pointer overflow-hidden shadow-inner active:scale-[0.99]"
                  onClick={() => document.getElementById('evidence-file')?.click()}
                  onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const droppedFile = e.dataTransfer.files?.[0];
                    if (droppedFile) handleFileChange(droppedFile);
                  }}
                >
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-[var(--teal)]/20 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                  <div className="w-20 h-20 bg-white rounded-3xl shadow-xl border border-[#f0eee8] flex items-center justify-center mb-8 group-hover:-translate-y-2 transition-all relative z-10">
                    <Upload className="w-8 h-8 text-[var(--teal)]" />
                  </div>
                  <p className="text-sm font-black text-[var(--ink)] relative z-10 tracking-tight uppercase italic">Arrastre archivos aquí</p>
                  <p className="text-[10px] text-[var(--ink3)] mt-3 font-black uppercase tracking-[0.25em] relative z-10 flex items-center gap-2">
                    <Check className="w-3 h-3 text-[var(--teal)]" />
                    PDF — VIDEO — IMAGEN (25MB)
                  </p>
                  <input 
                    type="file" 
                    className="hidden" 
                    id="evidence-file"
                    onChange={(e) => {
                      const selectedFile = e.target.files?.[0];
                      if (selectedFile) handleFileChange(selectedFile);
                    }}
                  />
                </div>
              ) : (
                <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-700">
                  <div className="relative group overflow-hidden rounded-[32px] border border-[#f0eee8] bg-[var(--bg1)]">
                    {preview ? (
                      <div className="h-64 w-full relative">
                        <img 
                          src={preview} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                          alt="Previsualización" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)]/60 to-transparent flex items-end p-8">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30">
                                 <FileIcon className="w-5 h-5 text-white" />
                              </div>
                              <p className="text-white font-black text-xs uppercase tracking-tight truncate max-w-[300px]">{fileName}</p>
                           </div>
                        </div>
                      </div>
                    ) : (
                      <div className="h-48 flex items-center justify-center bg-white">
                        <div className="text-center">
                          <FileIcon className="w-12 h-12 text-[var(--teal)] mx-auto mb-4 animate-pulse" />
                          <p className="text-xs font-black text-[var(--ink)] uppercase tracking-tight">{fileName}</p>
                        </div>
                      </div>
                    )}
                    <button 
                      type="button"
                      onClick={() => { setFile(null); setFileName(''); setPreview(null); }}
                      className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-md hover:bg-white text-[var(--red)] rounded-xl flex items-center justify-center shadow-lg transition-all active:scale-90"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="p-6 bg-[var(--bg1)]/40 rounded-[24px] border border-[#f0eee8] border-dashed">
                     <p className="text-[9px] font-black text-[var(--ink3)] uppercase tracking-[0.2em] flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-[var(--teal)]" />
                        Archivo listo para validación criptográfica
                     </p>
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-5 px-8 bg-white border border-[#f0eee8] rounded-2xl text-[var(--ink3)] font-black uppercase text-[10px] tracking-[0.2em] hover:bg-[var(--bg1)] hover:text-[var(--ink)] transition-all active:scale-[0.98]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading || !file}
                  className="flex-[2] py-5 px-8 bg-[var(--ink)] text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-2xl shadow-[var(--ink)]/30 flex items-center justify-center gap-4 h-16 group"
                >
                  {loading ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Indexando...</>
                  ) : (
                    <span className="flex items-center gap-3">
                       Sincronizar Hash
                       <Check className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};
