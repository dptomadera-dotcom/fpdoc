'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthGuard } from '@/lib/use-auth-guard';
import { extractionService, ExtractionResult, ExtractedOutcome } from '@/services/curriculum-extraction.service';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { Upload, FileText, CheckCircle, AlertTriangle, Save, Loader2, X } from 'lucide-react';

export default function ImportCurriculum() {
  useAuthGuard(['PROFESOR', 'ADMIN', 'JEFATURA']);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ExtractionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [moduleId, setModuleId] = useState<string>(''); // For now, we'll ask for it if not found

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const result = await extractionService.processPDF(file);
      setData(result);
      if (result.outcomes.length === 0) {
        setError('No se detectaron RAs ni CEs en este documento. Prueba con un formato estándar.');
      }
    } catch (err: any) {
      setError(err.message || 'Error al procesar el archivo.');
    } finally {
      setLoading(false);
    }
  };

  const clearData = () => {
    setData(null);
    setFile(null);
    setSaveStatus('idle');
  };

  const handleSave = async () => {
    if (!data) return;
    
    // In a real app we'd fetch the module ID from a selector or URL
    // For now we'll use a placeholder or detect from the PDF if possible
    const tempModuleId = moduleId || '67c80f4a-9a2c-4734-9721-6cbb01db5432'; // Placeholder for demonstration

    setSaveStatus('saving');
    try {
      await extractionService.saveExtractedCurriculum(data, tempModuleId);
      setSaveStatus('success');
    } catch (err: any) {
      console.error('Save error:', err);
      setError('Error al guardar en la base de datos: ' + (err.message || 'Error desconocido'));
      setSaveStatus('error');
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <div className="text-[10px] text-[var(--teal)] font-bold uppercase tracking-widest mb-1">Carga Inteligente</div>
          <h1 className="text-2xl font-bold font-serif text-[var(--ink)]">Importar Programación Didáctica</h1>
          <p className="text-sm text-[var(--ink3)] mt-2">
            Sube el PDF oficial de tu módulo. Nuestro sistema extraerá automáticamente los Resultados de Aprendizaje y Criterios de Evaluación.
          </p>
        </header>

        <AnimatePresence mode="wait">
          {!data ? (
            <motion.div
              key="dropzone"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white border-2 border-dashed border-[var(--bg2)] rounded-2xl p-12 text-center"
            >
              <div className="w-16 h-16 bg-[var(--bg1)] rounded-full flex items-center justify-center mx-auto mb-6">
                <Upload className="w-8 h-8 text-[var(--teal)]" />
              </div>
              
              <label className="block mb-4">
                <span className="text-lg font-bold text-[var(--ink)] cursor-pointer hover:text-[var(--teal)] transition-colors">
                  {file ? file.name : "Selecciona o arrastra el PDF aquí"}
                </span>
                <input 
                  type="file" 
                  accept=".pdf" 
                  className="hidden" 
                  onChange={handleFileChange} 
                />
              </label>

              <p className="text-xs text-[var(--ink3)] mb-8">Formatos BOE, BOCM o guías departamentales estándar.</p>

              <button
                onClick={handleUpload}
                disabled={!file || loading}
                className={`fp-button w-full sm:w-auto h-12 px-8 flex items-center justify-center gap-2 ${
                  !file || loading ? 'opacity-50 grayscale' : ''
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analizando documento...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    Iniciar Procesamiento
                  </>
                )}
              </button>

              {error && (
                <div className="mt-6 p-4 bg-[var(--red2)] text-[var(--red)] text-xs font-bold rounded-lg flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  {error}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="fp-badge bg-[var(--teal2)] text-[var(--teal)] font-bold">
                    {data.outcomes.length} RAs Detectados
                  </span>
                  <span className="text-xs text-[var(--ink3)]">Analizado con éxito</span>
                </div>
                <button
                  onClick={clearData}
                  className="text-xs font-bold text-[var(--red)] hover:underline flex items-center gap-1"
                >
                  <X className="w-3 h-3" /> Substituir archivo
                </button>
              </div>

              {/* Lista de RA/CE Resultantes */}
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {data.outcomes.map((ra, idx) => (
                  <div key={idx} className="fp-card border-l-4 border-l-[var(--teal)]">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="text-xs font-bold font-serif text-[var(--teal)] uppercase tracking-tight">
                        Resultado de Aprendizaje {ra.code}
                      </div>
                    </div>
                    <p className="text-sm text-[var(--ink)] leading-relaxed italic mb-4">
                      "{ra.content}"
                    </p>

                    <div className="space-y-2 pl-4 border-l border-[#f0eee8]">
                      {ra.criteria.map((ce, cIdx) => (
                        <div key={cIdx} className="text-xs flex gap-3 group">
                          <span className="font-bold text-[var(--ink2)] whitespace-nowrap">CE {ce.code}:</span>
                          <span className="text-[var(--ink3)] group-hover:text-[var(--ink)] transition-colors">
                            {ce.content}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="sticky bottom-0 pt-6 pb-2 bg-[var(--bg1)] bg-opacity-80 backdrop-blur-sm">
                <button 
                  onClick={handleSave}
                  disabled={saveStatus === 'saving' || saveStatus === 'success'}
                  className={`fp-button-secondary w-full h-14 flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl transition-all ${
                    saveStatus === 'success' ? 'bg-[var(--teal)] text-white' : ''
                  }`}
                >
                  {saveStatus === 'saving' ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sincronizando con base de datos...
                    </>
                  ) : saveStatus === 'success' ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Programación Guardada Exitosamente
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Sincronizar Programación en Base de Datos
                    </>
                  )}
                </button>
                
                {saveStatus === 'success' && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-[11px] font-bold text-[var(--teal)] mt-3">
                    Los datos ahora están disponibles en tu sección de Transversalidad.
                  </motion.p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
