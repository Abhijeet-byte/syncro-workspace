import React, { useEffect } from 'react';
import { Terminal, Eye, Layers } from 'lucide-react';

export default function CommandPalette({ isOpen, onClose, setView }) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4 bg-zinc-950/80 backdrop-blur-sm">
      <div className="w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center gap-2 px-4 border-b border-zinc-800 h-12 bg-zinc-950/20">
          <Terminal size={16} className="text-zinc-400" />
          <input 
            type="text" 
            placeholder="Type a command or navigate..." 
            className="w-full bg-transparent text-sm text-zinc-100 placeholder-zinc-500 outline-none border-none"
            autoFocus
          />
        </div>
        
        <div className="p-2 space-y-1">
          <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 px-3 py-1.5 font-bold">Navigation</div>
          <button 
            onClick={() => { setView('board'); onClose(); }}
            className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all text-left"
          >
            <Layers size={14} className="text-zinc-400" /> Switch to Kanban Board View
          </button>
          <button 
            onClick={() => { setView('list'); onClose(); }}
            className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all text-left"
          >
            <Eye size={14} className="text-zinc-400" /> Switch to Dense Data List View
          </button>
        </div>
        
        <div className="bg-zinc-950/40 px-4 py-2 border-t border-zinc-800 flex items-center justify-end gap-1.5 text-[10px] text-zinc-500 font-mono">
          <span>Press</span> <kbd className="bg-zinc-800 px-1 rounded text-zinc-400">ESC</kbd> <span>to exit</span>
        </div>
      </div>
    </div>
  );
}