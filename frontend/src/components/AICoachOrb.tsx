import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Sparkles, X, ArrowRight } from 'lucide-react';
import { mockRevisionQueue, mockMistakeRadar } from '../mockData';

interface AICoachOrbProps {
  onAction?: () => void;
}

export const AICoachOrb: React.FC<AICoachOrbProps> = ({ onAction }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [insightIndex, setInsightIndex] = useState(0);

  // Dynamic insight triggers computed from real app data
  const insights = [
    {
      title: 'Pattern Weakness Trigger',
      badge: 'High Priority',
      badgeColor: 'rose',
      text: `"I noticed you failed ${mockMistakeRadar[0].count} questions on ${mockMistakeRadar[0].subject}. Reason: submitting before validating empty bounds."`,
      actionText: 'Start 4-Min Edge Case Drill',
    },
    {
      title: 'Spaced Repetition Overdue',
      badge: 'Memory Decay Risk',
      badgeColor: 'amber',
      text: `"You have ${mockRevisionQueue.filter(r => r.dueDate.includes('ago')).length} critical items overdue in your Revision Queue (e.g. ${mockRevisionQueue[1].problemTitle})."`,
      actionText: 'Clear Overdue Items',
    },
    {
      title: 'Company Milestone Within Reach',
      badge: 'Amazon 67%',
      badgeColor: 'emerald',
      text: `"Clearing 4 Medium/Hard Graph BFS problems will push your Amazon readiness index from 67% → 74%."`,
      actionText: 'View Amazon Gap Checklist',
    }
  ];

  const currentInsight = insights[insightIndex];

  return (
    <div className="fixed bottom-6 right-6 z-50 select-none">
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div
            key="panel"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="w-80 sm:w-96 glass-panel border border-accent-cyan/30 shadow-glow-cyan bg-surface-3/95 p-5 rounded-2xl relative overflow-hidden"
            role="region"
            aria-live="polite"
            aria-label="AI Coach Insight"
          >
            {/* Background cyan gradient glow */}
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-accent-cyan/15 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-accent-cyan/15 border border-accent-cyan/40 flex items-center justify-center text-accent-cyan shadow-glow-cyan">
                  <Bot className="w-4 h-4" />
                </div>
                <span className="font-display font-bold text-xs text-accent-cyan tracking-wider uppercase flex items-center gap-1.5">
                  AI Coach Signals
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-ping" />
                </span>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-text-tertiary hover:text-white hover:bg-white/10 transition-colors focus-ring cursor-pointer"
                aria-label="Close AI Coach Panel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="bg-surface-0/70 border border-accent-cyan/20 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-text-primary font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-accent-cyan" />
                    <span>{currentInsight.title}</span>
                  </div>
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    currentInsight.badgeColor === 'rose' ? 'bg-accent-rose/20 text-accent-rose' : currentInsight.badgeColor === 'amber' ? 'bg-accent-amber/20 text-accent-amber' : 'bg-accent-emerald/20 text-accent-emerald'
                  }`}>
                    {currentInsight.badge}
                  </span>
                </div>

                <p className="text-xs text-text-secondary leading-relaxed font-sans">
                  {currentInsight.text}
                </p>
              </div>

              <div className="flex items-center justify-between gap-2 pt-1">
                <button
                  onClick={() => setInsightIndex((prev) => (prev + 1) % insights.length)}
                  className="text-[10px] font-mono text-accent-cyan hover:underline cursor-pointer"
                >
                  Next signal ({insightIndex + 1}/{insights.length}) →
                </button>
                
                <button
                  onClick={() => {
                    setIsOpen(false);
                    if (onAction) onAction();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-accent-cyan text-surface-0 font-bold text-xs shadow-glow-cyan hover:bg-cyan-300 transition-all flex items-center gap-1 focus-ring cursor-pointer"
                >
                  <span>{currentInsight.actionText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="orb"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="relative w-14 h-14 rounded-full bg-surface-3 border border-accent-cyan/50 shadow-glow-cyan flex items-center justify-center text-accent-cyan focus-ring cursor-pointer group"
            aria-label="Open AI Coach Insight"
          >
            {/* Breathing pulse animation */}
            <div className="absolute inset-0 rounded-full bg-accent-cyan/20 animate-orb-pulse pointer-events-none" />

            <Bot className="w-6 h-6 text-accent-cyan relative z-10 transition-transform group-hover:rotate-12" />

            {/* Live alert notification badge */}
            <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-accent-cyan border-2 border-surface-0 rounded-full shadow-glow-cyan" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
