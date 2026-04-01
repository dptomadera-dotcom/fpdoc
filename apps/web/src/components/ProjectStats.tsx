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
  Target,
  BarChart3,
  FileDown
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
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        <p className="text-slate-500 font-medium animate-pulse">Calculando métricas académicas...</p>
      </div>
    );
  }

  if (stats.length === 0) {
    return (
      <div className="text-center p-12 bg-white rounded-2xl border-2 border-dashed border-slate-200">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <BarChart3 className="w-8 h-8 text-slate-300" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Sin datos de evaluación</h3>
        <p className="text-slate-500 max-w-xs mx-auto mt-2">
          Comienza a evaluar evidencias para ver el desglose de rendimiento por Resultados de Aprendizaje.
        </p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Rendimiento Académico</h2>
          <p className="text-slate-500 font-medium">Análisis competencial basado en los Resultados de Aprendizaje.</p>
        </div>
        
        <button 
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all active:scale-95"
        >
          <FileDown className="w-5 h-5" />
          Descargar Informe PDF
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((ra) => (
          <div key={ra.id} className="group bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl hover:border-indigo-100 transition-all duration-300 transform hover:-translate-y-1">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-indigo-50 rounded-lg">
                    <Target className="w-4 h-4 text-indigo-600" />
                  </div>
                  <span className="text-sm font-bold text-slate-900 tracking-tight">
                    {ra.code}
                  </span>
                </div>
                
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm ${
                  ra.status === 'SUPERADO' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 
                  ra.status === 'INSUFICIENTE' ? 'bg-rose-50 text-rose-700 border border-rose-100' : 
                  'bg-slate-50 text-slate-500 border border-slate-100'
                }`}>
                  {ra.status === 'SUPERADO' && <CheckCircle2 className="w-3 h-3" />}
                  {ra.status === 'INSUFICIENTE' && <AlertTriangle className="w-3 h-3" />}
                  {ra.status === 'PENDIENTE' && <Clock className="w-3 h-3" />}
                  {ra.status}
                </div>
              </div>
              
              <h4 className="text-slate-800 font-bold text-base mb-3 leading-snug line-clamp-2 min-h-[3rem] group-hover:text-indigo-900 transition-colors">
                {ra.description}
              </h4>
              
              <div className="mt-6 space-y-5">
                <div>
                  <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    <span>Nivel de Logro</span>
                    <span className={`flex items-center gap-1 ${ra.averageScore >= 5 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {ra.averageScore >= 5 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {ra.averageScore.toFixed(1)} / 10
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden shadow-inner">
                    <div 
                      className={`h-2.5 rounded-full transition-all duration-1000 ease-out shadow-sm ${
                        ra.averageScore >= 5 ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' : 'bg-gradient-to-r from-rose-400 to-rose-600'
                      }`}
                      style={{ width: `${ra.averageScore * 10}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Criterios Cubiertos</span>
                    <span className="text-sm font-bold text-slate-900">{ra.evaluatedCriteria} indicadores</span>
                  </div>
                  <button className="p-2 bg-slate-50 rounded-lg text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
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
