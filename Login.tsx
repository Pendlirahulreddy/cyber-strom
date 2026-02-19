
import React, { useState } from 'react';

interface LoginProps {
  onLogin: (name: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate a brief network delay
    setTimeout(() => {
      onLogin(email.split('@')[0] || 'Scholar');
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 animate-fadeIn">
      <div className="bg-white w-full max-w-md p-10 rounded-[2.5rem] border border-slate-200 shadow-2xl shadow-slate-200/40 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 p-8 text-violet-100/50 -mr-10 -mt-10">
          <i className="fas fa-shield-alt text-9xl rotate-12"></i>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-100">
              <i className="fas fa-graduation-cap text-white text-lg"></i>
            </div>
            <span className="text-2xl font-bold tracking-tighter text-slate-900">EduStream</span>
          </div>

          <h2 className="serif-heading text-4xl font-normal text-slate-900 mb-2 leading-tight">
            Welcome <span className="italic text-violet-600">Back.</span>
          </h2>
          <p className="text-slate-400 text-sm font-medium mb-10 uppercase tracking-widest">Sign in to continue learning</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Email Address</label>
              <input 
                type="email" 
                required
                placeholder="you@example.com"
                className="edu-input w-full text-sm font-bold rounded-2xl px-6 py-4 outline-none placeholder:text-violet-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Password</label>
              <input 
                type="password" 
                required
                placeholder="••••••••"
                className="edu-input w-full text-sm font-bold rounded-2xl px-6 py-4 outline-none placeholder:text-violet-200"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest px-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-violet-600 transition-colors">
                <input type="checkbox" className="accent-violet-600" /> Remember me
              </label>
              <a href="#" className="text-violet-600 hover:text-violet-800">Forgot Password?</a>
            </div>

            <button 
              disabled={isLoading}
              className={`w-full py-5 rounded-[2rem] text-sm font-black uppercase tracking-[0.2em] transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-4 ${
                isLoading ? 'bg-slate-100 text-slate-300' : 'bg-violet-600 text-white shadow-2xl shadow-violet-200 hover:bg-violet-700'
              }`}
            >
              {isLoading ? <><i className="fas fa-spinner fa-spin"></i> Signing In...</> : <><i className="fas fa-sign-in-alt"></i> Enter Stream</>}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-50 text-center">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Don't have an account? <a href="#" className="text-violet-600 hover:underline underline-offset-4">Create one</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
