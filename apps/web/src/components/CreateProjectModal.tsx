import React, { useState, useEffect } from 'react';
import { X, Calendar, BookOpen, Layers, Users, Plus, Check, Loader2 } from 'lucide-react';
import { academicService, Cycle, Module, Group } from '@/services/academic.service';
import { projectsService } from '@/services/projects.service';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (project: any) => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose, onCreated }) => {
  const [loading, setLoading] = useState(false);
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    cycleId: '',
    groupId: '',
    year: new Date().getFullYear().toString(),
    moduleIds: [] as string[]
  });

  useEffect(() => {
    if (isOpen) {
      academicService.getCycles().then(setCycles);
      academicService.getModules().then(setModules);
      academicService.getGroups().then(setGroups);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newProject = await projectsService.createProject(formData);
      onCreated(newProject);
      onClose();
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleModule = (moduleId: string) => {
    setFormData(prev => ({
      ...prev,
      moduleIds: prev.moduleIds.includes(moduleId)
        ? prev.moduleIds.filter(id => id !== moduleId)
        : [...prev.moduleIds, moduleId]
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-[var(--bg1)] border border-[var(--border)] w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="p-6 border-b border-[var(--border)] flex items-center justify-between bg-gradient-to-r from-blue-600/10 to-transparent">
          <div>
            <h2 className="text-2xl font-black text-[var(--ink)] tracking-tighter uppercase">Nuevo Proyecto Transversal</h2>
            <p className="text-[var(--ink3)] text-xs font-bold uppercase tracking-widest mt-1">Configuración Industrial de Cursos</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[var(--bg2)] rounded-xl transition-colors text-[var(--ink3)] hover:text-[var(--ink)]">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[var(--ink3)] uppercase tracking-widest pl-1">Nombre del Proyecto</label>
              <input
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[var(--bg2)] border border-[var(--border)] rounded-2xl px-4 py-3 text-[var(--ink)] focus:border-blue-500/50 focus:ring-0 transition-all outline-none font-medium"
                placeholder="Ej: ERP Sostenible 2025"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[var(--ink3)] uppercase tracking-widest pl-1">Ciclo Formativo</label>
              <select
                required
                value={formData.cycleId}
                onChange={e => setFormData({ ...formData, cycleId: e.target.value })}
                className="w-full bg-[var(--bg2)] border border-[var(--border)] rounded-2xl px-4 py-3 text-[var(--ink)] focus:border-blue-500/50 transition-all outline-none"
              >
                <option value="" className="bg-[var(--bg1)]">Seleccionar Ciclo</option>
                {cycles.map(c => <option key={c.id} value={c.id} className="bg-[var(--bg1)]">{c.name}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-[var(--ink3)] uppercase tracking-widest pl-1">Descripción del Objetivo</label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-[var(--bg2)] border border-[var(--border)] rounded-2xl px-4 py-3 text-[var(--ink)] focus:border-blue-500/50 transition-all outline-none resize-none font-medium text-sm"
              placeholder="Describe el alcance y los objetivos industriales del proyecto..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="space-y-2">
              <label className="text-[10px] font-black text-[var(--ink3)] uppercase tracking-widest pl-1">Grupo / Sección</label>
              <select
                required
                value={formData.groupId}
                onChange={e => setFormData({ ...formData, groupId: e.target.value })}
                className="w-full bg-[var(--bg2)] border border-[var(--border)] rounded-2xl px-4 py-3 text-[var(--ink)] focus:border-blue-500/50 transition-all outline-none text-sm"
              >
                <option value="" className="bg-[var(--bg1)]">Grupo</option>
                {groups.map(g => <option key={g.id} value={g.id} className="bg-[var(--bg1)]">{g.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[var(--ink3)] uppercase tracking-widest pl-1">Fecha Inicio</label>
              <input
                required
                type="date"
                value={formData.startDate}
                onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full bg-[var(--bg2)] border border-[var(--border)] rounded-2xl px-4 py-3 text-[var(--ink)] focus:border-blue-500/50 transition-all outline-none text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[var(--ink3)] uppercase tracking-widest pl-1">Fecha Fin</label>
              <input
                required
                type="date"
                value={formData.endDate}
                onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full bg-[var(--bg2)] border border-[var(--border)] rounded-2xl px-4 py-3 text-[var(--ink)] focus:border-blue-500/50 transition-all outline-none text-sm"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-[var(--ink3)] uppercase tracking-widest pl-1">Módulos Implicados</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {modules.map(module => (
                <button
                  key={module.id}
                  type="button"
                  onClick={() => toggleModule(module.id)}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all text-left group ${
                    formData.moduleIds.includes(module.id)
                      ? 'bg-blue-600/20 border-blue-500/50 text-white'
                      : 'bg-[var(--bg2)] border-[var(--border)] text-[var(--ink3)] hover:border-white/20'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-bold uppercase tracking-tight">{module.name}</span>
                    <span className="text-[10px] opacity-60 font-mono italic">{module.code}</span>
                  </div>
                  {formData.moduleIds.includes(module.id) && <Check className="w-4 h-4 text-blue-400" />}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-4 rounded-2xl border border-[var(--border)] text-[var(--ink3)] font-bold hover:bg-[var(--bg2)] transition-all uppercase tracking-widest text-[10px]"
            >
              Cancelar
            </button>
            <button
              disabled={loading}
              type="submit"
              className="flex-[2] px-6 py-4 rounded-2xl bg-blue-600 text-white font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              {loading ? 'Procesando...' : 'Confirmar Creación'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
