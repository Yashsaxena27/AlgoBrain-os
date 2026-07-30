import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockCompanyReadiness } from '../mockData';
import type { CompanyReadiness } from '../mockData';
import { Target, ArrowRight, Trophy, Sparkles } from 'lucide-react';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

export const ReadinessEngine: React.FC = () => {
  const [selectedCompany, setSelectedCompany] = useState<CompanyReadiness>(mockCompanyReadiness[0]);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Section 6.6 Narrative framing helper
  const getNarrativeStatus = (key: string, val: number, companyName: string) => {
    if (key === 'dsa') {
      return val >= 80 ? `Coding — Strong. Above ${companyName}'s benchmark.` : `Coding — Gap detected. Below ${companyName}'s bar.`;
    }
    if (key === 'systemDesign') {
      return val >= 60 ? `Architecture — Moderate. On track for Mid-level.` : `Architecture — Early level. Needs load balancing drills.`;
    }
    if (key === 'behavioral') {
      return val >= 60 ? `Leadership — Solid alignment.` : `Leadership — Needs STAR story practice.`;
    }
    return `Projects — Validated via GitHub commits.`;
  };

  // Section 6.6 Outcome impact inline helper
  const getActionOutcome = (idx: number) => {
    switch (idx) {
      case 0: return 'DSA Mastery 82% → 88% (+4% Readiness Gain)';
      case 1: return 'Behavioral Alignment +5% Match';
      case 2: return 'System Design Score 55% → 65% (+3% Gain)';
      default: return '+2% Readiness Gain';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Company Selector Cards (4 cols) */}
      <div className="lg:col-span-4 space-y-4">
        <Card>
          <div className="flex items-center gap-2.5 mb-2 border-b border-border-subtle pb-3">
            <div className="p-2 rounded-xl bg-accent-violet/10 border border-violet-500/20 text-accent-violet">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-white text-base">Hiring Simulation Profiles</h3>
              <p className="text-xs text-text-tertiary">Select target to run match assessment</p>
            </div>
          </div>

          <div className="space-y-3 mt-4">
            {mockCompanyReadiness.map((company) => {
              const isSelected = selectedCompany.name === company.name;
              return (
                <button
                  key={company.name}
                  onClick={() => setSelectedCompany(company)}
                  className={`w-full text-left p-4 rounded-xl border transition-all focus-ring cursor-pointer flex items-center justify-between ${
                    isSelected 
                      ? 'bg-accent-violet/20 border-accent-violet shadow-lg shadow-accent-violet/15' 
                      : 'bg-surface-0 border-border-default hover:border-border-strong'
                  }`}
                >
                  <div className="space-y-1">
                    <span className="text-sm font-display font-extrabold text-white block">{company.name}</span>
                    <span className="text-[11px] text-text-tertiary block font-mono">Simulated hiring bar</span>
                  </div>

                  <div className="text-right">
                    <div className="text-base font-mono font-black" style={{ color: company.color }}>
                      {company.matchPercentage}%
                    </div>
                    <span className="text-[9px] text-text-tertiary uppercase font-bold tracking-wider">Match index</span>
                  </div>
                </button>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Target Details View (8 cols) */}
      <Card className="lg:col-span-8 flex flex-col justify-between min-h-[460px]">
        <AnimatePresence mode="wait">
          {selectedCompany ? (
            <motion.div 
              key={selectedCompany.name}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6 h-full flex flex-col justify-between"
            >
              <div>
                {/* Heading */}
                <div className="flex justify-between items-center mb-6 border-b border-border-subtle pb-4">
                  <div>
                    <h3 className="text-xl font-display font-extrabold text-white">{selectedCompany.name} Hiring Bar Simulation</h3>
                    <p className="text-text-tertiary text-xs mt-0.5">
                      Requirements modeled against live 2026 enterprise benchmarks
                    </p>
                  </div>

                  <Badge variant="indigo" size="md" className="font-mono">
                    <Trophy className="w-3.5 h-3.5 text-accent-violet" />
                    <span>{selectedCompany.matchPercentage}% Overall Index</span>
                  </Badge>
                </div>

                {/* Section 6.6 Animated Competency Bars with Narrative Framing */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {Object.entries(selectedCompany.requirements).map(([key, val]) => (
                    <div key={key} className="bg-surface-0/60 border border-border-subtle rounded-xl p-3.5 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-text-primary font-bold font-display uppercase tracking-wider text-[10px]">{key}</span>
                        <span className="text-white font-bold font-mono">{val}%</span>
                      </div>
                      
                      <div className="w-full h-2 bg-surface-0 rounded-full overflow-hidden border border-border-subtle">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${val}%` }}
                          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                          className="h-full rounded-full shadow-sm" 
                          style={{ backgroundColor: selectedCompany.color }}
                        />
                      </div>

                      {/* Section 6.6 Narrative framing */}
                      <p className="text-[11px] text-text-secondary font-medium pt-0.5">
                        {getNarrativeStatus(key, val, selectedCompany.name)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Section 6.6 Gap Action Items with Connected Outcomes */}
                <div className="space-y-3">
                  <h4 className="text-xs font-display font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-accent-violet" />
                    <span>Gap Actions & Connected Outcomes</span>
                  </h4>

                  <div className="space-y-2.5">
                    {selectedCompany.nextSteps.map((step, idx) => (
                      <div 
                        key={idx} 
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-surface-0/40 border border-border-subtle hover:border-border-default rounded-xl p-3.5 transition-all"
                      >
                        <div className="flex gap-3 items-center">
                          <span className="bg-accent-violet/20 text-indigo-300 text-xs font-mono font-black h-5 w-5 rounded-full flex items-center justify-center shrink-0 border border-violet-500/20">
                            {idx + 1}
                          </span>
                          <span className="text-text-primary text-xs font-medium leading-relaxed">{step}</span>
                        </div>

                        {/* Section 6.6 Outcome impact tag */}
                        <span className="text-[10px] font-mono font-semibold text-accent-emerald bg-accent-emerald/10 border border-accent-emerald/20 px-2.5 py-1 rounded-lg shrink-0 text-right">
                          → {getActionOutcome(idx)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border-subtle flex justify-between items-center">
                <span className="text-[11px] text-text-tertiary font-mono">
                  Actions connect directly to match index gain.
                </span>

                <Button 
                  variant="primary"
                  size="md"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  onClick={() => {
                    setActionMessage(`Assessment loop started for ${selectedCompany.name}.`);
                    setTimeout(() => setActionMessage(null), 2500);
                  }}
                >
                  Run Hiring Simulation
                </Button>
              </div>
            </motion.div>
          ) : (
            <div className="m-auto text-center">
              <span className="text-text-tertiary">Select a company profile to view insights.</span>
            </div>
          )}
        </AnimatePresence>
      </Card>

      {actionMessage && (
        <div
          aria-live="polite"
          className="lg:col-span-12 bg-surface-1 border border-border-strong rounded-xl px-3 py-2 text-xs text-text-primary shadow-glass-sm"
        >
          {actionMessage}
        </div>
      )}
    </div>
  );
};
