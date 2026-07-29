import React from 'react';
import { motion } from 'framer-motion';
import { mockMistakeRadar } from '../mockData';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { ShieldAlert, TrendingUp, AlertTriangle } from 'lucide-react';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';

export const MistakeRadar: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Radar Chart View (7 cols) */}
      <Card className="lg:col-span-7 flex flex-col justify-between min-h-[480px]">
        <div>
          <div className="flex items-center justify-between mb-4 border-b border-border-subtle pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-accent-violet/10 border border-violet-500/20 text-accent-violet">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-white text-base">Mistake DNA Behavioral Radar</h3>
                <p className="text-xs text-text-tertiary">Isolates recurring failure habits across all solved topics</p>
              </div>
            </div>

            <Badge variant="indigo">Mistake Radar</Badge>
          </div>
        </div>

        {/* Recharts radar chart container */}
        <div className="w-full h-72 flex items-center justify-center bg-surface-0/60 border border-border-subtle rounded-2xl p-2 relative my-2">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={mockMistakeRadar}>
              <PolarGrid stroke="rgba(255, 255, 255, 0.1)" />
              <PolarAngleAxis dataKey="subject" stroke="#rgba(245,246,250,0.64)" fontSize={9} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" fontSize={8} />
              <Radar
                name="Mistake Density (%)"
                dataKey="value"
                stroke="#8B7CF8"
                fill="#8B7CF8"
                fillOpacity={0.25}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#131628', 
                  borderColor: 'rgba(255, 255, 255, 0.15)', 
                  color: 'white',
                  borderRadius: '12px',
                  fontSize: '11px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
                }} 
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="text-[11px] text-text-tertiary text-center border-t border-border-subtle pt-3 font-mono">
          *Aggregated from the last 46 AI attempt critiques. Updates dynamically as attempts are submitted.
        </div>
      </Card>

      {/* Section 6.5 Narrative + Trend Framing Insights (5 cols) */}
      <Card className="lg:col-span-5 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="border-b border-border-subtle pb-3">
            <h4 className="font-display font-extrabold text-white text-base flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-accent-rose" />
              <span>Key DNA Vulnerabilities</span>
            </h4>
            <p className="text-xs text-text-tertiary mt-0.5">Top structural habits causing wrong answers</p>
          </div>

          <div className="space-y-3">
            {/* Edge case error pattern */}
            <div className="bg-surface-0/60 border border-accent-rose/30 rounded-xl p-3.5 space-y-2 relative overflow-hidden">
              <div className="flex justify-between items-center text-xs">
                <span className="text-text-primary font-bold font-display">Edge Cases (null/empty)</span>
                <Badge variant="rose">85% Threat</Badge>
              </div>
              
              <div className="w-full h-1.5 bg-surface-0 rounded-full overflow-hidden border border-white/5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '85%' }}
                  transition={{ duration: 0.8 }}
                  className="h-full bg-accent-rose rounded-full" 
                />
              </div>
              
              {/* Section 6.5 Narrative + Trend text */}
              <p className="text-xs text-text-secondary leading-relaxed font-sans">
                "Edge Cases is your <strong className="text-accent-rose font-bold">#1 vulnerability (85% threat)</strong>. You typically submit before validating empty bounds — this cost you <strong className="text-text-primary">4 of your last 10 attempts</strong>."
              </p>
            </div>

            {/* Off by one error pattern */}
            <div className="bg-surface-0/60 border border-border-subtle rounded-xl p-3.5 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-text-primary font-bold font-display">Off-by-One Errors</span>
                <Badge variant="amber">70% Threat</Badge>
              </div>
              
              <div className="w-full h-1.5 bg-surface-0 rounded-full overflow-hidden border border-white/5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '70%' }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  className="h-full bg-accent-amber rounded-full" 
                />
              </div>
              
              <p className="text-xs text-text-secondary leading-relaxed font-sans">
                Occurs primarily during Two-Pointer shrink bounds (left &lt;= right vs left &lt; right).
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-border-subtle flex items-center justify-between text-xs text-text-tertiary">
          <div className="flex items-center gap-1.5 text-accent-emerald font-medium">
            <TrendingUp className="w-4 h-4" />
            <span>+15% Edge Case resilience this week</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
