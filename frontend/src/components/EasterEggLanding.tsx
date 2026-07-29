import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Sparkles, 
  Coffee, 
  Gamepad2, 
  Moon, 
  Sun, 
  Zap, 
  Award
} from 'lucide-react';

interface EasterEggLandingProps {
  onEnterApp: () => void;
}

interface FallingItem {
  id: number;
  x: number; // percentage 10-90
  y: number; // pixels from top
  type: 'bamboo' | 'binary0' | 'binary1' | 'bug' | 'star';
  speed: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  text: string;
  color: string;
}

export const EasterEggLanding: React.FC<EasterEggLandingProps> = ({ onEnterApp }) => {
  // Theme & Mode states
  const [isNightMode, setIsNightMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'relax' | 'game'>('relax');
  const [hat, setHat] = useState<'none' | 'sunglasses' | 'ninja' | 'crown'>('none');
  const [konamiToast, setKonamiToast] = useState(false);

  // Mini-game states
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(1200);
  const [combo, setCombo] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [pandaX, setPandaX] = useState(50); // percentage position 10-90
  const [fallingItems, setFallingItems] = useState<FallingItem[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);

  // Interactive panda states
  const [panda1Action, setPanda1Action] = useState<'idle' | 'wave' | 'roll' | 'eat' | 'type'>('idle');
  const [panda2Action, setPanda2Action] = useState<'idle' | 'wave' | 'juggle' | 'cheer'>('idle');
  const [currentAlgo, setCurrentAlgo] = useState('Dynamic Programming');

  const containerRef = useRef<HTMLDivElement>(null);
  const konamiSeq = useRef<string[]>([]);
  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

  const algorithms = [
    'Dynamic Programming',
    'Binary Search Tree',
    'Graph BFS / DFS',
    'Sliding Window',
    'Two Pointers',
    'Dijkstra Shortest Path'
  ];

  // Konami Code & Keyboard Controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Game controls
      if (gameActive) {
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
          setPandaX(prev => Math.max(10, prev - 8));
        } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
          setPandaX(prev => Math.min(90, prev + 8));
        }
      }

      // Space to feed bamboo in relax mode
      if (e.code === 'Space' && activeTab === 'relax') {
        e.preventDefault();
        setPanda1Action('eat');
        spawnFloatingText(window.innerWidth / 2, window.innerHeight / 2 - 50, '+100 Bamboo XP! 🎋', '#10B981');
        setTimeout(() => setPanda1Action('idle'), 1000);
      }

      // Konami Code Listener
      konamiSeq.current.push(e.key);
      if (konamiSeq.current.length > konamiCode.length) konamiSeq.current.shift();

      if (konamiSeq.current.join(',') === konamiCode.join(',')) {
        setHat(prev => (prev === 'sunglasses' ? 'ninja' : 'sunglasses'));
        setKonamiToast(true);
        spawnFloatingText(window.innerWidth / 2, window.innerHeight / 3, 'KONAMI CODE UNLOCKED! 🕶️', '#F59E0B');
        setTimeout(() => setKonamiToast(false), 4000);
        konamiSeq.current = [];
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameActive, activeTab]);

  // Mini-game Loop (Falling items & collision detection)
  useEffect(() => {
    if (!gameActive) return;

    // Spawn falling items
    const spawnInterval = setInterval(() => {
      const types: FallingItem['type'][] = ['bamboo', 'binary0', 'binary1', 'star', 'bug'];
      const randomType = types[Math.floor(Math.random() * types.length)];
      const newItem: FallingItem = {
        id: Date.now() + Math.random(),
        x: Math.floor(Math.random() * 80) + 10,
        y: 0,
        type: randomType,
        speed: Math.random() * 3 + 3,
      };
      setFallingItems(prev => [...prev, newItem]);
    }, 800);

    // Movement & Collision ticker
    const tickInterval = setInterval(() => {
      setFallingItems(prev => {
        const nextItems: FallingItem[] = [];
        for (const item of prev) {
          const nextY = item.y + item.speed;

          // Check collision with player Panda (y near 320px, x aligned)
          if (nextY >= 260 && nextY <= 320 && Math.abs(item.x - pandaX) < 12) {
            // Caught item!
            handleCatchItem(item);
          } else if (nextY < 400) {
            nextItems.push({ ...item, y: nextY });
          }
        }
        return nextItems;
      });
    }, 30);

    return () => {
      clearInterval(spawnInterval);
      clearInterval(tickInterval);
    };
  }, [gameActive, pandaX]);

  const handleCatchItem = (item: FallingItem) => {
    if (item.type === 'bug') {
      // Hit bug! Penalty
      setCombo(0);
      setScore(prev => Math.max(0, prev - 150));
      spawnFloatingText(window.innerWidth * (item.x / 100), window.innerHeight / 2 + 50, '-150 Bug! 🐛', '#F43F5E');
    } else {
      // Good item!
      const points = item.type === 'star' ? 250 : item.type === 'bamboo' ? 100 : 50;
      setCombo(c => c + 1);
      const bonus = combo > 3 ? combo * 20 : 0;
      const totalGain = points + bonus;

      setScore(prev => {
        const newScore = prev + totalGain;
        if (newScore > highScore) setHighScore(newScore);

        // Unlock hats on milestones
        if (newScore >= 1000 && hat === 'none') setHat('ninja');
        if (newScore >= 2000 && hat === 'ninja') setHat('crown');

        return newScore;
      });

      const label = item.type === 'star' ? `⭐ +${totalGain} STAR!` : item.type === 'bamboo' ? `🎋 +${totalGain}` : `+${totalGain}`;
      const color = item.type === 'star' ? '#8B5CF6' : item.type === 'bamboo' ? '#10B981' : '#3B82F6';
      spawnFloatingText(window.innerWidth * (item.x / 100), window.innerHeight / 2 + 40, label, color);
    }
  };

  const spawnFloatingText = (x: number, y: number, text: string, color: string) => {
    const newId = Date.now() + Math.random();
    setParticles(prev => [...prev.slice(-10), { id: newId, x, y, text, color }]);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => p.id !== newId));
    }, 1200);
  };

  const startGame = () => {
    setScore(0);
    setCombo(0);
    setFallingItems([]);
    setGameActive(true);
    setActiveTab('game');
  };

  const stopGame = () => {
    setGameActive(false);
    setActiveTab('relax');
    setFallingItems([]);
  };

  // Cycle algorithms on laptop click
  const cycleAlgorithm = () => {
    const nextIdx = (algorithms.indexOf(currentAlgo) + 1) % algorithms.length;
    setCurrentAlgo(algorithms[nextIdx]);
    setPanda1Action('type');
    spawnFloatingText(window.innerWidth / 2 - 100, window.innerHeight / 2 - 80, `Algorithm: ${algorithms[nextIdx]} 💻`, '#3B82F6');
    setTimeout(() => setPanda1Action('idle'), 1000);
  };

  return (
    <div 
      ref={containerRef}
      className={`min-h-screen transition-colors duration-700 select-none font-sans relative overflow-hidden flex flex-col justify-between p-4 sm:p-8 ${
        isNightMode ? 'bg-[#0A0C14] text-slate-100' : 'bg-[#FAF8F3] text-[#1E1B2E]'
      }`}
    >
      {/* Background Lighting Gradients */}
      {isNightMode ? (
        <>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-900/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/3 right-1/4 w-[28rem] h-[28rem] bg-cyan-900/20 rounded-full blur-3xl pointer-events-none" />
        </>
      ) : (
        <>
          <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-emerald-200/35 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/6 w-[30rem] h-[30rem] bg-indigo-200/35 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />
        </>
      )}

      {/* Floating Sky Elements (Stars in Night Mode, Clouds in Day Mode) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {isNightMode ? (
          // Night Sky Stars & Shooting Stars
          [...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 2 + (i % 3), repeat: Infinity, delay: i * 0.2 }}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{ top: `${(i * 17) % 80}%`, left: `${(i * 23) % 95}%` }}
            />
          ))
        ) : (
          // Day Clouds
          <>
            <motion.div
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
              className="absolute top-10 left-0 opacity-40"
            >
              <svg width="140" height="45" viewBox="0 0 140 45" fill="#E5DFD3">
                <path d="M20 40 C10 40 0 30 10 20 C20 10 35 10 45 20 C55 10 80 10 90 20 C105 15 125 25 120 40 Z" />
              </svg>
            </motion.div>

            <motion.div
              animate={{ x: ['100%', '-100%'] }}
              transition={{ duration: 65, repeat: Infinity, ease: 'linear' }}
              className="absolute top-28 right-0 opacity-30"
            >
              <svg width="180" height="55" viewBox="0 0 180 55" fill="#DBD4C5">
                <path d="M25 45 C10 45 0 30 15 20 C35 10 55 10 70 20 C90 10 120 10 135 25 C155 20 170 35 160 45 Z" />
              </svg>
            </motion.div>
          </>
        )}
      </div>

      {/* Floating Text Notifications Ticker */}
      <div className="absolute inset-0 pointer-events-none z-50">
        {particles.map(p => (
          <motion.div
            key={p.id}
            initial={{ opacity: 1, y: p.y, scale: 0.8 }}
            animate={{ opacity: 0, y: p.y - 70, scale: 1.2 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="absolute font-bold text-sm drop-shadow-md font-mono"
            style={{ left: p.x, color: p.color }}
          >
            {p.text}
          </motion.div>
        ))}
      </div>

      {/* Konami Code Activated Toast */}
      <AnimatePresence>
        {konamiToast && (
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30 }}
            className="absolute top-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 border border-amber-400/50 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3"
          >
            <span className="text-2xl">🕶️</span>
            <div>
              <h4 className="font-extrabold text-xs text-amber-400 uppercase tracking-wider">Konami Secret Unlocked!</h4>
              <p className="text-xs text-slate-300">Panda 1 & Panda 2 entered **DSA Master Mode**.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOP HEADER CONTROLS */}
      <header className="relative z-20 max-w-6xl mx-auto w-full flex items-center justify-between gap-4">
        {/* Left Badge */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-[#EFECE6] dark:bg-slate-800/80 border border-[#E2DDD3] dark:border-slate-700/60 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>AlgoBrainOS · Panda Playground v2.0</span>
          </div>

          {/* Hat Unlocks Badge */}
          {hat !== 'none' && (
            <div className="hidden sm:flex items-center gap-1.5 bg-purple-500/10 border border-purple-500/30 text-purple-400 px-3 py-1.5 rounded-full text-xs font-extrabold">
              <Award className="w-3.5 h-3.5" />
              <span className="capitalize">{hat} Hat Unlocked</span>
            </div>
          )}
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-3">
          {/* Day / Night Theme Toggle */}
          <button
            onClick={() => setIsNightMode(!isNightMode)}
            className="p-2.5 rounded-xl bg-[#EFECE6] dark:bg-slate-800 border border-[#E2DDD3] dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:scale-105 transition-all focus-ring cursor-pointer"
            title="Toggle Day / Cyber Night Mode"
          >
            {isNightMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>

          {/* Mode Selector Tabs (Relax vs Code Rush Mini-Game) */}
          <div className="flex bg-[#EFECE6] dark:bg-slate-800/80 p-1 rounded-xl border border-[#E2DDD3] dark:border-slate-700">
            <button
              onClick={stopGame}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'relax' 
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Relax Mode
            </button>
            <button
              onClick={startGame}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'game' 
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20' 
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>Panda Code Rush</span>
            </button>
          </div>
        </div>
      </header>

      {/* MINI-GAME HUD (Only visible when playing Code Rush) */}
      <AnimatePresence>
        {gameActive && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="relative z-20 max-w-xl mx-auto w-full bg-slate-900/90 border border-emerald-500/30 text-white rounded-2xl p-4 shadow-2xl mt-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Score</span>
                <span className="text-xl font-black font-mono text-emerald-400">{score} XP</span>
              </div>
              <div className="h-8 w-px bg-slate-800" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Combo</span>
                <span className="text-sm font-bold font-mono text-amber-400">x{combo}</span>
              </div>
              <div className="h-8 w-px bg-slate-800" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">High Score</span>
                <span className="text-sm font-bold font-mono text-purple-400">{highScore}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">Controls: Move Mouse / Arrow Keys</span>
              <button
                onClick={stopGame}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-xl text-slate-300 border border-slate-700"
              >
                Quit Game
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN INTERACTIVE WORLD CANVAS */}
      <main className="relative z-10 max-w-5xl mx-auto w-full text-center space-y-4 my-auto py-2">
        {/* Floating Isometric 3D-Style Island */}
        <div className="relative w-full max-w-2xl mx-auto h-80 sm:h-96 flex items-center justify-center select-none">

          {/* Falling Game Items Layer */}
          {gameActive && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {fallingItems.map(item => (
                <div
                  key={item.id}
                  className="absolute text-xl transform -translate-x-1/2 transition-transform"
                  style={{ left: `${item.x}%`, top: `${item.y}px` }}
                >
                  {item.type === 'bamboo' && '🎋'}
                  {item.type === 'binary0' && <span className="font-mono font-black text-emerald-400 text-base drop-shadow">0</span>}
                  {item.type === 'binary1' && <span className="font-mono font-black text-indigo-400 text-base drop-shadow">1</span>}
                  {item.type === 'star' && '⭐'}
                  {item.type === 'bug' && '🐛'}
                </div>
              ))}
            </div>
          )}
          
          {/* Main Floating Island Vector Base */}
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            className="relative w-full h-full flex items-center justify-center"
          >
            {/* Background Mini Floating Islet (Left Parallax) */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute left-4 top-12 opacity-80 pointer-events-none"
            >
              <svg width="100" height="70" viewBox="0 0 100 70">
                <path d="M 20 45 Q 50 65 80 45 Q 70 60 50 62 Q 30 60 20 45 Z" fill="#6E543E" />
                <ellipse cx="50" cy="42" rx="32" ry="10" fill={isNightMode ? '#1E3A2B' : '#69B34C'} />
                {/* Mini Bamboo Stalks */}
                <rect x="42" y="22" width="3" height="20" fill="#4ADE80" />
                <rect x="52" y="26" width="2.5" height="16" fill="#22C55E" />
              </svg>
            </motion.div>

            {/* Background Mini Floating Islet (Right Parallax) */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute right-6 top-16 opacity-80 pointer-events-none"
            >
              <svg width="90" height="60" viewBox="0 0 90 60">
                <path d="M 15 38 Q 45 55 75 38 Q 65 52 45 54 Q 25 52 15 38 Z" fill="#6E543E" />
                <ellipse cx="45" cy="36" rx="30" ry="8" fill={isNightMode ? '#1E3A2B' : '#7CBD58'} />
                <circle cx="45" cy="30" r="4" fill="#F43F5E" />
              </svg>
            </motion.div>

            {/* PRIMARY FLOATING ISLAND SVG */}
            <svg viewBox="0 0 450 200" className="w-full h-full drop-shadow-2xl">
              {/* Island Stratum Base */}
              <path d="M 50 120 Q 225 200 400 120 Q 350 185 225 195 Q 100 185 50 120 Z" fill={isNightMode ? '#3D2C20' : '#8C6E54'} />
              <path d="M 70 125 Q 225 190 380 125 Q 330 170 225 180 Q 120 170 70 125 Z" fill={isNightMode ? '#2B1E16' : '#6E543E'} />
              
              {/* Embedded Glowing Crystals */}
              <polygon points="140,155 146,145 152,155 146,165" fill={isNightMode ? '#22D3EE' : '#38BDF8'} opacity="0.8" />
              <polygon points="310,150 316,140 322,150 316,160" fill={isNightMode ? '#8B5CF6' : '#A855F7'} opacity="0.8" />

              {/* Lush Grass Surface */}
              <ellipse cx="225" cy="115" rx="170" ry="34" fill={isNightMode ? '#152E22' : '#69B34C'} />
              <ellipse cx="225" cy="112" rx="160" ry="29" fill={isNightMode ? '#1D3D2D' : '#7CBD58'} />

              {/* Decorative Flowers & Grass Tufts */}
              <circle cx="110" cy="110" r="3" fill="#FFE169" />
              <circle cx="340" cy="114" r="3" fill="#FF8FAC" />
              <circle cx="235" cy="122" r="2.5" fill="#FFE169" />
            </svg>

            {/* Steaming Coffee Mug */}
            <div className="absolute left-20 bottom-28 flex flex-col items-center">
              <motion.div
                animate={{ y: [-2, -16], opacity: [0.8, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
                className="w-2 h-4 bg-slate-400/40 rounded-full blur-[1px] mb-0.5"
              />
              <div className="relative cursor-pointer" onClick={() => spawnFloatingText(window.innerWidth / 2 - 180, window.innerHeight / 2 - 40, 'Hot Espresso ☕', '#D97706')}>
                <Coffee className="w-5 h-5 text-amber-900 fill-amber-700 dark:text-amber-300 dark:fill-amber-900" />
              </div>
            </div>

            {/* PANDA 1 (Hacker / Coding Panda) */}
            <motion.div
              onClick={() => {
                setPanda1Action('roll');
                spawnFloatingText(window.innerWidth / 2 - 120, window.innerHeight / 2 - 60, 'Giggle! 🐾', '#10B981');
                setTimeout(() => setPanda1Action('idle'), 1000);
              }}
              onMouseEnter={() => setPanda1Action('wave')}
              onMouseLeave={() => setPanda1Action('idle')}
              animate={
                panda1Action === 'roll'
                  ? { rotate: [0, 360], scale: [1, 1.1, 1] }
                  : panda1Action === 'eat'
                  ? { y: [0, -15, 0], scale: [1, 1.08, 1] }
                  : { y: [0, -4, 0] }
              }
              transition={{ duration: 0.6 }}
              style={gameActive ? { left: `${pandaX - 10}%` } : {}}
              className={`absolute bottom-24 cursor-pointer group transition-all duration-150 ${gameActive ? '' : 'left-28'}`}
              title="Click to interact or click laptop to change algorithm!"
            >
              {/* Panda 1 Vector Graphic */}
              <svg width="95" height="95" viewBox="0 0 100 100" className="drop-shadow-lg">
                {/* Ears */}
                <motion.circle 
                  cx="28" cy="24" r="11" fill="#1E1B2E" 
                  animate={{ rotate: [0, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.circle 
                  cx="72" cy="24" r="11" fill="#1E1B2E" 
                  animate={{ rotate: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />

                {/* Head */}
                <circle cx="50" cy="42" r="27" fill="#FFFFFF" stroke="#E2DDD3" strokeWidth="1.5" />
                
                {/* Eye Patches */}
                <ellipse cx="37" cy="40" rx="7.5" ry="9.5" fill="#1E1B2E" transform="rotate(-15 37 40)" />
                <ellipse cx="63" cy="40" rx="7.5" ry="9.5" fill="#1E1B2E" transform="rotate(15 63 40)" />
                
                {/* Blinking Eyes */}
                <motion.circle 
                  cx="37" cy="39" r="2.5" fill="#FFFFFF" 
                  animate={{ scaleY: [1, 0.1, 1] }}
                  transition={{ duration: 4, repeat: Infinity, repeatDelay: 2.5 }}
                />
                <motion.circle 
                  cx="63" cy="39" r="2.5" fill="#FFFFFF" 
                  animate={{ scaleY: [1, 0.1, 1] }}
                  transition={{ duration: 4, repeat: Infinity, repeatDelay: 2.5 }}
                />

                {/* Nose & Cute Expression */}
                <ellipse cx="50" cy="48" rx="4" ry="2.5" fill="#1E1B2E" />
                <path d="M 46 52 Q 50 56 54 52" fill="none" stroke="#1E1B2E" strokeWidth="1.5" strokeLinecap="round" />

                {/* HATS & ACCESSORIES */}
                {hat === 'sunglasses' && (
                  <g>
                    <rect x="25" y="33" width="23" height="13" rx="3" fill="#000000" />
                    <rect x="52" y="33" width="23" height="13" rx="3" fill="#000000" />
                    <line x1="48" y1="39" x2="52" y2="39" stroke="#000000" strokeWidth="2.5" />
                    <line x1="28" y1="36" x2="40" y2="43" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                  </g>
                )}

                {hat === 'ninja' && (
                  <g>
                    <path d="M 22 26 Q 50 22 78 26 L 76 34 Q 50 30 24 34 Z" fill="#DC2626" />
                    <circle cx="78" cy="30" r="4" fill="#DC2626" />
                  </g>
                )}

                {hat === 'crown' && (
                  <path d="M 32 18 L 41 26 L 50 14 L 59 26 L 68 18 L 64 30 L 36 30 Z" fill="#FBBF24" stroke="#D97706" strokeWidth="1" />
                )}

                {/* Body & Paws */}
                <ellipse cx="50" cy="76" rx="23" ry="19" fill="#FFFFFF" stroke="#E2DDD3" strokeWidth="1.5" />
                <path d="M 28 65 Q 50 58 72 65 Q 50 86 28 65 Z" fill="#1E1B2E" />

                {/* Waving Arm */}
                {panda1Action === 'wave' ? (
                  <motion.path
                    d="M 26 68 Q 12 48 20 40"
                    fill="none"
                    stroke="#1E1B2E"
                    strokeWidth="10"
                    strokeLinecap="round"
                    animate={{ rotate: [0, 25, 0] }}
                    transition={{ duration: 0.3, repeat: Infinity }}
                  />
                ) : (
                  <path d="M 30 73 Q 20 78 26 84" fill="none" stroke="#1E1B2E" strokeWidth="8" strokeLinecap="round" />
                )}

                {/* Holographic Coding Laptop */}
                <g transform="translate(42, 63)" onClick={(e) => { e.stopPropagation(); cycleAlgorithm(); }} className="cursor-pointer">
                  <rect x="0" y="0" width="26" height="16" rx="2" fill="#1E1B2E" stroke="#6366F1" strokeWidth="1" />
                  <rect x="2" y="2" width="22" height="12" rx="1" fill="#0B0C10" />
                  <line x1="4" y1="5" x2="16" y2="5" stroke="#6366F1" strokeWidth="1.2" />
                  <line x1="4" y1="8" x2="20" y2="8" stroke="#34D399" strokeWidth="1.2" />
                  <line x1="4" y1="11" x2="12" y2="11" stroke="#FBBF24" strokeWidth="1.2" />
                  <rect x="-3" y="15" width="32" height="3" rx="1" fill="#2E2B44" />
                </g>
              </svg>

              {/* Holographic Floating Algorithm Label */}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-indigo-900/90 border border-indigo-400/40 px-2 py-0.5 rounded-full text-[9px] font-mono text-cyan-300 font-bold whitespace-nowrap shadow-sm">
                {currentAlgo}
              </div>
            </motion.div>

            {/* PANDA 2 (Playful / Juggling Panda - Right) */}
            {!gameActive && (
              <motion.div
                onClick={() => {
                  setPanda2Action('juggle');
                  spawnFloatingText(window.innerWidth / 2 + 120, window.innerHeight / 2 - 60, 'Binary Juggling! 🤹', '#8B5CF6');
                  setTimeout(() => setPanda2Action('idle'), 1200);
                }}
                onMouseEnter={() => setPanda2Action('wave')}
                onMouseLeave={() => setPanda2Action('idle')}
                animate={
                  panda2Action === 'juggle'
                    ? { y: [0, -15, 0] }
                    : { y: [0, -4, 0] }
                }
                transition={{ duration: 0.6, delay: 0.1 }}
                className="absolute right-28 bottom-24 cursor-pointer group"
                title="Click me to juggle binary digits!"
              >
                {/* Juggling Binary Spheres Animation */}
                {panda2Action === 'juggle' && (
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-20 h-10 pointer-events-none">
                    <motion.div
                      animate={{ x: [-20, 20, -20], y: [-15, 5, -15] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      className="absolute w-4 h-4 rounded-full bg-emerald-400 text-surface-0 font-mono font-bold text-[10px] flex items-center justify-center shadow-md"
                    >
                      1
                    </motion.div>
                    <motion.div
                      animate={{ x: [20, -20, 20], y: [5, -15, 5] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      className="absolute w-4 h-4 rounded-full bg-indigo-400 text-surface-0 font-mono font-bold text-[10px] flex items-center justify-center shadow-md"
                    >
                      0
                    </motion.div>
                  </div>
                )}

                {/* Panda 2 Vector Graphic */}
                <svg width="95" height="95" viewBox="0 0 100 100" className="drop-shadow-lg">
                  {/* Ears */}
                  <circle cx="28" cy="24" r="11" fill="#1E1B2E" />
                  <circle cx="72" cy="24" r="11" fill="#1E1B2E" />

                  {/* Head */}
                  <circle cx="50" cy="42" r="27" fill="#FFFFFF" stroke="#E2DDD3" strokeWidth="1.5" />
                  
                  {/* Eye Patches */}
                  <ellipse cx="37" cy="40" rx="7.5" ry="9.5" fill="#1E1B2E" transform="rotate(-15 37 40)" />
                  <ellipse cx="63" cy="40" rx="7.5" ry="9.5" fill="#1E1B2E" transform="rotate(15 63 40)" />
                  
                  {/* Blinking Eyes */}
                  <motion.circle 
                    cx="37" cy="39" r="2.5" fill="#FFFFFF" 
                    animate={{ scaleY: [1, 0.1, 1] }}
                    transition={{ duration: 4.5, repeat: Infinity, repeatDelay: 2 }}
                  />
                  <motion.circle 
                    cx="63" cy="39" r="2.5" fill="#FFFFFF" 
                    animate={{ scaleY: [1, 0.1, 1] }}
                    transition={{ duration: 4.5, repeat: Infinity, repeatDelay: 2 }}
                  />

                  {/* Nose & Cute Expression */}
                  <ellipse cx="50" cy="48" rx="4" ry="2.5" fill="#1E1B2E" />
                  <path d="M 46 52 Q 50 56 54 52" fill="none" stroke="#1E1B2E" strokeWidth="1.5" strokeLinecap="round" />

                  {/* HATS & ACCESSORIES */}
                  {hat === 'sunglasses' && (
                    <g>
                      <rect x="25" y="33" width="23" height="13" rx="3" fill="#000000" />
                      <rect x="52" y="33" width="23" height="13" rx="3" fill="#000000" />
                      <line x1="48" y1="39" x2="52" y2="39" stroke="#000000" strokeWidth="2.5" />
                    </g>
                  )}

                  {hat === 'ninja' && (
                    <g>
                      <path d="M 22 26 Q 50 22 78 26 L 76 34 Q 50 30 24 34 Z" fill="#DC2626" />
                      <circle cx="78" cy="30" r="4" fill="#DC2626" />
                    </g>
                  )}

                  {hat === 'crown' && (
                    <path d="M 32 18 L 41 26 L 50 14 L 59 26 L 68 18 L 64 30 L 36 30 Z" fill="#FBBF24" stroke="#D97706" strokeWidth="1" />
                  )}

                  {/* Body & Paws */}
                  <ellipse cx="50" cy="76" rx="23" ry="19" fill="#FFFFFF" stroke="#E2DDD3" strokeWidth="1.5" />
                  <path d="M 28 65 Q 50 58 72 65 Q 50 86 28 65 Z" fill="#1E1B2E" />

                  {/* Bamboo Stick in Hand */}
                  <g transform="translate(64, 56)">
                    <rect x="0" y="0" width="4.5" height="24" rx="1.5" fill="#4ADE80" />
                    <line x1="0" y1="8" x2="4.5" y2="8" stroke="#16A34A" strokeWidth="1" />
                    <line x1="0" y1="16" x2="4.5" y2="16" stroke="#16A34A" strokeWidth="1" />
                    <circle cx="-1" cy="4" r="2.5" fill="#86EFAC" />
                  </g>
                </svg>
              </motion.div>
            )}

            {/* Quacking Duck */}
            <motion.div
              animate={{ x: ['-280%', '280%'] }}
              transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
              className="absolute bottom-2 left-1/2 pointer-events-none"
            >
              <div className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-100/90 border border-amber-300/80 px-2 py-0.5 rounded-full shadow-sm">
                <span>🐤 quack</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* TYPOGRAPHY SECTION */}
        <div className="space-y-2 max-w-2xl mx-auto pt-1">
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Welcome back, <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400">
              Future Problem Solver.
            </span>
          </h1>

          <p className="text-text-secondary text-sm sm:text-base font-medium max-w-md mx-auto leading-relaxed font-sans">
            Even algorithms deserve a little happiness.
          </p>
        </div>

        {/* PRIMARY ACTION BUTTONS */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-3 select-none">
          {/* Start Solving Button */}
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={onEnterApp}
            className="bg-accent-violet hover:bg-accent-violet/90 text-white font-bold text-sm px-8 py-3.5 rounded-2xl shadow-glow-violet flex items-center gap-2.5 transition-all focus-ring cursor-pointer group"
          >
            <span>Start Solving</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </motion.button>

          {/* Code Rush Mini-Game Button */}
          {!gameActive ? (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={startGame}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm px-6 py-3.5 rounded-2xl shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all focus-ring cursor-pointer"
            >
              <Gamepad2 className="w-4 h-4" />
              <span>Play Code Rush Mini-Game 🎮</span>
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onEnterApp}
              className="bg-surface-2 hover:bg-surface-3 text-text-primary font-semibold text-sm px-6 py-3.5 rounded-2xl border border-border-default transition-all focus-ring cursor-pointer"
            >
              Skip to App
            </motion.button>
          )}
        </div>
      </main>

      {/* FOOTER & KEYBOARD INSTRUCTIONS */}
      <footer className="relative z-20 max-w-6xl mx-auto w-full flex flex-wrap justify-between items-center text-xs text-text-tertiary border-t border-border-subtle pt-4 gap-2 font-mono">
        <div className="flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-accent-amber" />
          <span>Press <kbd className="bg-surface-2 border border-border-default px-1.5 py-0.5 rounded text-text-primary">Space</kbd> to feed bamboo · Try Konami Code: <strong className="text-text-secondary">↑ ↑ ↓ ↓ ← → ← → B A</strong></span>
        </div>

        <div>
          <span>AlgoBrainOS Playground</span>
        </div>
      </footer>
    </div>
  );
};
