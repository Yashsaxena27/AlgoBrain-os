import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockTopics } from '../mockData';
import type { TopicNode } from '../mockData';
import { Network, ShieldCheck, BookOpen } from 'lucide-react';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

export const TopicGraph: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<TopicNode | null>(mockTopics[0]);

  // Color mapping based on mastery scores
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'strong': return { stroke: '#34D399', fill: 'rgba(52, 211, 153, 0.15)', variant: 'emerald' as const };
      case 'medium': return { stroke: '#FBBF24', fill: 'rgba(251, 191, 36, 0.15)', variant: 'amber' as const };
      case 'weak': return { stroke: '#FB7185', fill: 'rgba(251, 113, 133, 0.15)', variant: 'rose' as const };
      default: return { stroke: '#475569', fill: 'rgba(71, 85, 105, 0.15)', variant: 'slate' as const };
    }
  };

  // Find prerequisite node coordinates to render connections
  const renderConnections = () => {
    const paths: React.ReactNode[] = [];
    mockTopics.forEach(node => {
      node.prerequisites.forEach(prereqId => {
        const prereqNode = mockTopics.find(n => n.id === prereqId);
        if (prereqNode) {
          const isSelectedPath = selectedTopic && (selectedTopic.id === node.id || selectedTopic.id === prereqNode.id);
          paths.push(
            <g key={`${prereqNode.id}-${node.id}`}>
              <path
                d={`M ${prereqNode.x} ${prereqNode.y} C ${(prereqNode.x + node.x) / 2} ${prereqNode.y}, ${(prereqNode.x + node.x) / 2} ${node.y}, ${node.x} ${node.y}`}
                fill="none"
                stroke={isSelectedPath ? 'rgba(99, 91, 255, 0.6)' : 'currentColor'}
                strokeOpacity={isSelectedPath ? 0.8 : 0.15}
                strokeWidth={isSelectedPath ? 2.5 : 1.5}
                strokeDasharray={isSelectedPath ? 'none' : '4 4'}
                className="transition-all duration-300 text-text-primary"
              />
              
              {/* Section 6.3 Animated light pulse traveling edge */}
              {isSelectedPath && (
                <circle r="3" fill="#635BFF">
                  <animateMotion
                    path={`M ${prereqNode.x} ${prereqNode.y} C ${(prereqNode.x + node.x) / 2} ${prereqNode.y}, ${(prereqNode.x + node.x) / 2} ${node.y}, ${node.x} ${node.y}`}
                    dur="1.5s"
                    repeatCount="indefinite"
                  />
                </circle>
              )}
            </g>
          );
        }
      });
    });
    return paths;
  };

  return (
    <div className="relative min-h-[600px] rounded-2xl overflow-hidden border border-border-default aurora-bg select-none">
      {/* Canvas Top Bar Overlay */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        <div className="flex items-center gap-2.5 bg-surface-1/90 backdrop-blur-md border border-border-default px-4 py-2 rounded-2xl pointer-events-auto shadow-glass-sm">
          <Network className="w-4 h-4 text-accent-violet" />
          <span className="font-display font-extrabold text-xs text-text-primary">Pattern Taxonomy Galaxy</span>
        </div>

        <div className="flex items-center gap-3 bg-surface-1/90 backdrop-blur-md border border-border-default px-4 py-2 rounded-2xl text-xs pointer-events-auto shadow-glass-sm">
          <Badge variant="emerald" dot>Strong (&gt;80%)</Badge>
          <Badge variant="amber" dot>Medium (50%-80%)</Badge>
          <Badge variant="rose" dot>Weak (&lt;50%)</Badge>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="w-full h-[600px] flex items-center justify-center overflow-x-auto p-4 pt-16">
        <svg className="w-[860px] h-[480px]">
          {/* Draw connection paths */}
          {renderConnections()}
          
          {/* Draw topic nodes */}
          {mockTopics.map(topic => {
            const colors = getLevelColor(topic.level);
            const isSelected = selectedTopic?.id === topic.id;
            // Node size scaled by mastery score
            const radius = Math.max(20, Math.min(30, (topic.masteryScore / 100) * 28 + 14));

            return (
              <g 
                key={topic.id} 
                transform={`translate(${topic.x}, ${topic.y})`}
                className="cursor-pointer group"
                onClick={() => setSelectedTopic(topic)}
              >
                <circle
                  r={radius}
                  fill={colors.fill}
                  stroke={isSelected ? '#635BFF' : colors.stroke}
                  strokeWidth={isSelected ? 3.5 : 2}
                  className="transition-all duration-300 group-hover:scale-110"
                  style={{
                    filter: isSelected ? 'drop-shadow(0 0 14px rgba(99, 91, 255, 0.4))' : 'none'
                  }}
                />
                <text
                  textAnchor="middle"
                  dy=".3em"
                  fill="currentColor"
                  fontSize="11"
                  fontWeight="bold"
                  className="pointer-events-none font-mono text-text-primary"
                >
                  {topic.masteryScore}%
                </text>
                <text
                  textAnchor="middle"
                  y={radius + 16}
                  fill="currentColor"
                  fontSize="11"
                  fontWeight={isSelected ? 'bold' : '600'}
                  className="pointer-events-none font-sans text-text-primary"
                >
                  {topic.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Section 6.3 Docked Floating Glass Detail Panel */}
      <AnimatePresence mode="wait">
        {selectedTopic && (
          <motion.div 
            key={selectedTopic.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-6 right-6 z-20 w-80 sm:w-96 glass-panel border border-border-strong p-5 rounded-2xl shadow-glass-md bg-surface-3/90"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-start border-b border-border-subtle pb-3">
                <div>
                  <span className="text-[10px] text-text-tertiary font-bold uppercase tracking-widest font-display">Selected Pattern Node</span>
                  <h4 className="font-display font-extrabold text-white text-base mt-0.5">{selectedTopic.name}</h4>
                </div>
                <Badge variant={getLevelColor(selectedTopic.level).variant} dot>
                  {selectedTopic.level.toUpperCase()}
                </Badge>
              </div>

              {/* Status Info */}
              <div className="bg-surface-0/60 border border-border-subtle rounded-xl p-3.5 space-y-2.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-text-secondary font-medium">Mastery Score</span>
                  <strong className="text-white text-sm font-bold font-mono">{selectedTopic.masteryScore}%</strong>
                </div>
                
                <div className="w-full h-2 bg-surface-0 rounded-full overflow-hidden border border-border-subtle">
                  <div 
                    className={`h-full rounded-full ${
                      selectedTopic.level === 'strong' ? 'bg-accent-emerald' : selectedTopic.level === 'medium' ? 'bg-accent-amber' : 'bg-accent-rose'
                    }`}
                    style={{ width: `${selectedTopic.masteryScore}%` }}
                  />
                </div>
              </div>

              {/* Recommendation Actions */}
              <div className="space-y-2">
                <span className="text-[10px] text-text-tertiary font-bold uppercase tracking-widest block font-display">Recommended Study Roadmap</span>
                <div className="bg-surface-2/80 border border-border-subtle hover:border-border-default rounded-xl p-3 flex gap-2.5 transition-all cursor-pointer">
                  <BookOpen className="w-4 h-4 text-accent-violet shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-white text-xs font-bold">Standard Pattern Walkthrough</h5>
                    <p className="text-text-secondary text-[11px] mt-0.5 leading-relaxed">
                      Review boundary conditions for {selectedTopic.name}. Master two-pointer shrink constraints.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Button 
                  variant="secondary"
                  size="sm"
                  leftIcon={<ShieldCheck className="w-4 h-4 text-accent-violet" />}
                  className="w-full"
                  onClick={() => alert(`Starting topic review challenge for ${selectedTopic.name}`)}
                >
                  Launch Quick Review (FSRS)
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
