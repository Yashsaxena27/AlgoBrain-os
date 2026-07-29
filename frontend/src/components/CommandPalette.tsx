import React, { useEffect } from 'react';
import { Command } from 'cmdk';
import { 
  Search, 
  LayoutDashboard, 
  Terminal, 
  Network, 
  Clock, 
  ShieldAlert, 
  Target, 
  Users,
  Code2 
} from 'lucide-react';
import { mockTopics } from '../mockData';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectTab,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Trigger open
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const navigateTo = (tab: string) => {
    onSelectTab(tab);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-surface-0/80 backdrop-blur-md flex items-start justify-center pt-20 px-4"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-xl bg-surface-3 border border-border-strong rounded-2xl shadow-glass-md overflow-hidden animate-fade-in font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        <Command className="w-full bg-transparent">
          <div className="flex items-center border-b border-border-default px-4 py-3 gap-3">
            <Search className="w-4 h-4 text-text-tertiary" />
            <Command.Input
              autoFocus
              placeholder="Type a command or search topic (e.g. Graphs, Revision)..."
              className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none font-sans"
            />
            <button 
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-white/10 text-text-tertiary text-xs"
            >
              <kbd className="font-mono bg-white/5 border border-white/10 px-1.5 py-0.5 rounded">ESC</kbd>
            </button>
          </div>

          <Command.List className="max-h-80 overflow-y-auto p-2 space-y-1 select-none">
            <Command.Empty className="py-6 text-center text-xs text-text-tertiary">
              No matching commands or topics found.
            </Command.Empty>

            <Command.Group heading="Navigation Modules" className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest px-3 py-1.5">
              <Command.Item
                onSelect={() => navigateTo('dashboard')}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs text-text-secondary hover:text-text-primary hover:bg-surface-2 cursor-pointer font-medium"
              >
                <div className="flex items-center gap-2.5">
                  <LayoutDashboard className="w-4 h-4 text-accent-violet" />
                  <span>Dashboard</span>
                </div>
                <span className="text-[10px] font-mono text-text-tertiary">⌘1</span>
              </Command.Item>

              <Command.Item
                onSelect={() => navigateTo('capture')}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs text-text-secondary hover:text-text-primary hover:bg-surface-2 cursor-pointer font-medium"
              >
                <div className="flex items-center gap-2.5">
                  <Terminal className="w-4 h-4 text-accent-violet" />
                  <span>Problem Capture</span>
                </div>
                <span className="text-[10px] font-mono text-text-tertiary">⌘2</span>
              </Command.Item>

              <Command.Item
                onSelect={() => navigateTo('graph')}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs text-text-secondary hover:text-text-primary hover:bg-surface-2 cursor-pointer font-medium"
              >
                <div className="flex items-center gap-2.5">
                  <Network className="w-4 h-4 text-accent-violet" />
                  <span>Topic Graph</span>
                </div>
                <span className="text-[10px] font-mono text-text-tertiary">⌘3</span>
              </Command.Item>

              <Command.Item
                onSelect={() => navigateTo('revision')}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs text-text-secondary hover:text-text-primary hover:bg-surface-2 cursor-pointer font-medium"
              >
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-accent-violet" />
                  <span>Revision Queue</span>
                </div>
                <span className="text-[10px] font-mono text-text-tertiary">⌘4</span>
              </Command.Item>

              <Command.Item
                onSelect={() => navigateTo('radar')}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs text-text-secondary hover:text-text-primary hover:bg-surface-2 cursor-pointer font-medium"
              >
                <div className="flex items-center gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-accent-violet" />
                  <span>Mistake DNA Radar</span>
                </div>
                <span className="text-[10px] font-mono text-text-tertiary">⌘5</span>
              </Command.Item>

              <Command.Item
                onSelect={() => navigateTo('readiness')}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs text-text-secondary hover:text-text-primary hover:bg-surface-2 cursor-pointer font-medium"
              >
                <div className="flex items-center gap-2.5">
                  <Target className="w-4 h-4 text-accent-violet" />
                  <span>Readiness Engine</span>
                </div>
                <span className="text-[10px] font-mono text-text-tertiary">⌘6</span>
              </Command.Item>

              <Command.Item
                onSelect={() => navigateTo('analytics')}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs text-text-secondary hover:text-text-primary hover:bg-surface-2 cursor-pointer font-medium"
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-accent-cyan" />
                  <span>Peer & Charts</span>
                </div>
                <span className="text-[10px] font-mono text-text-tertiary">⌘7</span>
              </Command.Item>
            </Command.Group>

            <Command.Group heading="Pattern Topics" className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest px-3 py-1.5 pt-3">
              {mockTopics.map(topic => (
                <Command.Item
                  key={topic.id}
                  onSelect={() => navigateTo('graph')}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs text-text-secondary hover:text-text-primary hover:bg-surface-2 cursor-pointer font-medium"
                >
                  <div className="flex items-center gap-2.5">
                    <Code2 className="w-4 h-4 text-slate-400" />
                    <span>{topic.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-accent-emerald font-bold">{topic.masteryScore}% Mastery</span>
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
};
