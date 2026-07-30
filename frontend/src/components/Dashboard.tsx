import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { mockRevisionQueue, mockCompanyReadiness } from '../mockData';
import { 
  ArrowRight, 
  Flame, 
  Clock, 
  Sparkles, 
  ChevronRight, 
  GitBranch, 
  Zap, 
  Bot,
  Cpu,
  Award,
  Target,
  Activity,
  Calendar
} from 'lucide-react';
import { useCountUp } from '../hooks/useCountUp';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

interface DashboardProps {
  onTabChange: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onTabChange }) => {
  // Animated numeric count-ups
  const readinessGain = useCountUp(28, 900); // 2.8%
  const xpCount = useCountUp(3450, 800);
  const dsaMastery = useCountUp(82, 800);
  const backendSkill = useCountUp(55, 800);
  const reactSkill = useCountUp(71, 800);
  const githubActivity = useCountUp(90, 800);
  const interviewReady = useCountUp(48, 800);
  const consistencyScore = useCountUp(81, 800);

  // GitHub contribution calendar mock
  const weeks = 26;
  const daysPerWeek = 7;
  const contributionGrid = useMemo(() => {
    return Array.from({ length: weeks * daysPerWeek }, () => {
      const rand = Math.random();
      if (rand < 0.35) return 0;
      if (rand < 0.65) return 1;
      if (rand < 0.85) return 2;
      if (rand < 0.95) return 3;
      return 4;
    });
  }, [weeks, daysPerWeek]);

  const getContributionColor = (level: number) => {
    switch (level) {
      case 0: return 'bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5';
      case 1: return 'bg-emerald-200 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800/40';
      case 2: return 'bg-emerald-400 dark:bg-emerald-700/80 border border-emerald-500 dark:border-emerald-600/50';
      case 3: return 'bg-emerald-500 border border-emerald-600 dark:border-emerald-400/60 shadow-sm';
      case 4: return 'bg-emerald-600 dark:bg-emerald-300 border border-emerald-700 dark:border-emerald-200';
      default: return 'bg-black/5 dark:bg-white/5';
    }
  };

  const dueToday = mockRevisionQueue.filter(item => item.dueDate === 'Today');

  return (
    <div className="space-y-6">
      {/* 6.1 Section 1: Tier 1 Daily Mission Hero (Aurora + Spotlight Surface) */}
      <div className="aurora-bg spotlight-surface border border-border-strong rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-glass-md select-none">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="indigo">
              <Sparkles className="w-3 h-3 text-accent-violet" />
              <span>Daily Mission Briefing</span>
            </Badge>
            <span className="text-text-tertiary text-xs font-mono">July 29, 2026</span>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-text-primary tracking-tight leading-tight">
            Good evening, Yash. Today: <span className="text-accent-violet font-mono font-black">3 revision missions</span> · <span className="text-accent-amber font-mono font-black">2 weak patterns</span> · <span className="text-accent-emerald font-mono font-black">1 company milestone</span>
          </h2>

          <p className="text-text-secondary text-xs sm:text-sm font-sans leading-relaxed">
            Estimated readiness gain today: <strong className="text-accent-emerald font-mono font-bold">+{ (readinessGain / 10).toFixed(1) }%</strong>. Clearing your 3 graph revisions will unblock your Amazon 70% threshold.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button
              variant="primary"
              size="lg"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={() => onTabChange('revision')}
            >
              Start Mission
            </Button>

            <Button
              variant="secondary"
              size="lg"
              leftIcon={<Sparkles className="w-4 h-4 text-accent-violet" />}
              onClick={() => onTabChange('capture')}
            >
              Capture New Attempt
            </Button>
          </div>
        </div>
      </div>

      {/* 6.1 Section 2: XP Level & Weekly Narrative Callout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Animated XP Card */}
        <Card className="lg:col-span-2 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-text-tertiary font-display">Engineering XP Progress</span>
              <div className="text-3xl font-display font-black text-text-primary mt-1 tracking-tight flex items-baseline gap-2">
                <span>Level 15</span>
                <span className="text-xs font-mono text-text-tertiary font-medium">Backend Specialist</span>
              </div>
            </div>

            <Badge variant="amber" className="px-3 py-1.5 font-mono">
              <Flame className="w-3.5 h-3.5 text-accent-amber fill-accent-amber" />
              <span>14 Days Streak</span>
            </Badge>
          </div>

          {/* XP Animated Fill */}
          <div className="space-y-1.5 my-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-text-secondary">Progress to Level 16</span>
              <span className="text-accent-violet font-bold">{xpCount.toLocaleString()} / 4,000 XP</span>
            </div>
            
            <div className="w-full h-3 bg-surface-0 rounded-full overflow-hidden p-0.5 border border-border-subtle shadow-inner">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '86%' }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="h-full bg-gradient-to-r from-accent-violet to-accent-cyan rounded-full shadow-glow-violet" 
              />
            </div>
          </div>

          <div className="text-xs bg-surface-0/60 border border-border-subtle rounded-xl p-3 text-text-secondary flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-accent-amber" />
              <span>Boss Battle Gate locked (Requires +550 XP)</span>
            </div>
            <span className="text-[10px] font-mono text-text-tertiary">Next review in 4h</span>
          </div>
        </Card>

        {/* 6.1 Section 8: Weekly Insight Narrative */}
        <Card className="border-accent-cyan/20 bg-surface-3/40 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-accent-cyan/15 border border-accent-cyan/30 flex items-center justify-center text-accent-cyan shadow-glow-cyan">
                <Bot className="w-4 h-4" />
              </div>
              <span className="text-xs font-display font-bold text-accent-cyan tracking-wider uppercase">
                AI System Insight
              </span>
            </div>

            <h4 className="text-xs font-semibold text-text-primary leading-relaxed font-sans">
              "You've mastered <span className="text-accent-emerald font-bold">Arrays & Hashing</span>. Your primary current bottleneck is <span className="text-accent-rose font-bold">Graph BFS</span>. Est. <strong className="text-accent-cyan">+8% company readiness</strong> once cleared."
            </h4>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full mt-4 text-accent-cyan border-accent-cyan/30 hover:bg-accent-cyan/10"
            onClick={() => onTabChange('graph')}
          >
            Inspect Topic Bottlenecks
          </Button>
        </Card>
      </div>

      {/* 6.1 Section 7: Full 6-Stat Breakdown Grid (Dedicated State of the Union) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-display font-bold uppercase tracking-widest text-text-tertiary">State of the Union Metrics</h3>
          <span className="text-[11px] font-mono text-text-tertiary">Live synced</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
          <Card hoverEffect className="p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">DSA Mastery</span>
              <Cpu className="w-4 h-4 text-accent-violet" />
            </div>
            <div>
              <div className="text-2xl font-mono font-bold text-text-primary">{dsaMastery}%</div>
              <div className="text-[10px] text-text-tertiary mt-0.5">7 topics tracked</div>
            </div>
          </Card>

          <Card hoverEffect className="p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">Backend Skill</span>
              <Award className="w-4 h-4 text-accent-emerald" />
            </div>
            <div>
              <div className="text-2xl font-mono font-bold text-text-primary">{backendSkill}%</div>
              <div className="text-[10px] text-text-tertiary mt-0.5">Express, SQL, Redis</div>
            </div>
          </Card>

          <Card hoverEffect className="p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">React Skill</span>
              <Target className="w-4 h-4 text-accent-cyan" />
            </div>
            <div>
              <div className="text-2xl font-mono font-bold text-text-primary">{reactSkill}%</div>
              <div className="text-[10px] text-text-tertiary mt-0.5">Vite, state, hooks</div>
            </div>
          </Card>

          <Card hoverEffect className="p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">GitHub Activity</span>
              <GitBranch className="w-4 h-4 text-accent-violet" />
            </div>
            <div>
              <div className="text-2xl font-mono font-bold text-text-primary">{githubActivity}%</div>
              <div className="text-[10px] text-text-tertiary mt-0.5">32 commits / mo</div>
            </div>
          </Card>

          <Card hoverEffect className="p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">Interview Ready</span>
              <Activity className="w-4 h-4 text-accent-amber" />
            </div>
            <div>
              <div className="text-2xl font-mono font-bold text-text-primary">{interviewReady}%</div>
              <div className="text-[10px] text-text-tertiary mt-0.5">Target index</div>
            </div>
          </Card>

          <Card hoverEffect className="p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">Consistency</span>
              <Calendar className="w-4 h-4 text-accent-violet" />
            </div>
            <div>
              <div className="text-2xl font-mono font-bold text-text-primary">{consistencyScore}%</div>
              <div className="text-[10px] text-text-tertiary mt-0.5">14-day streak</div>
            </div>
          </Card>
        </div>
      </div>

      {/* GitHub Contribution Heatmap + Revision Queue Preview */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* GitHub Heatmap */}
        <Card className="xl:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-surface-2 border border-border-default text-text-secondary">
                <GitBranch className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-text-primary text-sm">GitHub Contribution Velocity</h3>
                <span className="text-[11px] text-text-tertiary">Cross-checked against code submissions</span>
              </div>
            </div>
            
            <Badge variant="emerald" dot>Live Synced</Badge>
          </div>

          {/* Staggered Heatmap Grid */}
          <div className="overflow-x-auto pb-3">
            <div className="grid grid-flow-col grid-rows-7 gap-1.5 min-w-[550px]">
              {contributionGrid.map((level, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: (idx % 20) * 0.008 }}
                  className={`w-3 h-3 rounded-[3px] transition-all duration-150 hover:scale-125 hover:z-10 ${getContributionColor(level)}`}
                  title={`${level * 2} commits`}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-text-tertiary border-t border-border-subtle pt-3 mt-2">
            <span className="text-[11px] font-mono">32 commits logged in past 30 days</span>
            <div className="flex items-center gap-1.5 text-[10px]">
              <span>Less</span>
              <div className="w-2.5 h-2.5 rounded-[2px] bg-white/5 border border-white/5" />
              <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-950" />
              <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-700" />
              <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-500" />
              <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-300" />
              <span>More</span>
            </div>
          </div>
        </Card>

        {/* Revision Queue Preview */}
        <Card className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-text-primary text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-accent-violet" />
                <span>Revision Queue Preview</span>
              </h3>
              <Badge variant="indigo">{dueToday.length} Due Today</Badge>
            </div>

            <div className="space-y-3">
              {dueToday.slice(0, 2).map((item) => (
                <div 
                  key={item.id} 
                  className="bg-surface-0/60 border border-border-subtle hover:border-border-strong rounded-xl p-3.5 space-y-1.5 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-text-primary">{item.problemTitle}</h4>
                    <Badge variant={item.difficulty === 'Easy' ? 'emerald' : item.difficulty === 'Medium' ? 'amber' : 'rose'} size="sm">
                      {item.difficulty}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-text-tertiary">
                    <span>Due: <strong className="text-accent-amber font-mono">{item.dueDate}</strong></span>
                    <span className="font-mono text-accent-rose">{item.severity} Severity</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button 
            variant="secondary"
            size="sm"
            rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
            onClick={() => onTabChange('revision')}
            className="w-full mt-4"
          >
            Open Full Revision Queue ({mockRevisionQueue.length})
          </Button>
        </Card>
      </div>

      {/* Target Companies Readiness Overview */}
      <Card>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-bold text-text-primary text-base">Target Enterprise Readiness Index</h3>
            <p className="text-xs text-text-tertiary mt-0.5">Modeled against hiring benchmarks</p>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm"
            rightIcon={<ChevronRight className="w-4 h-4" />}
            onClick={() => onTabChange('readiness')}
          >
            Full Company Breakdown
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {mockCompanyReadiness.map((company) => (
            <motion.div 
              key={company.name} 
              whileHover={{ y: -2 }}
              className="bg-surface-0/50 border border-border-subtle hover:border-border-strong rounded-xl p-4 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-text-primary font-extrabold text-sm tracking-wide">{company.name}</span>
                <span className="text-xs font-mono font-black px-2.5 py-1 rounded-full bg-surface-0 border border-white/10" style={{ color: company.color }}>
                  {company.matchPercentage}% Index
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-surface-0 rounded-full overflow-hidden border border-border-subtle">
                <div 
                  className="h-full rounded-full transition-all duration-500 shadow-sm" 
                  style={{ width: `${company.matchPercentage}%`, backgroundColor: company.color }}
                />
              </div>

              <div className="text-[11px] text-text-tertiary mt-3 flex justify-between items-center">
                <span>Focus: {company.name === 'Amazon' ? 'Graphs & BFS' : company.name === 'Microsoft' ? 'Trees & BST' : 'DP & Sliding Window'}</span>
                <button 
                  onClick={() => onTabChange('readiness')} 
                  className="text-accent-violet hover:text-indigo-300 font-semibold hover:underline"
                >
                  Details
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
};
