import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockFutureFeatures } from '../mockData';
import { Rocket, ThumbsUp, CalendarClock, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

export const FuturePlans: React.FC = () => {
  const [votes, setVotes] = useState<Record<string, number>>({
    'weak-topic': 42,
    'mock-interview': 128,
    'resume-intel': 89,
    'browser-extension': 156,
    'time-travel': 73,
    'accountability-pods': 31
  });
  const [voted, setVoted] = useState<Record<string, boolean>>({});
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleVote = (id: string) => {
    if (voted[id]) return;
    setVotes(prev => ({ ...prev, [id]: prev[id] + 1 }));
    setVoted(prev => ({ ...prev, [id]: true }));
  };

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6">
      {/* Section 6.7 Horizontal Timeline Header */}
      <Card className="aurora-bg border-border-strong relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-subtle pb-5 mb-5">
          <div className="space-y-1">
            <Badge variant="indigo">
              <Rocket className="w-3.5 h-3.5 text-accent-violet" />
              <span>Engineering OS Build Sequence</span>
            </Badge>
            <h2 className="font-display text-2xl font-extrabold text-white tracking-tight">
              Future Plan & Architecture Roadmap
            </h2>
            <p className="text-text-secondary text-xs max-w-xl">
              Post-Week 8 feature roadmap. Click vote to prioritize development queue.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-surface-0/60 border border-border-subtle p-3 rounded-xl font-mono text-xs text-text-tertiary">
            <span>MVP Scope: <strong className="text-accent-emerald font-bold">Week 1–8 Locked</strong></span>
          </div>
        </div>

        {/* Section 6.7 Horizontal Timeline Bar Representation */}
        <div className="space-y-3">
          <span className="text-[10px] font-display font-bold uppercase tracking-widest text-text-tertiary block">
            Build Phases & Milestone Track
          </span>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
            <div className="bg-surface-0/60 border border-accent-emerald/30 rounded-xl p-3 space-y-1">
              <div className="flex justify-between items-center text-accent-emerald font-bold">
                <span>Phase 1: Core MVP</span>
                <span>Week 1–8</span>
              </div>
              <p className="text-[11px] font-sans text-text-secondary">Problem Capture, AI Critique, Topic Graph, Spaced Revision, Mistake DNA Radar</p>
            </div>

            <div className="bg-surface-0/60 border border-accent-violet/30 rounded-xl p-3 space-y-1">
              <div className="flex justify-between items-center text-accent-violet font-bold">
                <span>Phase 2: Deep Memory</span>
                <span>Week 9–12</span>
              </div>
              <p className="text-[11px] font-sans text-text-secondary">Weak-Topic Resources, Resume Intelligence, Mock Interview Agent</p>
            </div>

            <div className="bg-surface-0/60 border border-border-subtle rounded-xl p-3 space-y-1">
              <div className="flex justify-between items-center text-text-tertiary font-bold">
                <span>Phase 3: Scale & Pods</span>
                <span>Post Launch</span>
              </div>
              <p className="text-[11px] font-sans text-text-secondary">Accountability Pods, Browser Extension, Time-Travel Replay</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Grid of future features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {mockFutureFeatures.map((feature, idx) => {
          const isExpanded = expandedId === feature.id;
          return (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
            >
              <Card hoverEffect className="h-full flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <Badge variant="purple">{feature.phase}</Badge>
                    <span className="text-[10px] font-mono font-bold text-text-tertiary uppercase tracking-wider">
                      {feature.tier}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-display font-bold text-white text-sm tracking-wide">{feature.title}</h4>
                    <p className="text-text-secondary text-xs mt-1 leading-relaxed font-sans">
                      {feature.description}
                    </p>
                  </div>

                  {/* Section 6.7 Opt-in hover / expand disclosure for "Why Deferred" */}
                  <div className="pt-1">
                    <button
                      onClick={() => toggleExpand(feature.id)}
                      className="text-[11px] font-mono text-accent-violet hover:underline flex items-center gap-1 cursor-pointer focus-ring"
                    >
                      <span>{isExpanded ? 'Hide Deferred Rationale' : 'Why Deferred?'}</span>
                      {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-2 bg-surface-0/60 border border-border-subtle rounded-xl p-3 text-[11px] text-text-secondary leading-relaxed font-sans"
                        >
                          <span className="text-accent-rose font-bold block uppercase text-[9px] mb-0.5 font-display">Engineering Rationale</span>
                          {feature.whyDeferred}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Voting row with restrained count-up pop */}
                <div className="pt-4 border-t border-border-subtle mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-text-tertiary text-xs font-mono">
                    <CalendarClock className="w-3.5 h-3.5" />
                    <span>Queued</span>
                  </div>
                  
                  {/* Section 6.7 Restrained +1 count-up vote button */}
                  <motion.div whileTap={{ scale: 0.92 }}>
                    <Button
                      variant={voted[feature.id] ? 'secondary' : 'outline'}
                      size="sm"
                      leftIcon={voted[feature.id] ? <Check className="w-3.5 h-3.5 text-accent-emerald" /> : <ThumbsUp className="w-3.5 h-3.5" />}
                      onClick={() => handleVote(feature.id)}
                      disabled={voted[feature.id]}
                      className="font-mono"
                    >
                      <span>{votes[feature.id]} Votes</span>
                    </Button>
                  </motion.div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
