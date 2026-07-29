import React, { useState } from 'react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { 
  Users, 
  Trophy, 
  TrendingUp, 
  Flame, 
  Swords, 
  Target, 
  Sparkles
} from 'lucide-react';
import { mockPeers, mockWeeklyVelocity, mockDifficultyDistribution } from '../mockData';
import type { PeerUser } from '../mockData';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

export const PeerAnalytics: React.FC = () => {
  const currentUser = mockPeers.find(p => p.name.includes('(You)')) || mockPeers[1];
  const [selectedOpponent, setSelectedOpponent] = useState<PeerUser>(mockPeers[0]); // Priya Sharma default

  return (
    <div className="space-y-6 select-none">
      {/* Header & Pod Overview Hero */}
      <Card className="aurora-bg border-border-strong relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="indigo">
                <Users className="w-3.5 h-3.5 text-accent-violet" />
                <span>Peer Network & Benchmark Analytics</span>
              </Badge>
              <span className="text-[10px] font-mono text-accent-emerald bg-accent-emerald/10 border border-accent-emerald/20 px-2 py-0.5 rounded font-bold">
                Accountability Pod #14
              </span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Cohort Benchmarking & Peer Leaderboard
            </h2>
            <p className="text-text-secondary text-xs sm:text-sm max-w-2xl leading-relaxed">
              Compare your problem-solving velocity, DSA mastery, and commit frequency against top-tier engineering candidates.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
            <div className="bg-surface-0/60 border border-border-subtle rounded-xl p-3 text-center">
              <span className="text-[10px] text-text-tertiary uppercase font-bold tracking-wider block">Pod Rank</span>
              <span className="text-xl font-bold text-accent-amber mt-0.5 block">#2 <span className="text-xs text-text-tertiary">/ 24</span></span>
            </div>

            <div className="bg-surface-0/60 border border-border-subtle rounded-xl p-3 text-center">
              <span className="text-[10px] text-text-tertiary uppercase font-bold tracking-wider block">Vs Peer Avg</span>
              <span className="text-xl font-bold text-accent-emerald mt-0.5 block">+32%</span>
            </div>

            <div className="bg-surface-0/60 border border-border-subtle rounded-xl p-3 text-center">
              <span className="text-[10px] text-text-tertiary uppercase font-bold tracking-wider block">H2H Win Rate</span>
              <span className="text-xl font-bold text-accent-cyan mt-0.5 block">78%</span>
            </div>

            <div className="bg-surface-0/60 border border-border-subtle rounded-xl p-3 text-center">
              <span className="text-[10px] text-text-tertiary uppercase font-bold tracking-wider block">Pod Score</span>
              <span className="text-xl font-bold text-accent-violet mt-0.5 block">94<span className="text-xs text-text-tertiary">/100</span></span>
            </div>
          </div>
        </div>
      </Card>

      {/* SECTION 1: VISUALLY ATTRACTIVE CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart A: Weekly Velocity vs Cohort Average (7 cols) */}
        <Card className="lg:col-span-7 flex flex-col justify-between min-h-[420px]">
          <div>
            <div className="flex justify-between items-start mb-4 border-b border-border-subtle pb-3">
              <div>
                <h3 className="font-display font-extrabold text-white text-base flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-accent-violet" />
                  <span>XP Growth Velocity vs Cohort Benchmarks</span>
                </h3>
                <p className="text-xs text-text-tertiary mt-0.5">Tracking your trajectory against peer average & top 10% candidates</p>
              </div>

              <Badge variant="emerald" dot>Live Sync</Badge>
            </div>

            {/* Recharts Area Chart */}
            <div className="w-full h-64 bg-surface-0/60 border border-border-subtle rounded-2xl p-2 my-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockWeeklyVelocity} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="userXpGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B7CF8" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#8B7CF8" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="top10Grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FBBF24" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#FBBF24" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="week" stroke="rgba(245,246,250,0.64)" fontSize={11} />
                  <YAxis stroke="rgba(245,246,250,0.64)" fontSize={11} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#131628', 
                      borderColor: 'rgba(255, 255, 255, 0.15)', 
                      borderRadius: '12px',
                      fontSize: '11px',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)'
                    }} 
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Area type="monotone" dataKey="userXP" name="You (Yash)" stroke="#8B7CF8" strokeWidth={3} fillOpacity={1} fill="url(#userXpGrad)" />
                  <Area type="monotone" dataKey="top10PercentXP" name="Top 10% Cohort Bar" stroke="#FBBF24" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#top10Grad)" />
                  <Area type="monotone" dataKey="peerAvgXP" name="Peer Average" stroke="#34D399" strokeWidth={2} fillOpacity={0} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="text-[11px] text-text-tertiary flex items-center justify-between border-t border-border-subtle pt-3 font-mono">
            <span>Current Velocity: <strong className="text-accent-violet">+1,050 XP / week</strong></span>
            <span className="text-accent-emerald font-semibold">Passing Top 10% threshold in ~2 weeks</span>
          </div>
        </Card>

        {/* Chart B: Problem Difficulty Breakdown vs Peer Average (5 cols) */}
        <Card className="lg:col-span-5 flex flex-col justify-between min-h-[420px]">
          <div>
            <div className="border-b border-border-subtle pb-3 mb-4">
              <h3 className="font-display font-extrabold text-white text-base flex items-center gap-2">
                <Target className="w-4 h-4 text-accent-cyan" />
                <span>Difficulty Volume Distribution</span>
              </h3>
              <p className="text-xs text-text-tertiary mt-0.5">Problems solved vs peer average by tier</p>
            </div>

            {/* Recharts Bar Chart */}
            <div className="w-full h-64 bg-surface-0/60 border border-border-subtle rounded-2xl p-2 my-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockDifficultyDistribution} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="name" stroke="rgba(245,246,250,0.64)" fontSize={11} />
                  <YAxis stroke="rgba(245,246,250,0.64)" fontSize={11} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#131628', 
                      borderColor: 'rgba(255, 255, 255, 0.15)', 
                      borderRadius: '12px',
                      fontSize: '11px'
                    }} 
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="userSolves" name="Your Solves" fill="#8B7CF8" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="peerAvgSolves" name="Peer Avg" fill="rgba(255,255,255,0.15)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="text-[11px] text-text-tertiary border-t border-border-subtle pt-3 font-mono flex justify-between">
            <span>Medium solves lead peer avg by <strong className="text-accent-amber font-bold">+20 problems</strong></span>
          </div>
        </Card>
      </div>

      {/* SECTION 2: HEAD-TO-HEAD PEER COMPARISON & LEADERBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Friends & Accountability Pod Leaderboard (5 cols) */}
        <Card className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between border-b border-border-subtle pb-3">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-accent-amber" />
              <h3 className="font-display font-extrabold text-white text-base">Pod Leaderboard</h3>
            </div>
            <span className="text-[10px] text-text-tertiary font-mono">Week 4 Rankings</span>
          </div>

          <div className="space-y-2.5">
            {mockPeers.map((peer) => {
              const isYou = peer.name.includes('(You)');
              const isSelected = selectedOpponent.id === peer.id;

              return (
                <div
                  key={peer.id}
                  onClick={() => !isYou && setSelectedOpponent(peer)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isYou 
                      ? 'bg-accent-violet/20 border-accent-violet shadow-lg shadow-accent-violet/10' 
                      : isSelected
                      ? 'bg-surface-2 border-border-strong ring-1 ring-accent-violet/50'
                      : 'bg-surface-0/60 border-border-subtle hover:border-border-default'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-6 text-center font-mono font-black text-xs ${
                      peer.rank === 1 ? 'text-accent-amber' : peer.rank === 2 ? 'text-accent-violet' : 'text-text-tertiary'
                    }`}>
                      #{peer.rank}
                    </span>

                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-display font-bold text-xs text-white shadow-sm">
                      {peer.avatarUrl}
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-text-primary flex items-center gap-1.5">
                        <span>{peer.name}</span>
                        {isYou && <span className="text-[9px] px-1.5 py-0.2 bg-accent-violet/30 text-indigo-300 rounded font-mono font-extrabold">YOU</span>}
                      </h4>
                      <span className="text-[10px] text-text-tertiary font-mono">Lvl {peer.level} · {peer.targetCompany} Target</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-text-primary block">{peer.xp.toLocaleString()} XP</span>
                      <span className="text-[9px] text-accent-amber font-mono flex items-center justify-end gap-0.5">
                        <Flame className="w-2.5 h-2.5 fill-accent-amber" />
                        {peer.streak}d
                      </span>
                    </div>

                    {!isYou && (
                      <Button
                        variant={isSelected ? 'primary' : 'secondary'}
                        size="sm"
                        className="text-[10px] px-2 py-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOpponent(peer);
                        }}
                      >
                        {isSelected ? 'Viewing' : 'Compare'}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Head-to-Head Metric Comparison Card (7 cols) */}
        <Card className="lg:col-span-7 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center border-b border-border-subtle pb-3 mb-5">
              <div className="flex items-center gap-2">
                <Swords className="w-4 h-4 text-accent-violet" />
                <h3 className="font-display font-extrabold text-white text-base">Head-to-Head Performance Matchup</h3>
              </div>
              <Badge variant="indigo" size="sm">H2H Mode</Badge>
            </div>

            {/* Matchup Header */}
            <div className="grid grid-cols-3 gap-2 bg-surface-0 border border-border-subtle rounded-2xl p-4 mb-6 items-center text-center">
              <div>
                <div className="w-10 h-10 rounded-full bg-accent-violet/20 border border-accent-violet mx-auto flex items-center justify-center font-display font-extrabold text-sm text-white shadow-glow-violet">
                  {currentUser.avatarUrl}
                </div>
                <h4 className="text-xs font-bold text-text-primary mt-1.5">{currentUser.name}</h4>
                <span className="text-[10px] font-mono text-accent-violet">Rank #{currentUser.rank}</span>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-display font-black text-text-tertiary uppercase tracking-widest block">VS</span>
                <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded font-mono text-accent-amber font-bold">
                  78% Win Match
                </span>
              </div>

              <div>
                <div className="w-10 h-10 rounded-full bg-purple-500/20 border border-purple-500 mx-auto flex items-center justify-center font-display font-extrabold text-sm text-white">
                  {selectedOpponent.avatarUrl}
                </div>
                <h4 className="text-xs font-bold text-text-primary mt-1.5">{selectedOpponent.name}</h4>
                <span className="text-[10px] font-mono text-accent-amber">Rank #{selectedOpponent.rank}</span>
              </div>
            </div>

            {/* Metric Comparisons List */}
            <div className="space-y-4">
              {/* Metric 1: DSA Mastery */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className={`font-bold ${currentUser.dsaMastery >= selectedOpponent.dsaMastery ? 'text-accent-emerald' : 'text-text-secondary'}`}>
                    {currentUser.dsaMastery}% {currentUser.dsaMastery > selectedOpponent.dsaMastery && '👑'}
                  </span>
                  <span className="text-text-tertiary font-sans font-bold uppercase tracking-wider text-[10px]">DSA Mastery Index</span>
                  <span className={`font-bold ${selectedOpponent.dsaMastery > currentUser.dsaMastery ? 'text-accent-emerald' : 'text-text-secondary'}`}>
                    {selectedOpponent.dsaMastery}% {selectedOpponent.dsaMastery > currentUser.dsaMastery && '👑'}
                  </span>
                </div>
                <div className="flex gap-1.5 h-2 bg-surface-0 rounded-full overflow-hidden border border-border-subtle">
                  <div className="h-full bg-accent-violet rounded-l-full" style={{ width: `${(currentUser.dsaMastery / (currentUser.dsaMastery + selectedOpponent.dsaMastery)) * 100}%` }} />
                  <div className="h-full bg-purple-500 rounded-r-full" style={{ width: `${(selectedOpponent.dsaMastery / (currentUser.dsaMastery + selectedOpponent.dsaMastery)) * 100}%` }} />
                </div>
              </div>

              {/* Metric 2: Edge Case Resilience */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className={`font-bold ${currentUser.edgeCaseScore >= selectedOpponent.edgeCaseScore ? 'text-accent-emerald' : 'text-text-secondary'}`}>
                    {currentUser.edgeCaseScore}% {currentUser.edgeCaseScore > selectedOpponent.edgeCaseScore && '👑'}
                  </span>
                  <span className="text-text-tertiary font-sans font-bold uppercase tracking-wider text-[10px]">Edge Case Resilience</span>
                  <span className={`font-bold ${selectedOpponent.edgeCaseScore > currentUser.edgeCaseScore ? 'text-accent-emerald' : 'text-text-secondary'}`}>
                    {selectedOpponent.edgeCaseScore}% {selectedOpponent.edgeCaseScore > currentUser.edgeCaseScore && '👑'}
                  </span>
                </div>
                <div className="flex gap-1.5 h-2 bg-surface-0 rounded-full overflow-hidden border border-border-subtle">
                  <div className="h-full bg-accent-violet rounded-l-full" style={{ width: `${(currentUser.edgeCaseScore / (currentUser.edgeCaseScore + selectedOpponent.edgeCaseScore)) * 100}%` }} />
                  <div className="h-full bg-purple-500 rounded-r-full" style={{ width: `${(selectedOpponent.edgeCaseScore / (currentUser.edgeCaseScore + selectedOpponent.edgeCaseScore)) * 100}%` }} />
                </div>
              </div>

              {/* Metric 3: Weekly GitHub Velocity (Yash Wins!) */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className={`font-bold ${currentUser.weeklyCommits >= selectedOpponent.weeklyCommits ? 'text-accent-emerald' : 'text-text-secondary'}`}>
                    {currentUser.weeklyCommits} commits {currentUser.weeklyCommits > selectedOpponent.weeklyCommits && '👑'}
                  </span>
                  <span className="text-text-tertiary font-sans font-bold uppercase tracking-wider text-[10px]">30-Day GitHub Commits</span>
                  <span className={`font-bold ${selectedOpponent.weeklyCommits > currentUser.weeklyCommits ? 'text-accent-emerald' : 'text-text-secondary'}`}>
                    {selectedOpponent.weeklyCommits} commits {selectedOpponent.weeklyCommits > currentUser.weeklyCommits && '👑'}
                  </span>
                </div>
                <div className="flex gap-1.5 h-2 bg-surface-0 rounded-full overflow-hidden border border-border-subtle">
                  <div className="h-full bg-accent-violet rounded-l-full" style={{ width: `${(currentUser.weeklyCommits / (currentUser.weeklyCommits + selectedOpponent.weeklyCommits)) * 100}%` }} />
                  <div className="h-full bg-purple-500 rounded-r-full" style={{ width: `${(selectedOpponent.weeklyCommits / (currentUser.weeklyCommits + selectedOpponent.weeklyCommits)) * 100}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border-subtle mt-4 flex items-center justify-between text-xs text-text-tertiary">
            <span className="font-mono">Highlight: You lead {selectedOpponent.name} in GitHub Commit Velocity by <strong className="text-accent-emerald">+4 commits</strong></span>
          </div>
        </Card>
      </div>

      {/* SECTION 3: REAL-TIME PEER ACTIVITY FEED */}
      <Card>
        <div className="flex items-center justify-between border-b border-border-subtle pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent-violet" />
            <h3 className="font-display font-extrabold text-white text-base">Live Pod Activity Stream</h3>
          </div>
          <Badge variant="emerald" dot>Real-Time Broadcast</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-sans text-xs">
          <div className="bg-surface-0/60 border border-border-subtle rounded-xl p-3.5 flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-accent-emerald/20 text-accent-emerald flex items-center justify-center font-bold shrink-0 mt-0.5">
              P
            </div>
            <div>
              <h5 className="font-bold text-text-primary">Priya Sharma</h5>
              <p className="text-text-secondary text-[11px] mt-0.5">Cleared <strong className="text-accent-emerald font-semibold">Amazon Graph Gate</strong> with zero edge-case errors! (+350 XP)</p>
              <span className="text-[9px] text-text-tertiary font-mono block mt-1">12 minutes ago</span>
            </div>
          </div>

          <div className="bg-surface-0/60 border border-border-subtle rounded-xl p-3.5 flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-accent-amber/20 text-accent-amber flex items-center justify-center font-bold shrink-0 mt-0.5">
              A
            </div>
            <div>
              <h5 className="font-bold text-text-primary">Alex Chen</h5>
              <p className="text-text-secondary text-[11px] mt-0.5">Reached a <strong className="text-accent-amber font-semibold">12-Day Streak</strong> on Spaced Revision Queue!</p>
              <span className="text-[9px] text-text-tertiary font-mono block mt-1">1 hour ago</span>
            </div>
          </div>

          <div className="bg-surface-0/60 border border-border-subtle rounded-xl p-3.5 flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-accent-violet/20 text-accent-violet flex items-center justify-center font-bold shrink-0 mt-0.5">
              Y
            </div>
            <div>
              <h5 className="font-bold text-text-primary">Yash Saxena (You)</h5>
              <p className="text-text-secondary text-[11px] mt-0.5">Diagnosed 3Sum attempt & fixed two-pointer shrink bounds!</p>
              <span className="text-[9px] text-text-tertiary font-mono block mt-1">3 hours ago</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
