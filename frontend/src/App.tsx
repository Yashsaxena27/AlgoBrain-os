import { lazy, Suspense, useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scorecard } from './components/Scorecard';
import { Card } from './components/ui/Card';

import { 
  BrainCircuit, 
  LayoutDashboard, 
  Terminal, 
  Network, 
  Clock, 
  ShieldAlert, 
  Target, 
  Compass,
  Users,
  Menu,
  X,
  ChevronRight,
  Search,
  Smile,
  Sun,
  Moon
} from 'lucide-react';

const Dashboard = lazy(() => import('./components/Dashboard').then(module => ({ default: module.Dashboard })));
const ProblemCapture = lazy(() => import('./components/ProblemCapture').then(module => ({ default: module.ProblemCapture })));
const TopicGraph = lazy(() => import('./components/TopicGraph').then(module => ({ default: module.TopicGraph })));
const RevisionQueue = lazy(() => import('./components/RevisionQueue').then(module => ({ default: module.RevisionQueue })));
const MistakeRadar = lazy(() => import('./components/MistakeRadar').then(module => ({ default: module.MistakeRadar })));
const ReadinessEngine = lazy(() => import('./components/ReadinessEngine').then(module => ({ default: module.ReadinessEngine })));
const PeerAnalytics = lazy(() => import('./components/PeerAnalytics').then(module => ({ default: module.PeerAnalytics })));
const FuturePlans = lazy(() => import('./components/FuturePlans').then(module => ({ default: module.FuturePlans })));
const AICoachOrb = lazy(() => import('./components/AICoachOrb').then(module => ({ default: module.AICoachOrb })));
const CommandPalette = lazy(() => import('./components/CommandPalette').then(module => ({ default: module.CommandPalette })));
const EasterEggLanding = lazy(() => import('./components/EasterEggLanding').then(module => ({ default: module.EasterEggLanding })));

