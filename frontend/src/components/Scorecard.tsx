import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { useCountUp } from '../hooks/useCountUp';

export const Scorecard: React.FC = () => {
  const currentXp = useCountUp(3450, 800);
  const targetXp = 4000;
  const xpPercent = Math.min(Math.round((currentXp / targetXp) * 100), 100);

  return (
    <div className="w-full bg-surface-1 border border-border-default rounded-2xl px-5 py-3 flex flex-wrap items-center justify-between gap-3 text-xs backdrop-blur-xl shadow-glass-sm select-none">
      {/* Level & XP Progress Strip */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 px-3 py-1 rounded-xl font-bold text-xs">
          <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
          <span>Level 15</span>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-32 sm:w-44 h-2 bg-surface-2 rounded-full overflow-hidden border border-border-subtle p-0.5">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${xpPercent}%` }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="h-full bg-gradient-to-r from-accent-violet to-accent-cyan rounded-full shadow-glow-violet"
            />
          </div>
          <span className="font-mono text-[11px] text-text-secondary font-medium">
            <strong className="text-text-primary font-bold">{currentXp.toLocaleString()}</strong> / {targetXp.toLocaleString()} XP
          </span>
        </div>
      </div>

      {/* Mini Company Readiness Sparkline Indicators */}
      <div className="flex items-center gap-4 text-[11px] text-text-tertiary">
        <span className="font-display font-semibold text-text-secondary uppercase tracking-wider text-[10px] hidden md:inline">
          Readiness:
        </span>

        <div className="flex items-center gap-3.5">
          <span className="flex items-center gap-1.5 font-mono text-text-secondary">
            <span className="h-2 w-2 bg-[#ff9900] rounded-full shadow-sm" />
            Amazon <strong className="text-text-primary font-bold">67%</strong>
          </span>

          <span className="flex items-center gap-1.5 font-mono text-text-secondary">
            <span className="h-2 w-2 bg-[#0078d7] rounded-full shadow-sm" />
            Microsoft <strong className="text-text-primary font-bold">58%</strong>
          </span>

          <span className="flex items-center gap-1.5 font-mono text-text-secondary">
            <span className="h-2 w-2 bg-[#ea4335] rounded-full shadow-sm" />
            Google <strong className="text-text-primary font-bold">42%</strong>
          </span>
        </div>
      </div>
    </div>
  );
};
