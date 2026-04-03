'use client';

import React, { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ArrowRight,
  Target,
  BarChart3,
  FileDown,
  Award
} from 'lucide-react';
import { monitoringService } from '../services/monitoring.service';

interface RAStat {
  id: string;
  code: string;
  description: string;
  averageScore: number;
  evaluatedCriteria: number;
  status: 'SUPERADO' | 'INSUFICIENTE' | 'PENDIENTE';
}

interface ProjectStatsProps {
  projectId: string;
}

const ProjectStats: React.FC<ProjectStatsProps> = ({ projectId }) => {
  const [stats, setStats] = useState<RAStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await monitoringService.getProjectStats(projectId);
        setStats(data || []);
      } catch (error) {
        console.error('Error fetching project stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [projectId]);

  const handleDownloadPDF = async () => {
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${apiBaseUrl}/reports/project/${projectId}/pdf`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte-proyecto-${projectId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Error al generar el PDF. Por favor, inténtalo de nuevo.');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-6">
        <div className="relative">
          <div className="w-16 h-16 rounded-3xl border-4 border-[var(--teal2)] border-t-[var(--teal)] animate-spin" />
          <Award className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-[var(--teal)] animate-pulse" />
        </div>
        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--ink3)]">Calculando métricas académicas...</p>
      </div>
    );
  }

  if (stats.length === 0) {
    return (
      <div className="text-center p-20 bg-white rounded-[40px] border border-[#f0eee8] shadow-sm">
        <div className="w-20 h-20 bg-[var(--bg1)] rounded-[32px] flex items-center justify-center mx-auto mb-6">
          <BarChart3 className="w-10 h-10 text-[var(--bg2)]" />
        </div>
        <h3 className="text-xl font-black text-[var(--ink)] tracking-tight">Sin datos de evaluación</h3>
        <p className="text-[var(--ink3)] text-sm max-w-xs mx-auto mt-2 font-medium">
          Comienza a validar evidencias para generar el análisis competencial automático.
        </p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-3xl font-black text-[var(--ink)] tracking-tight">Rendimiento Académico</h2>
            <div className="px-3 py-1 bg-[var(--teal2)] text-[var(--teal)] rounded-full text-[10px] font-black uppercase tracking-widest">
               Real-time Data
            </div>
          </div>
          <p className="text-[var(--ink3)] font-medium">Análisis profundo del desarrollo de capacidades y resultados de aprendizaje.</p>
        </div>
        
        <button 
          onClick={handleDownloadPDF}
          className="flex items-center gap-3 px-8 py-4 bg-[var(--ink)] text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-[var(--ink)]/20 hover:scale-[1.02] active:scale-[0.98] transition-all group"
        >
          <FileDown className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
          Descargar Informe Certificado
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {stats.map((ra) => (
          <div key={ra.id} className="group bg-white rounded-[40px] p-8 border border-[#f0eee8] hover:border-[var(--teal)]/30 hover:shadow-2xl hover:shadow-[var(--teal)]/5 transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--teal)]/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-[var(--teal)]/10 transition-colors" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[var(--bg1)] rounded-2xl flex items-center justify-center border border-[#f0eee8] group-hover:scale-110 transition-transform">
                    <Target className="w-5 h-5 text-[var(--teal)]" />
                  </div>
                  <span className="text-sm font-black text-[var(--ink)] tracking-tight">
                    {ra.code}
                  </span>
                </div>
                
                <div className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm ${
                  ra.status === 'SUPERADO' ? 'bg-[var(--teal2)] text-[var(--teal)] border border-[var(--teal)]/10' : 
                  ra.status === 'INSUFICIENTE' ? 'bg-[var(--red2)] text-[var(--red)] border border-[var(--red)]/10' : 
                  'bg-[var(--bg1)] text-[var(--ink3)] border border-[#f0eee8]'
                }`}>
                  {ra.status}
                </div>
              </div>
              
              <h4 className="text-[var(--ink2)] font-bold text-base mb-6 leading-snug line-clamp-2 min-h-[3rem]">
                {ra.description}
              </h4>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-[var(--ink3)] mb-3">
                    <span>Nivel de Desarrollo</span>
                    <span className={`flex items-center gap-1.5 ${ra.averageScore >= 5 ? 'text-[var(--teal)]' : 'text-[var(--red)]'}`}>
                      {ra.averageScore.toFixed(1)} / 10.0
                    </span>
                  </div>
                  <div className="w-full bg-[var(--bg1)] rounded-full h-3 overflow-hidden border border-[#f0eee8]">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ease-out ${
                        ra.averageScore >= 5 ? 'bg-[var(--teal)]' : 'bg-[var(--red)]'
                      }`}
                      style={{ width: `${ra.averageScore * 10}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#f0eee8]">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] font-black text-[var(--ink3)] uppercase tracking-widest">Indicadores</span>
                    <span className="text-xs font-black text-[var(--ink)]">{ra.evaluatedCriteria} CE Evaluados</span>
                  </div>
                  <button className="w-10 h-10 bg-[var(--bg1)] rounded-2xl flex items-center justify-center text-[var(--ink3)] group-hover:bg-[var(--teal)] group-hover:text-white transition-all transform group-hover:translate-x-1">
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectStats;