const THEME_STORAGE_KEY = 'algobrain-theme';

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const persistedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (persistedTheme === 'light' || persistedTheme === 'dark') {
      return persistedTheme;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  const [showLanding, setShowLanding] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Sync theme to root DOM element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  // Keyboard navigation support for accessibility & UX speed (⌘1–⌘8, ⌘K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key >= '1' && e.key <= '8') {
        e.preventDefault();
        const tabMap = ['dashboard', 'capture', 'graph', 'revision', 'radar', 'readiness', 'analytics', 'future'];
        const index = parseInt(e.key) - 1;
        if (tabMap[index]) {
          setShowLanding(false);
          setActiveTab(tabMap[index]);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const menuItems = useMemo(() => [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" />, hotkey: '⌘1' },
    { id: 'capture', label: 'Problem Capture', icon: <Terminal className="w-4 h-4" />, hotkey: '⌘2' },
    { id: 'graph', label: 'Topic Graph', icon: <Network className="w-4 h-4" />, hotkey: '⌘3' },
    { id: 'revision', label: 'Revision Queue', icon: <Clock className="w-4 h-4" />, hotkey: '⌘4' },
    { id: 'radar', label: 'Mistake DNA Radar', icon: <ShieldAlert className="w-4 h-4" />, hotkey: '⌘5' },
    { id: 'readiness', label: 'Readiness Engine', icon: <Target className="w-4 h-4" />, hotkey: '⌘6' },
    { id: 'analytics', label: 'Peer & Charts', icon: <Users className="w-4 h-4 text-accent-cyan" />, hotkey: '⌘7' },
    { id: 'future', label: 'Future Plans', icon: <Compass className="w-4 h-4 text-accent-violet" />, hotkey: '⌘8' },
  ], []);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onTabChange={setActiveTab} />;
      case 'capture':
        return <ProblemCapture />;
      case 'graph':
        return <TopicGraph />;
      case 'revision':
        return <RevisionQueue />;
      case 'radar':
        return <MistakeRadar />;
      case 'readiness':
        return <ReadinessEngine />;
      case 'analytics':
        return <PeerAnalytics />;
      case 'future':
        return <FuturePlans />;
      default:
        return <Dashboard onTabChange={setActiveTab} />;
    }
  };

  const currentTabItem = menuItems.find(item => item.id === activeTab);

  // Render Easter Egg Landing Page if active
  if (showLanding) {
    return (
      <Suspense fallback={<AppShellFallback />}>
        <EasterEggLanding onEnterApp={() => setShowLanding(false)} />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen flex bg-surface-0 text-text-primary selection:bg-accent-violet selection:text-white transition-colors duration-300">
      {/* Command Palette Modal */}
      <Suspense fallback={null}>
        <CommandPalette 
          isOpen={commandPaletteOpen} 
          onClose={() => setCommandPaletteOpen(false)} 
          onSelectTab={(tab) => {
            setShowLanding(false);
            setActiveTab(tab);
          }} 
        />
      </Suspense>

      {/* Persistent Docked AI Coach Orb */}
      <Suspense fallback={null}>
        <AICoachOrb onAction={() => setActiveTab('revision')} />
      </Suspense>

      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-surface-1/90 border-r border-border-default backdrop-blur-2xl shrink-0 p-5 space-y-6 justify-between select-none">
        <div className="space-y-6">
          {/* Logo Branding */}
          <div className="flex items-center justify-between px-2 py-1">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-accent-violet/10 border border-accent-violet/20 rounded-2xl shadow-sm">
                <BrainCircuit className="w-5 h-5 text-accent-violet" />
              </div>
              <div>
                <h1 className="font-display text-base font-extrabold tracking-tight text-text-primary leading-none flex items-center gap-1.5">
                  <span>AlgoBrainOS</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-accent-violet/15 text-accent-violet font-mono font-bold border border-accent-violet/20">v2.0</span>
                </h1>
                <span className="text-[10px] text-text-tertiary font-medium tracking-wider uppercase block mt-1">Engineering Career OS</span>
              </div>
            </div>
          </div>

          {/* Quick Search Launcher Bar */}
          <div className="px-1">
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="w-full flex items-center justify-between px-3.5 py-2.5 bg-surface-2/80 border border-border-subtle hover:border-border-default rounded-2xl text-xs text-text-secondary hover:text-text-primary transition-all cursor-pointer focus-ring shadow-sm"
            >
              <span className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-text-tertiary" />
                <span>Search or ⌘K...</span>
              </span>
              <kbd className="text-[10px] bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 px-1.5 py-0.5 rounded font-mono text-text-tertiary">⌘K</kbd>
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1">
            <div className="px-3 text-[10px] font-bold text-text-tertiary uppercase tracking-widest mb-2 font-display">Modules</div>
            {menuItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-all duration-200 focus-ring cursor-pointer ${
                    isActive 
                      ? 'bg-accent-violet text-white shadow-md shadow-accent-violet/20 font-semibold border border-indigo-400/20' 
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface-2'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </span>
                  <span className={`text-[10px] font-mono ${isActive ? 'text-indigo-100 font-bold' : 'text-text-tertiary opacity-70'}`}>
                    {item.hotkey}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Footer Profile & Theme Toggle */}
        <div className="pt-4 border-t border-border-subtle px-1 space-y-2">
          {/* Theme Toggle Control */}
          <div className="flex items-center justify-between p-2 rounded-2xl bg-surface-2 border border-border-subtle">
            <span className="text-xs font-semibold text-text-secondary px-2">Theme</span>
            <div className="flex bg-surface-1 p-0.5 rounded-xl border border-border-subtle">
              <button
                onClick={() => setTheme('light')}
                className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                  theme === 'light' ? 'bg-surface-0 text-accent-violet shadow-sm' : 'text-text-tertiary hover:text-text-primary'
                }`}
                title="Soothing Light Theme"
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                  theme === 'dark' ? 'bg-surface-3 text-accent-violet shadow-sm' : 'text-text-tertiary hover:text-text-primary'
                }`}
                title="Dark Mode"
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <button
            onClick={() => setShowLanding(true)}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 hover:bg-amber-500/15 text-xs font-semibold transition-all cursor-pointer shadow-sm"
          >
            <span className="flex items-center gap-2">
              <Smile className="w-4 h-4 text-amber-500" />
              <span>Panda Playground</span>
            </span>
            <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-bold">Easter Egg</span>
          </button>

          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-surface-2/60 border border-border-subtle hover:border-border-default transition-all">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-violet to-purple-600 flex items-center justify-center font-display font-extrabold text-xs text-white shadow-sm">
                Y
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-text-primary block leading-none">Yash Saxena</span>
                <span className="text-[10px] text-accent-emerald font-medium flex items-center gap-1 mt-1 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-emerald animate-pulse" />
                  Level 15 Engineer
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex lg:hidden bg-surface-0/80 backdrop-blur-md"
            onClick={() => setSidebarOpen(false)}
          >
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-72 bg-surface-1 border-r border-border-default p-6 flex flex-col justify-between h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <BrainCircuit className="w-5 h-5 text-accent-violet" />
                    <span className="font-display text-sm font-extrabold text-text-primary">AlgoBrainOS</span>
                  </div>
                  <button onClick={() => setSidebarOpen(false)} className="p-1 rounded-lg hover:bg-surface-2 text-text-tertiary">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="space-y-1">
                  {menuItems.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setSidebarOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-medium transition-all ${
                          isActive 
                            ? 'bg-accent-violet text-white font-semibold' 
                            : 'text-text-secondary hover:text-text-primary hover:bg-surface-2'
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          {item.icon}
                          <span>{item.label}</span>
                        </span>
                        <span className="text-[10px] font-mono opacity-50">{item.hotkey}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded-2xl bg-surface-2 border border-border-subtle">
                  <span className="text-xs font-semibold text-text-secondary px-2">Theme</span>
                  <div className="flex bg-surface-1 p-0.5 rounded-xl border border-border-subtle">
                    <button
                      onClick={() => setTheme('light')}
                      className={`p-1.5 rounded-lg text-xs transition-all ${theme === 'light' ? 'bg-surface-0 text-accent-violet shadow-sm' : 'text-text-tertiary'}`}
                    >
                      <Sun className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setTheme('dark')}
                      className={`p-1.5 rounded-lg text-xs transition-all ${theme === 'dark' ? 'bg-surface-3 text-accent-violet shadow-sm' : 'text-text-tertiary'}`}
                    >
                      <Moon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setShowLanding(true);
                    setSidebarOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-bold"
                >
                  <Smile className="w-4 h-4" />
                  <span>Panda Playground</span>
                </button>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Workspace View */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Navigation Bar */}
        <header className="h-14 border-b border-border-subtle bg-surface-1/70 backdrop-blur-xl flex items-center justify-between px-6 lg:px-8 sticky top-0 z-30 select-none">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-2xl bg-surface-2 border border-border-default text-text-secondary hover:text-text-primary focus-ring"
            >
              <Menu className="w-4 h-4" />
            </button>

            {/* Breadcrumb path */}
            <div className="hidden sm:flex items-center gap-2 text-xs">
              <span className="text-text-tertiary font-medium">AlgoBrainOS</span>
              <ChevronRight className="w-3.5 h-3.5 text-text-tertiary opacity-60" />
              <span className="font-semibold text-text-primary flex items-center gap-2">
                {currentTabItem?.icon}
                <span>{currentTabItem?.label}</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Theme Toggle in Header */}
            <button
              onClick={() => setTheme(prev => (prev === 'light' ? 'dark' : 'light'))}
              className="p-2 rounded-2xl bg-surface-2/80 border border-border-subtle hover:border-border-default text-text-secondary hover:text-text-primary transition-all cursor-pointer focus-ring"
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Soothing Light'} Mode`}
            >
              {theme === 'light' ? <Moon className="w-4 h-4 text-slate-700" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>

            <button
              onClick={() => setShowLanding(true)}
              className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 text-xs font-semibold transition-all cursor-pointer"
            >
              <Smile className="w-3.5 h-3.5 text-amber-500" />
              <span>Panda Playground</span>
            </button>

            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="px-3.5 py-1.5 rounded-2xl bg-surface-2/80 border border-border-subtle hover:border-border-default text-xs text-text-secondary flex items-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              <Search className="w-3.5 h-3.5 text-text-tertiary" />
              <span className="hidden sm:inline">Search...</span>
              <kbd className="text-[10px] font-mono text-text-tertiary bg-black/5 dark:bg-white/5 px-1.5 py-0.5 rounded">⌘K</kbd>
            </button>
          </div>
        </header>

        {/* Workspace Body */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">
          {/* Section 5.1: Slim Persistent Top Strip */}
          <Scorecard />

          {/* Sub Tab View Container with Framer Motion Cross-fades */}
          <div className="w-full pt-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              >
                <Suspense fallback={<AppContentFallback />}>
                  {renderContent()}
                </Suspense>
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}

function AppShellFallback() {
  return (
    <div className="min-h-screen bg-surface-0 p-6 lg:p-8">
      <Card className="h-[40vh] animate-pulse bg-surface-1 border-border-default" />
    </div>
  );
}

function AppContentFallback() {
  return (
    <div className="space-y-4 animate-pulse">
      <Card className="h-24 bg-surface-1 border-border-default" />
      <Card className="h-64 bg-surface-1 border-border-default" />
    </div>
  );
}

export default App;
