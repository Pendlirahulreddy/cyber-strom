
import React, { useState, useRef, useEffect } from 'react';
import { chatWithMentor } from '../services/geminiService';
import { LearningPath } from '../types';

interface AIMentorProps {
  context: LearningPath;
}

const AIMentor: React.FC<AIMentorProps> = ({ context }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot', text: string }[]>([
    { role: 'bot', text: `Hi! I'm your EduStream Tutor for ${context.topic}. How can I assist with your studies today?` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const reply = await chatWithMentor(userMsg, context);
      setMessages(prev => [...prev, { role: 'bot', text: reply || "I'm sorry, I missed that. Could you repeat?" }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'bot', text: "I'm having trouble connecting. Check your internet." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-10 right-10 z-50">
      {isOpen ? (
        <div className="bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] border border-slate-200 w-[380px] flex flex-col overflow-hidden animate-fadeIn">
          <div className="bg-slate-900 p-7 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/20">
                <i className="fas fa-user-graduate text-sm"></i>
              </div>
              <div>
                <span className="block font-bold text-sm tracking-tight uppercase tracking-widest leading-none mb-1">EduStream Tutor</span>
                <span className="block text-[9px] text-violet-400 uppercase font-black tracking-widest">Online & Ready</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="opacity-40 hover:opacity-100 transition-opacity">
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div ref={scrollRef} className="h-[420px] overflow-y-auto p-7 space-y-7 bg-slate-50/30">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-5 py-3.5 rounded-2xl text-[13px] leading-relaxed font-medium shadow-sm ${
                  m.role === 'user' ? 'bg-violet-600 text-white rounded-br-none' : 'bg-white text-slate-800 border border-slate-100 rounded-bl-none'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-100 px-5 py-3 rounded-2xl rounded-bl-none flex gap-1.5 items-center">
                  <div className="w-1 h-1 bg-violet-400 rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-violet-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1 h-1 bg-violet-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
          </div>
          <div className="p-5 border-t border-slate-100 bg-white">
            <div className="flex gap-3">
              <input 
                type="text" 
                placeholder="Type your question..."
                className="edu-input flex-grow px-5 py-4 rounded-2xl text-sm outline-none transition-all font-medium"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <button 
                onClick={handleSend}
                className="bg-violet-600 text-white w-14 h-14 rounded-2xl flex items-center justify-center hover:bg-violet-700 transition-colors shadow-xl shadow-violet-100"
              >
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-slate-900 text-white w-20 h-20 rounded-[2rem] shadow-2xl flex items-center justify-center hover:bg-violet-600 hover:scale-110 transition-all active:scale-95 group relative"
        >
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-teal-500 rounded-full border-4 border-[#fdfdff] flex items-center justify-center">
             <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
          </div>
          <i className="fas fa-comments text-2xl group-hover:rotate-12"></i>
        </button>
      )}
    </div>
  );
};

export default AIMentor;
