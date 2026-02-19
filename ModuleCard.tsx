
import React, { useState } from 'react';
import { LearningModule } from '../types';

interface ModuleCardProps {
  module: LearningModule;
  index: number;
  onToggleComplete: (id: string, completed: boolean) => void;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ module, index, onToggleComplete }) => {
  const [isCompleted, setIsCompleted] = useState(false);

  const toggleStatus = () => {
    const next = !isCompleted;
    setIsCompleted(next);
    onToggleComplete(module.id, next);
  };

  return (
    <div className={`step-line relative pl-16 pb-12 transition-all duration-300 ${isCompleted ? 'opacity-60' : ''}`}>
      {/* Connector Node */}
      <div 
        onClick={toggleStatus}
        className={`absolute left-0 top-0 w-12 h-12 rounded-full border-4 border-[#fdfdff] z-10 flex items-center justify-center cursor-pointer transition-all shadow-md ${
          isCompleted ? 'bg-violet-600 text-white' : 'bg-white text-slate-300 group-hover:scale-110'
        }`}
      >
        {isCompleted ? <i className="fas fa-check"></i> : <span className="font-bold">{index + 1}</span>}
      </div>

      <div className={`bg-white rounded-3xl p-8 border border-slate-200 transition-all hover:border-violet-200 hover:shadow-xl ${isCompleted ? 'bg-slate-50' : ''}`}>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 bg-teal-100 text-teal-700 text-[10px] font-black uppercase tracking-widest rounded-md">
                {module.difficulty}
              </span>
              <span className="text-xs font-bold text-slate-400">
                &bull; {module.duration}
              </span>
            </div>
            <h3 className={`text-2xl font-bold tracking-tight text-slate-900 ${isCompleted ? 'line-through decoration-violet-400' : ''}`}>
              {module.title}
            </h3>
          </div>
          <button 
            onClick={toggleStatus}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              isCompleted 
              ? 'bg-slate-200 text-slate-500' 
              : 'bg-violet-50 text-violet-700 hover:bg-violet-600 hover:text-white'
            }`}
          >
            {isCompleted ? 'Completed' : 'Complete Unit'}
          </button>
        </div>

        <p className="text-slate-600 text-base leading-relaxed mb-8 font-medium">
          {module.description}
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <i className="fas fa-book-open text-violet-400"></i> Learning Tasks
            </h4>
            <ul className="space-y-3">
              {module.activities.map((act, i) => (
                <li key={i} className="text-sm text-slate-700 flex items-start gap-3 group">
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-200 mt-2 transition-all group-hover:bg-violet-500"></div>
                  {act}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-violet-50/50 p-6 rounded-2xl border border-violet-100/50">
            <h4 className="text-[11px] font-black text-violet-500 uppercase tracking-widest mb-3 flex items-center gap-2">
              <i className="fas fa-microscope text-teal-500"></i> Milestone Project
            </h4>
            <p className="text-sm font-bold text-slate-800 mb-2">{module.project.title}</p>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">{module.project.description}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 pt-6 border-t border-slate-100">
          {module.resources.map((res, i) => (
            <a 
              key={i} 
              href={res.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:border-violet-400 hover:text-violet-600 transition-all shadow-sm group"
            >
              <i className={`fas ${res.type === 'video' ? 'fa-play-circle text-rose-500' : 'fa-external-link-alt text-violet-500'} mr-2 transition-transform group-hover:scale-125`}></i>
              {res.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModuleCard;
