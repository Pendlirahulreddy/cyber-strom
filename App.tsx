
import React, { useState, useMemo } from 'react';
import { UserProfile, LearningPath } from './types';
import { generateLearningPath } from './services/geminiService';
import ModuleCard from './components/ModuleCard';
import AIMentor from './components/AIMentor';
import Login from './components/Login';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [path, setPath] = useState<LearningPath | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set());
  
  const [form, setForm] = useState<UserProfile>({
    name: '',
    goal: '',
    ageGroup: 'High School',
    currentLevel: 'Beginner',
    interests: [],
    availableHoursPerWeek: 12,
    learningStyle: 'Reading/Writing',
    priorKnowledge: ''
  });

  const [interestInput, setInterestInput] = useState('');

  const progressPercent = useMemo(() => {
    if (!path || path.modules.length === 0) return 0;
    return Math.round((completedModules.size / path.modules.length) * 100);
  }, [path, completedModules]);

  const handleLogin = (userName: string) => {
    setUser(userName);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setPath(null);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.goal.trim()) {
      setError("Please enter a subject or goal (e.g. 10th Grade Physics).");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await generateLearningPath(form);
      setPath(result);
      setCompletedModules(new Set());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      setError("We couldn't forge the path right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = (id: string, completed: boolean) => {
    setCompletedModules(prev => {
      const next = new Set(prev);
      if (completed) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const reset = () => {
    setPath(null);
    setError(null);
  };

  return (
    <div className="min-h-screen text-slate-900">
      {/* Premium Header */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={reset}>
            <div className="w-10 h-10 bg-violet-600 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-12 shadow-lg shadow-violet-100">
              <i className="fas fa-graduation-cap text-white text-lg"></i>
            </div>
            <span className="text-2xl font-bold tracking-tighter text-slate-900">EduStream</span>
          </div>
          
          <div className="hidden md:flex items-center gap-10">
            {isLoggedIn && ['Dashboard', 'Curriculum', 'Resources'].map(item => (
              <a key={item} href="#" className="text-sm font-bold text-slate-400 hover:text-violet-600 transition-colors uppercase tracking-widest">{item}</a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest hidden sm:inline">Hi, {user}</span>
                <button 
                  onClick={handleLogout}
                  className="bg-slate-100 text-slate-600 px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-rose-50 hover:text-rose-600 transition-all"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-violet-600 transition-all shadow-xl shadow-slate-100">
                Sign Up
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        {!isLoggedIn ? (
          <Login onLogin={handleLogin} />
        ) : !path ? (
          <div className="grid lg:grid-cols-2 gap-20 items-center animate-fadeIn">
            {/* Hero Left */}
            <div className="space-y-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-50 border border-violet-100 rounded-2xl">
                <span className="w-2 h-2 rounded-full bg-violet-600 animate-pulse"></span>
                <span className="text-xs font-black text-violet-700 uppercase tracking-widest">Global Academic Study Assistant</span>
              </div>
              
              <h1 className="serif-heading text-7xl md:text-8xl font-normal text-slate-900 leading-[0.95] tracking-tight">
                Your Success, <br />
                <span className="italic font-normal text-violet-600">Expertly Streamlined.</span>
              </h1>
              
              <p className="text-xl text-slate-500 leading-relaxed max-w-lg font-medium">
                From 6th Grade Math to Advanced Quantum Physics. EduStream creates the curriculum you need to succeed in school and beyond.
              </p>

              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-slate-100">
                <div>
                  <p className="text-3xl font-black text-slate-900">K-12+</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Support Level</p>
                </div>
                <div>
                  <p className="text-3xl font-black text-slate-900">95%</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mastery Rate</p>
                </div>
                <div>
                  <p className="text-3xl font-black text-slate-900">24/7</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">AI Tutoring</p>
                </div>
              </div>
            </div>

            {/* Input Dashboard Form */}
            <div className="bg-white p-10 md:p-12 rounded-[3rem] border border-slate-200 shadow-2xl shadow-slate-200/40 relative">
              <div className="absolute top-8 right-8 text-violet-100">
                <i className="fas fa-microchip text-7xl"></i>
              </div>
              
              <h2 className="text-2xl font-bold text-slate-900 mb-10 tracking-tight">Study Configuration</h2>
              
              <form onSubmit={handleGenerate} className="space-y-8">
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Study Subject or Goal</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 11th Grade Organic Chemistry"
                    className="edu-input w-full text-xl font-bold rounded-2xl px-6 py-4 outline-none placeholder:text-violet-200"
                    value={form.goal}
                    onChange={(e) => setForm(prev => ({ ...prev, goal: e.target.value }))}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Grade / Level</label>
                    <select 
                      className="edu-input w-full px-6 py-3 font-bold text-slate-800 rounded-2xl outline-none appearance-none"
                      value={form.ageGroup}
                      onChange={(e) => setForm(prev => ({ ...prev, ageGroup: e.target.value }))}
                    >
                      <option>Primary School</option>
                      <option>Middle School</option>
                      <option>High School</option>
                      <option>Intermediate / 12th</option>
                      <option>Undergraduate</option>
                      <option>Professional</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Current Skills</label>
                    <select 
                      className="edu-input w-full px-6 py-3 font-bold text-slate-800 rounded-2xl outline-none appearance-none"
                      value={form.currentLevel}
                      onChange={(e) => setForm(prev => ({ ...prev, currentLevel: e.target.value as any }))}
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Weekly Effort</label>
                    <div className="flex items-center gap-4">
                      <input 
                        type="range" 
                        min="2" max="40"
                        className="flex-grow h-1.5 bg-violet-100 rounded-lg appearance-none cursor-pointer accent-violet-600"
                        value={form.availableHoursPerWeek}
                        onChange={(e) => setForm(p => ({...p, availableHoursPerWeek: parseInt(e.target.value)}))}
                      />
                      <span className="text-sm font-bold text-violet-600 w-8 text-right">{form.availableHoursPerWeek}h</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Learning Style</label>
                    <select 
                      className="edu-input w-full px-6 py-3 font-bold text-slate-800 rounded-2xl outline-none appearance-none"
                      value={form.learningStyle}
                      onChange={(e) => setForm(p => ({...p, learningStyle: e.target.value as any}))}
                    >
                      <option>Visual</option>
                      <option>Auditory</option>
                      <option>Reading/Writing</option>
                      <option>Hands-on</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Interests (to customize examples)</label>
                  <div className="flex gap-2 mb-4">
                    <input 
                      type="text" 
                      placeholder="e.g. Space, Sports, Art"
                      className="edu-input flex-grow rounded-2xl px-6 py-3 outline-none"
                      value={interestInput}
                      onChange={(e) => setInterestInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), setForm(p => ({...p, interests: [...p.interests, interestInput]})) , setInterestInput(''))}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {form.interests.map(i => (
                      <span key={i} className="text-[10px] font-bold bg-teal-50 px-3 py-1.5 rounded-lg text-teal-700 uppercase tracking-widest border border-teal-100">
                        {i}
                      </span>
                    ))}
                  </div>
                </div>

                {error && <p className="text-rose-500 text-xs font-bold uppercase tracking-widest">{error}</p>}

                <button 
                  disabled={loading}
                  className={`w-full py-5 rounded-[2rem] text-sm font-black uppercase tracking-[0.2em] transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-4 ${
                    loading ? 'bg-slate-100 text-slate-300' : 'bg-violet-600 text-white shadow-2xl shadow-violet-200 hover:bg-violet-700'
                  }`}
                >
                  {loading ? <><i className="fas fa-spinner fa-spin"></i> Generating Syllabus...</> : <><i className="fas fa-paper-plane"></i> Build Roadmap</>}
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="animate-fadeIn">
            {/* Study Dashboard Results */}
            <div className="mb-20 flex flex-col md:flex-row justify-between items-end gap-10 border-b border-slate-100 pb-16">
              <div className="w-full md:w-2/3">
                <button onClick={reset} className="text-[11px] font-black text-slate-400 hover:text-violet-600 mb-8 transition-colors uppercase tracking-[0.3em] flex items-center gap-2">
                  <i className="fas fa-chevron-left text-[8px]"></i> New Subject
                </button>
                <div className="flex items-center gap-4 mb-4">
                  <span className="px-3 py-1 bg-violet-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-violet-100">
                    Roadmap Active
                  </span>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Target: {path.topic}</span>
                </div>
                <h1 className="serif-heading text-6xl font-normal text-slate-900 mb-6 tracking-tight leading-none">
                  Your Path to <span className="italic text-violet-600">Mastery</span>
                </h1>
                <p className="text-xl text-slate-500 leading-relaxed font-medium">
                  "{path.summary}"
                </p>
              </div>

              <div className="w-full md:w-1/3 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/20">
                <div className="flex justify-between items-center mb-5">
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Path Completion</span>
                  <span className="text-xl font-black text-violet-600">{progressPercent}%</span>
                </div>
                <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden p-1">
                  <div 
                    className="h-full bg-violet-600 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
                <div className="mt-6 flex justify-between">
                  <div className="text-center">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Time</p>
                    <p className="font-bold text-slate-700">{path.totalEstimatedWeeks}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Units</p>
                    <p className="font-bold text-slate-700">{path.modules.length}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Level</p>
                    <p className="font-bold text-slate-700">{form.currentLevel}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-20">
              {/* Main Learning Timeline */}
              <div className="lg:col-span-8 space-y-4">
                <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em] mb-12 flex items-center gap-6">
                  Curriculum Roadmap
                  <div className="h-px bg-slate-200 flex-grow"></div>
                </h3>
                {path.modules.map((module, index) => (
                  <ModuleCard 
                    key={module.id} 
                    module={module} 
                    index={index} 
                    onToggleComplete={handleToggleComplete}
                  />
                ))}
              </div>

              {/* Sidebar Mastery Column */}
              <div className="lg:col-span-4 space-y-12">
                <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white shadow-2xl shadow-violet-200">
                  <h4 className="text-[11px] font-black text-violet-400 uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
                    <i className="fas fa-award"></i> Core Outcomes
                  </h4>
                  <ul className="space-y-6">
                    {path.outcomes.map((o, i) => (
                      <li key={i} className="text-sm font-medium flex items-start gap-4 text-slate-300 leading-relaxed group">
                        <div className="w-6 h-6 rounded-lg bg-violet-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-violet-500 transition-colors">
                          <i className="fas fa-check text-[10px] text-violet-400 group-hover:text-white"></i>
                        </div>
                        {o}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200">
                  <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">Base Knowledge</h4>
                  <div className="flex flex-wrap gap-2">
                    {path.prerequisites.map((p, i) => (
                      <span key={i} className="text-[10px] font-bold px-4 py-2 bg-slate-50 text-slate-600 rounded-xl border border-slate-100 uppercase tracking-widest">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-10 bg-teal-50 rounded-[2.5rem] border border-teal-100 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-6 text-teal-100/50 rotate-12 transition-transform group-hover:rotate-45 duration-700">
                    <i className="fas fa-star text-[6rem]"></i>
                  </div>
                  <h5 className="font-black text-teal-900 text-lg mb-3">EduStream Certificate</h5>
                  <p className="text-xs text-teal-700 leading-relaxed font-medium mb-6 relative z-10">
                    Complete all modules to unlock your custom diploma verified by EduStream AI.
                  </p>
                  <button className="px-6 py-3 bg-teal-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-teal-700 transition-all relative z-10">
                    View Requirements
                  </button>
                </div>
              </div>
            </div>
            
            <AIMentor context={path} />
          </div>
        )}
      </main>

      {/* Modern Academic Footer */}
      <footer className="border-t border-slate-200 bg-white py-24 mt-20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
          <div className="col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-violet-600 rounded-xl flex items-center justify-center">
                <i className="fas fa-graduation-cap text-white text-sm"></i>
              </div>
              <span className="text-xl font-bold tracking-tighter">EduStream</span>
            </div>
            <p className="text-slate-400 text-sm font-medium max-w-sm leading-relaxed">
              Empowering students globally with personalized AI learning roadmaps for school, college, and professional life.
            </p>
          </div>
          <div>
            <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] mb-6">Subject Hubs</h5>
            <ul className="space-y-3 text-sm font-bold text-slate-500">
              <li><a href="#" className="hover:text-violet-600">STEM Sciences</a></li>
              <li><a href="#" className="hover:text-violet-600">Humanities</a></li>
              <li><a href="#" className="hover:text-violet-600">Test Prep (SAT/ACT)</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] mb-6">Connect</h5>
            <div className="flex gap-4">
              {['Twitter', 'GitHub', 'LinkedIn'].map(s => (
                <a key={s} href="#" className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-violet-50 hover:text-violet-600 transition-all">
                  <i className={`fab fa-${s.toLowerCase()}`}></i>
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-12 mt-12 border-t border-slate-50 flex justify-between text-[10px] font-black text-slate-300 uppercase tracking-widest">
          <p>© 2024 EDUSTREAM ACADEMY. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-8">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        input::placeholder { color: #ddd6fe; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #fdfdff; }
        ::-webkit-scrollbar-thumb { background: #ddd6fe; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #c4b5fd; }
      `}</style>
    </div>
  );
};

export default App;
