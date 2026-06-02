import React, { useState, useEffect } from 'react';
import { Columns, List, Search, Plus, Kanban, Activity, Target, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { initialTasks } from './data/mockData';
import CommandPalette from './components/CommandPalette';
import CreateTaskModal from './components/CreateTaskModal';

export default function App() {
  // 1. Core Application State with LocalStorage Initialization
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('syncro_tasks');
    return savedTasks ? JSON.parse(savedTasks) : initialTasks;
  });
  const [view, setView] = useState('board'); 
  const [searchQuery, setSearchQuery] = useState('');
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // 2. LocalStorage Sync Engine Effect
  useEffect(() => {
    localStorage.setItem('syncro_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // 3. Derived Analytics State
  const totalIssues = tasks.length;
  const backlogCount = tasks.filter(t => t.status === 'Backlog').length;
  const inProgressCount = tasks.filter(t => t.status === 'In Progress').length;
  const doneCount = tasks.filter(t => t.status === 'Done').length;
  const completionPercentage = totalIssues > 0 ? Math.round((doneCount / totalIssues) * 100) : 0;

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 4. Data Mutation: Adding New Tasks
  const handleAddTask = (newTaskData) => {
    setTasks((prevTasks) => {
      const nextIdNumber = prevTasks.length + 1;
      return [...prevTasks, {
        id: `SYN-${nextIdNumber}`,
        title: newTaskData.title,
        status: newTaskData.status,
        priority: newTaskData.priority,
        updated: "Just now"
      }];
    });
  };

  // 5. Data Mutation: Update Task Column Status Lifecycle
  const handleUpdateStatus = (taskId, newStatus) => {
    setTasks((prevTasks) => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus, updated: "Just now" } : task
      )
    );
  };

  // 6. Global Hotkey Keyboard Listeners Engine
  useEffect(() => {
    const handleGlobalKeys = (e) => {
      if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
        if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
          e.preventDefault();
          setIsPaletteOpen((prev) => !prev);
        }
        return;
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setIsPaletteOpen((prev) => !prev);
      }
      if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        setIsCreateOpen(true);
      }
    };
    window.addEventListener('keydown', handleGlobalKeys, true);
    return () => window.removeEventListener('keydown', handleGlobalKeys, true);
  }, []);

  return (
    <div className="flex h-screen w-screen bg-[#070708] text-zinc-100 antialiased overflow-hidden selection:bg-indigo-500/30">
      
      {/* ================= ILLUSTRATIVE SIDEBAR ================= */}
      <aside className="w-64 border-r border-zinc-900 bg-[#0c0c0e] p-5 flex flex-col justify-between hidden md:flex">
        <div className="space-y-6">
          <div className="flex items-center gap-2.5 px-1 py-1">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-indigo-400/30">
              <Activity size={14} className="text-white animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xs tracking-tight text-zinc-200 uppercase font-mono">Syncro.OS</span>
              <span className="text-[10px] text-indigo-400 font-mono font-medium tracking-wider">AGENT_ACTIVE</span>
            </div>
          </div>

          <button 
            onClick={() => setIsCreateOpen(true)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-semibold rounded-lg bg-zinc-900 hover:bg-indigo-600 border border-zinc-800 hover:border-indigo-500 text-zinc-300 hover:text-white transition-all duration-200 shadow-md active:scale-95 group relative overflow-hidden"
          >
            <Plus size={14} className="group-hover:rotate-90 transition-transform" /> 
            <span>Create New Task</span>
            <kbd className="ml-auto text-[9px] font-bold bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-800 text-zinc-500 group-hover:text-indigo-200 group-hover:border-indigo-400 transition-colors">C</kbd>
          </button>

          <div className="space-y-1">
            <button className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold rounded-lg bg-zinc-900/60 text-indigo-400 border border-zinc-800/80 font-mono uppercase tracking-wider">
              <Kanban size={14} /> Workspace Node
            </button>
          </div>

          {/* METRICS METERS */}
          <div className="border-t border-zinc-900/80 pt-5 space-y-4">
            <div className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 px-1 font-bold flex items-center gap-1.5">
              <Target size={12} className="text-zinc-600" /> Pipeline Diagnostics
            </div>

            <div className="bg-zinc-900/20 border border-zinc-900 p-3.5 rounded-xl space-y-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 h-[1px] w-12 bg-gradient-to-r from-transparent to-indigo-500/40" />
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-500 text-[11px]">SYS_VELOCITY</span>
                <span className="font-bold text-indigo-400 bg-indigo-950/40 px-1.5 py-0.5 rounded border border-indigo-900/50 text-[10px]">{completionPercentage}%</span>
              </div>
              <div className="h-1 w-full bg-zinc-950 rounded-full border border-zinc-900 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(99,102,241,0.5)]"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>

            <div className="space-y-1.5 font-mono text-[11px] px-0.5">
              <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-900/10 border border-transparent hover:border-zinc-900/60 hover:bg-zinc-900/30 transition-all">
                <div className="flex items-center gap-2 text-zinc-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-zinc-700" />
                  <span>BACKLOG</span>
                </div>
                <span className="font-bold text-zinc-400 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800 text-[10px]">{backlogCount}</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-amber-950/5 border border-amber-900/10 hover:border-amber-900/30 hover:bg-amber-950/10 transition-all">
                <div className="flex items-center gap-2 text-amber-500/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping" />
                  <span>RUNNING</span>
                </div>
                <span className="font-bold text-amber-400 bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-900/30 text-[10px]">{inProgressCount}</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-950/5 border border-emerald-900/10 hover:border-emerald-900/30 hover:bg-emerald-950/10 transition-all">
                <div className="flex items-center gap-2 text-emerald-500/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span>RESOLVED</span>
                </div>
                <span className="font-bold text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-900/30 text-[10px]">{doneCount}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-900 pt-3 px-1 flex items-center justify-between font-mono text-[10px] text-zinc-600">
          <span>SCOPE_CAPACITY</span>
          <span className="text-zinc-400">{totalIssues} ITEMS</span>
        </div>
      </aside>

      {/* ================= MAIN APPLICATION VIEWPORT LAYER ================= */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        <header className="h-14 border-b border-zinc-900 flex items-center justify-between px-6 bg-[#070708]/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-2.5 text-xs bg-[#0c0c0e] border border-zinc-900 px-3 py-1.5 rounded-lg text-zinc-500 w-80 focus-within:border-zinc-700 transition-all">
            <Search size={14} className="text-zinc-600" />
            <input 
              type="text" 
              placeholder="Query task indices..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-zinc-200 placeholder-zinc-600 w-full text-xs font-mono"
            />
          </div>
          
          <div className="flex bg-zinc-950 border border-zinc-900 p-1 rounded-xl">
            <button 
              onClick={() => setView('board')} 
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all duration-200 ${view === 'board' ? 'bg-zinc-900 text-indigo-400 border border-zinc-800 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <Columns size={13} />
              <span>BOARD</span>
            </button>
            <button 
              onClick={() => setView('list')} 
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all duration-200 ${view === 'list' ? 'bg-zinc-900 text-indigo-400 border border-zinc-800 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <List size={13} />
              <span>INDEX</span>
            </button>
          </div>
        </header>

        <div className="flex-1 p-6 overflow-y-auto bg-gradient-to-b from-[#070708] to-[#09090b]">
          {view === 'board' ? (
            /* KANBAN BOARD VIEW */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full items-start">
              {['Backlog', 'In Progress', 'Done'].map((colStatus) => {
                const columnTasks = filteredTasks.filter(t => t.status === colStatus);
                return (
                  <div key={colStatus} className="bg-[#0c0c0e]/40 border border-zinc-900/80 p-4 rounded-xl flex flex-col gap-3 min-h-[200px]">
                    <div className="flex items-center justify-between mb-2 px-1 border-b border-zinc-900/40 pb-2">
                      <span className="text-[10px] font-bold font-mono tracking-widest text-zinc-500 uppercase">{colStatus}</span>
                      <span className="bg-zinc-950 border border-zinc-900 text-zinc-400 px-2 py-0.5 rounded-md text-[9px] font-mono font-bold">
                        {columnTasks.length}
                      </span>
                    </div>
                    
                    {columnTasks.map(task => (
                      <div 
                        key={task.id} 
                        className="bg-[#0c0c0e] border border-zinc-900 p-4 rounded-xl hover:border-indigo-500/40 transition-all duration-300 group cursor-pointer relative overflow-hidden shadow-sm hover:shadow-indigo-500/5"
                      >
                        <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-indigo-500/0 to-transparent group-hover:via-indigo-500/40 transition-all duration-500" />
                        
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[9px] text-zinc-600 font-mono font-bold tracking-wider group-hover:text-indigo-400/80 transition-colors">{task.id}</span>
                          
                          {/* STAGE CONTROLS SYSTEM */}
                          <div className="flex items-center gap-1 opacity-20 group-hover:opacity-100 transition-opacity">
                            {task.status === 'In Progress' && (
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleUpdateStatus(task.id, 'Backlog'); }}
                                className="p-1 rounded bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
                                title="Move to Backlog"
                              >
                                <ArrowLeft size={10} />
                              </button>
                            )}
                            {task.status !== 'Done' ? (
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleUpdateStatus(task.id, task.status === 'Backlog' ? 'In Progress' : 'Done'); }}
                                className="p-1 rounded bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-indigo-400"
                                title="Advance Stage"
                              >
                                <ArrowRight size={10} />
                              </button>
                            ) : (
                              <span className="text-emerald-500 px-1 py-0.5 text-[9px] font-mono border border-emerald-900/40 bg-emerald-950/20 rounded">RESOLVED</span>
                            )}
                          </div>
                        </div>
                        
                        <h4 className="text-xs font-medium text-zinc-300 line-clamp-2 leading-relaxed group-hover:text-zinc-100 transition-colors mb-4">{task.title}</h4>
                        
                        <div className="flex items-center justify-between pt-2 border-t border-zinc-900/50">
                          <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                            task.priority === 'High' ? 'bg-red-950/20 border-red-900/40 text-red-400' : 
                            task.priority === 'Medium' ? 'bg-amber-950/20 border-amber-900/40 text-amber-400' : 
                            'bg-zinc-900 border-zinc-800 text-zinc-500'
                          }`}>{task.priority}</span>
                          <span className="text-[10px] text-zinc-600 font-mono">{task.updated}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ) : (
            /* INDEX ROW TABLE VIEW */
            <div className="border border-zinc-900 rounded-xl bg-[#0c0c0e]/30 overflow-hidden shadow-sm">
              <div className="flex items-center gap-4 px-5 py-3 bg-[#0c0c0e] border-b border-zinc-900 text-[10px] font-bold tracking-widest text-zinc-500 uppercase font-mono">
                <div className="w-16">NODE_ID</div>
                <div className="flex-1">REGISTRY_SUMMARY</div>
                <div className="w-28">STAGE_CONTEXT</div>
                <div className="w-24 text-right">MUTATION</div>
              </div>
              
              {filteredTasks.map((task) => (
                <div 
                  key={task.id} 
                  className="flex items-center gap-4 px-5 py-3.5 border-b border-zinc-900/60 hover:bg-[#0c0c0e]/80 text-xs transition-all duration-150 group cursor-pointer relative"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-transparent group-hover:bg-indigo-500 transition-all" />
                  <div className="text-zinc-600 w-16 font-mono font-bold group-hover:text-indigo-400 transition-colors text-[11px]">{task.id}</div>
                  <div className="flex-1 font-medium text-zinc-300 truncate group-hover:text-zinc-100 transition-colors pr-4">{task.title}</div>
                  <div className="w-28">
                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 bg-zinc-950 border border-zinc-800 rounded-md text-zinc-400 uppercase tracking-wider">{task.status}</span>
                  </div>
                  
                  {/* INLINE ROW CONTEXT ACTION SHUTTLE */}
                  <div className="w-24 text-right">
                    {task.status !== 'Done' ? (
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleUpdateStatus(task.id, task.status === 'Backlog' ? 'In Progress' : 'Done'); }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1 text-[10px] font-mono text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 px-2 py-1 rounded"
                      >
                        <span>ADVANCE</span>
                        <ArrowRight size={10} />
                      </button>
                    ) : (
                      <div className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400">
                        <CheckCircle size={10} />
                        <span>DONE</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <CommandPalette 
        isOpen={isPaletteOpen} 
        onClose={() => setIsPaletteOpen(false)} 
        setView={setView} 
      />

      <CreateTaskModal 
        isOpen={isCreateOpen} 
        onClose={() => setIsCreateOpen(false)} 
        onSave={handleAddTask} 
      />

    </div>
  );
}