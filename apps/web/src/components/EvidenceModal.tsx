import React, { useState } from 'react';
import { X, Upload, Check, Loader2, FileIcon } from 'lucide-react';
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

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    try {
      setLoading(true);
      
      // 1. Upload to storage
      const uploadResult = await monitoringService.uploadFile(file, taskId);
      
      // 2. Register evidence in DB
      await monitoringService.submitEvidence(
        taskId, 
        uploadResult.fileName, 
        uploadResult.url, 
        uploadResult.mimeType
      );

      setSuccess(true);
      setTimeout(() => {
        onSubmitted?.();
        onClose();
        setSuccess(false);
        setFile(null);
        setFileName('');
      }, 1500);
    } catch (error) {
      console.error('Error submitting evidence:', error);
      alert('Error al subir el archivo. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Subir Evidencia</h2>
            <p className="text-xs text-slate-500 mt-0.5">Tarea: {taskTitle}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full text-slate-400 hover:text-slate-900 transition-all border border-transparent hover:border-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {success ? (
            <div className="flex flex-col items-center justify-center py-8 text-center animate-in zoom-in-95 duration-500">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                <Check className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">¡Evidencia Enviada!</h3>
              <p className="text-slate-500 mt-2">El profesor recibirá una notificación para revisarla.</p>
            </div>
          ) : (
            <>
              <div className="p-6 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 flex flex-col items-center justify-center text-center group hover:border-slate-300 transition-all">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-sm font-semibold text-slate-900">Selecciona o arrastra el archivo</p>
                <p className="text-xs text-slate-400 mt-1">PDF, Imágenes o Documentos (máx. 10MB)</p>
                <input 
                  type="file" 
                  className="hidden" 
                  id="evidence-file"
                  onChange={(e) => {
                    const selectedFile = e.target.files?.[0];
                    if (selectedFile) {
                      setFileName(selectedFile.name);
                      setFile(selectedFile);
                    }
                  }}
                />
                <button 
                  type="button"
                  onClick={() => document.getElementById('evidence-file')?.click()}
                  className="mt-4 px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
                >
                  Abrir explorador
                </button>
              </div>

              {fileName && (
                <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-100 rounded-lg animate-in slide-in-from-bottom-2 duration-300">
                  <div className="w-8 h-8 bg-white rounded flex items-center justify-center text-emerald-500 border border-emerald-100">
                    <FileIcon className="w-4 h-4" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="text-xs font-bold text-emerald-900 truncate">{fileName}</p>
                    <p className="text-[10px] text-emerald-600">Listo para enviar</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => { setFileName(''); setFile(null); }}
                    className="p-1 hover:bg-emerald-100 rounded text-emerald-400 hover:text-emerald-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 px-4 border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50 transition-all text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading || !fileName}
                  className="flex-1 py-3 px-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg flex items-center justify-center gap-2 text-sm"
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Enviando...</>
                  ) : (
                    'Enviar evidencia'
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
