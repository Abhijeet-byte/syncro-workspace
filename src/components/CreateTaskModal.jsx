import React, { useState, useEffect } from 'react';
import { X, Plus, AlertCircle } from 'lucide-react';

export default function CreateTaskModal({ isOpen, onClose, onSave }) {
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('Backlog');
  const [priority, setPriority] = useState('Medium');
  const [error, setError] = useState('');

  // Handle escape key to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task description cannot be empty');
      return;
    }
    
    onSave({ title: title.trim(), status, priority });
    
    // Reset Form
    setTitle('');
    setStatus('Backlog');
    setPriority('Medium');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4 bg-zinc-950/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-12 border-b border-zinc-800 bg-zinc-950/20">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400 font-mono">
            Create New Issue
          </div>
          <button 
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-300 p-1 rounded-md hover:bg-zinc-800/50 transition-all"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          
          {/* Title Input */}
          <div className="space-y-1.5">
            <input 
              type="text"
              placeholder="Issue title or quick summary..."
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError('');
              }}
              className="w-full bg-transparent text-sm text-zinc-100 placeholder-zinc-500 outline-none border border-zinc-800 focus:border-zinc-700 p-3 rounded-lg bg-zinc-950/40 focus:ring-1 focus:ring-zinc-800 transition-all"
              autoFocus
            />
            {error && (
              <div className="flex items-center gap-1.5 text-xs text-red-400 px-1 pt-0.5 font-medium animate-in fade-in slide-in-from-top-1 duration-150">
                <AlertCircle size={12} /> {error}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Status Picker */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">Status</label>
              <select 
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 rounded-lg p-2 text-xs outline-none focus:border-zinc-700 transition-all cursor-pointer font-medium"
              >
                <option value="Backlog">Backlog</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>

            {/* Priority Picker */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">Priority</label>
              <select 
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 rounded-lg p-2 text-xs outline-none focus:border-zinc-700 transition-all cursor-pointer font-medium"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          {/* Actions Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60 mt-2">
            <div className="text-[10px] text-zinc-500 font-mono">
              Press <kbd className="bg-zinc-800 px-1 rounded text-zinc-400">ESC</kbd> to cancel
            </div>
            <button 
              type="submit"
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-medium text-xs px-3.5 py-2 rounded-lg border border-indigo-500/30 shadow-md shadow-indigo-950/20 transition-all"
            >
              <Plus size={14} /> Create Issue
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}