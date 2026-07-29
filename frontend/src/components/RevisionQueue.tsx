import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockRevisionQueue } from '../mockData';
import type { RevisionItem } from '../mockData';
import { Clock, CheckSquare, X } from 'lucide-react';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

export const RevisionQueue: React.FC = () => {
  const [queue, setQueue] = useState<RevisionItem[]>(mockRevisionQueue);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<'SM-2' | 'FSRS'>('SM-2');
  const [solvingItem, setSolvingItem] = useState<RevisionItem | null>(null);
  const [userRating, setUserRating] = useState<number | null>(null);

  const handleResolve = (id: string) => {
    setQueue(prev => prev.filter(item => item.id !== id));
    setSolvingItem(null);
    setUserRating(null);
  };

  // Section 6.4 Kanban Column Classification
  const overdueItems = queue.filter(i => i.dueDate.includes('ago') || i.daysOverdue > 0);
  const todayItems = queue.filter(i => i.dueDate === 'Today' && i.daysOverdue <= 0);
  const tomorrowItems = queue.filter(i => i.dueDate === 'Tomorrow');
  const weekItems = queue.filter(i => i.dueDate !== 'Today' && i.dueDate !== 'Tomorrow' && !i.dueDate.includes('ago'));

  const kanbanColumns = [
    { title: 'Overdue / Critical', items: overdueItems, badge: 'rose' as const, isEscalated: true },
    { title: 'Due Today', items: todayItems, badge: 'amber' as const, isEscalated: false },
    { title: 'Tomorrow', items: tomorrowItems, badge: 'indigo' as const, isEscalated: false },
    { title: 'This Week', items: weekItems, badge: 'slate' as const, isEscalated: false },
  ];

  return (
    <div className="space-y-6">
      {/* Top Controls Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-surface-1 border border-border-default rounded-2xl p-4 shadow-glass-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-accent-violet/10 border border-violet-500/20 text-accent-violet">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display font-extrabold text-white text-base">Spaced Repetition Kanban Worksurface</h3>
            <p className="text-xs text-text-tertiary">Urgency-escalated columns based on memory decay risk</p>
          </div>
        </div>

        {/* Algorithm Selection Switcher */}
        <div className="flex bg-surface-0 p-1 rounded-xl border border-border-subtle">
          <button
            onClick={() => setSelectedAlgorithm('SM-2')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              selectedAlgorithm === 'SM-2' 
                ? 'bg-accent-violet text-white shadow-md' 
                : 'text-text-tertiary hover:text-text-primary'
            }`}
          >
            SM-2 Baseline
          </button>
          <button
            onClick={() => setSelectedAlgorithm('FSRS')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              selectedAlgorithm === 'FSRS' 
                ? 'bg-accent-violet text-white shadow-md' 
                : 'text-text-tertiary hover:text-text-primary'
            }`}
          >
            <span>FSRS Engine</span>
            <span className="bg-accent-emerald/20 text-accent-emerald text-[9px] px-1.5 py-0.5 rounded font-extrabold">
              20% Fewer Reviews
            </span>
          </button>
        </div>
      </div>

      {/* Section 6.4 Kanban Board Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {kanbanColumns.map((column) => (
          <div key={column.title} className="bg-surface-1/60 border border-border-subtle rounded-2xl p-4 flex flex-col justify-between min-h-[480px]">
            <div>
              <div className="flex items-center justify-between border-b border-border-subtle pb-3 mb-4">
                <span className="font-display font-bold text-xs text-text-primary uppercase tracking-wider">
                  {column.title}
                </span>
                <Badge variant={column.badge} size="sm">
                  {column.items.length}
                </Badge>
              </div>

              {/* Column Items */}
              <div className="space-y-3">
                <AnimatePresence>
                  {column.items.length > 0 ? (
                    column.items.map(item => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className={`p-4 rounded-xl bg-surface-2/90 border transition-all space-y-2.5 ${
                          column.isEscalated 
                            ? 'border-accent-rose/40 shadow-glow-rose bg-accent-rose/5' 
                            : 'border-border-subtle hover:border-border-strong'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <h4 className="text-xs font-bold text-text-primary leading-snug">{item.problemTitle}</h4>
                          <Badge variant={item.difficulty === 'Easy' ? 'emerald' : item.difficulty === 'Medium' ? 'amber' : 'rose'} size="sm">
                            {item.difficulty}
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-text-tertiary">
                          <span className="font-mono">Due: {item.dueDate}</span>
                          <span className={`font-mono font-semibold ${column.isEscalated ? 'text-accent-rose' : 'text-text-tertiary'}`}>
                            {item.severity} Severity
                          </span>
                        </div>

                        <Button
                          variant={column.isEscalated ? 'danger' : 'secondary'}
                          size="sm"
                          className="w-full mt-1 text-[11px]"
                          onClick={() => setSolvingItem(item)}
                        >
                          Solve Attempt
                        </Button>
                      </motion.div>
                    ))
                  ) : (
                    <div className="py-12 text-center text-xs text-text-tertiary space-y-2">
                      <CheckSquare className="w-6 h-6 text-text-tertiary mx-auto opacity-40" />
                      <span>No items in this column</span>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="pt-3 border-t border-border-subtle text-[10px] text-text-tertiary text-center font-mono">
              {column.isEscalated ? 'High Forgetting Risk' : 'Scheduled Cycle'}
            </div>
          </div>
        ))}
      </div>

      {/* Solving Attempt Modal */}
      <AnimatePresence>
        {solvingItem && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-surface-0/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface-3 border border-border-strong rounded-2xl max-w-md w-full p-6 space-y-5 shadow-glass-md"
            >
              <div className="flex justify-between items-start">
                <div>
                  <Badge variant="indigo">Solving Challenge</Badge>
                  <h4 className="font-display font-extrabold text-white text-lg mt-1">{solvingItem.problemTitle}</h4>
                  <p className="text-text-tertiary text-xs mt-1">Submit your code attempt and assign your recall confidence score:</p>
                </div>
                <button onClick={() => setSolvingItem(null)} className="text-text-tertiary hover:text-white p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[
                  { rating: 1, label: 'Again', desc: 'Forgot' },
                  { rating: 2, label: 'Hard', desc: 'High effort' },
                  { rating: 3, label: 'Good', desc: 'Standard' },
                  { rating: 4, label: 'Easy', desc: 'No effort' }
                ].map(opt => (
                  <button
                    key={opt.rating}
                    onClick={() => setUserRating(opt.rating)}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-between text-center transition-all focus-ring cursor-pointer ${
                      userRating === opt.rating
                        ? 'bg-accent-violet/20 border-accent-violet text-white shadow-sm'
                        : 'bg-surface-0 border-border-default text-text-tertiary hover:border-border-strong'
                    }`}
                  >
                    <span className="text-xs font-bold font-display">{opt.label}</span>
                    <span className="text-[9px] text-text-tertiary mt-1 font-mono">{opt.desc}</span>
                  </button>
                ))}
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setSolvingItem(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  className="flex-1"
                  disabled={userRating === null}
                  onClick={() => handleResolve(solvingItem.id)}
                >
                  Confirm Solve
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
