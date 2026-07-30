import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, AlertCircle, Terminal, HelpCircle, ArrowRight, Check, Copy, Clock, History, FileCode } from 'lucide-react';
import { mockAttempts, mockProblems } from '../mockData';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Card } from './ui/Card';
import { Skeleton } from './ui/Skeleton';

interface AnalysisResult {
  title: string;
  detectedDifficulty: 'Easy' | 'Medium' | 'Hard';
  detectedTags: string[];
  correctness: 'Accepted' | 'Wrong Answer';
  mistakeType: string;
  complexityEstimated: string;
  complexityActual: string;
  critique: string;
  revisionIn: string;
}

export const ProblemCapture: React.FC = () => {
  const [url, setUrl] = useState('');
  const [code, setCode] = useState('');
  const [notes, setNotes] = useState('');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'idle' | 'analyzing' | 'done'>('idle');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [formMessage, setFormMessage] = useState<string | null>(null);

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || !code.trim()) {
      setFormMessage('Please provide both problem URL and solution code before running diagnosis.');
      setStep('idle');
      return;
    }

    setFormMessage(null);

    setLoading(true);
    setStep('analyzing');

    // Simulate dual-stage AI analysis pipeline
    setTimeout(() => {
      const isCorrect = !code.includes('Missing duplicate checks');
      const correctness: AnalysisResult['correctness'] = isCorrect ? 'Accepted' : 'Wrong Answer';
      const simulatedCritique: AnalysisResult = {
        title: url.split('/problems/')[1]?.split('/')[0]?.replace(/-/g, ' ') || 'Custom Problem Attempt',
        detectedDifficulty: difficulty,
        detectedTags: ['Arrays', 'Two Pointers'],
        correctness,
        mistakeType: isCorrect ? 'None' : 'Duplicate Handling / Off-by-one',
        complexityEstimated: 'O(N^2)',
        complexityActual: 'O(N^2)',
        critique: isCorrect 
          ? 'Optimal execution of the two-pointer approach. Dup checks on lines 5 & 10 are solid. Clean O(1) space utilization. This is interview-ready code.'
          : 'Your nested loops run in O(N^2) correctly. However, you missed duplicate triplets in the inner loop (skipping identical nums[left] or nums[right] elements). Update lines 14-20 to increment/decrement indices when duplicates occur.',
        revisionIn: '3 days (FSRS severity-weighted review)'
      };

      setResult(simulatedCritique);
      setLoading(false);
      setStep('done');
      setFormMessage(null);
    }, 2500);
  };

  const handleReset = () => {
    setUrl('');
    setCode('');
    setNotes('');
    setStep('idle');
    setResult(null);
    setFormMessage(null);
  };

  const loadExample = () => {
    const wrongAttempt = mockAttempts[1];
    setUrl(`https://leetcode.com/problems/3sum`);
    setCode(wrongAttempt.code);
    setNotes('Failing on duplicate test cases, need assistance identifying why pointer skipping failed.');
    setDifficulty('Medium');
  };

  const copyCritique = () => {
    if (result) {
      navigator.clipboard.writeText(result.critique).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }).catch(() => {
        setFormMessage('Could not copy critique to clipboard. Please copy it manually.');
      });
    }
  };

  const getAttemptUrl = (attemptProblemId: string, fallbackSlug: string) => {
    const matchingProblem = mockProblems.find(problem => problem.id === attemptProblemId);
    if (matchingProblem) {
      return `https://leetcode.com/problems/${matchingProblem.leetcodeSlug}`;
    }

    return `https://leetcode.com/problems/${fallbackSlug}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Input panel & Code Editor (7 cols) */}
      <Card className="lg:col-span-7 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center mb-5 border-b border-border-subtle pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-accent-violet/10 border border-violet-500/20 text-accent-violet">
                <Terminal className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-text-primary text-base">Diagnostic Code Capture</h3>
                <p className="text-xs text-text-tertiary">Paste solution code for automated structural mistake detection</p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={loadExample}
              className="text-[11px]"
            >
              Load Sample Solution
            </Button>
          </div>

          <form onSubmit={handleAnalyze} className="space-y-4">
            {/* LeetCode link input */}
            <div>
              <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-text-tertiary mb-1.5">LeetCode Problem URL</label>
              <input 
                type="url" 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://leetcode.com/problems/3sum" 
                className="w-full bg-surface-0 border border-border-default focus-ring rounded-xl px-4 py-2.5 text-text-primary text-xs transition-all placeholder:text-text-tertiary"
                required
              />
            </div>

            {/* Difficulty select */}
            <div>
              <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-text-tertiary mb-1.5">Difficulty Tag</label>
              <div className="grid grid-cols-3 gap-3">
                {(['Easy', 'Medium', 'Hard'] as const).map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setDifficulty(diff)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all duration-200 focus-ring cursor-pointer ${
                      difficulty === diff 
                        ? 'bg-accent-violet/20 border-accent-violet text-white shadow-sm shadow-accent-violet/20' 
                        : 'bg-surface-0 border-border-default text-text-tertiary hover:border-border-strong'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Dark Monaco-Style Editor Pane */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-text-tertiary">Source Code Editor</label>
                <span className="text-[10px] font-mono text-text-tertiary">TypeScript / Python / C++</span>
              </div>

              <div className="relative rounded-xl overflow-hidden border border-border-default focus-within:border-accent-violet/60 transition-all bg-surface-0">
                {/* Line numbers column + Textarea */}
                <div className="flex">
                  <div className="w-9 py-4 bg-surface-1/60 border-r border-border-subtle text-right pr-2 select-none text-[11px] font-mono text-text-tertiary space-y-1">
                    {Array.from({ length: Math.max(code.split('\n').length, 10) }).map((_, i) => (
                      <div key={i}>{i + 1}</div>
                    ))}
                  </div>

                  <div className="flex-1 relative">
                    <textarea 
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="function threeSum(nums: number[]): number[][] { ... }" 
                      className="w-full h-64 bg-transparent text-text-primary font-mono text-xs p-4 focus:outline-none resize-none leading-relaxed"
                      required
                    />

                    {/* Section 6.2 Code scanning line animation during diagnosis */}
                    {step === 'analyzing' && (
                      <motion.div 
                        initial={{ top: 0 }}
                        animate={{ top: '100%' }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        className="absolute left-0 right-0 h-0.5 bg-accent-cyan shadow-glow-cyan pointer-events-none"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Notes input */}
            <div>
              <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-text-tertiary mb-1.5">Stuck Notes & Constraints</label>
              <textarea 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="What edge cases caused trouble? Where did logic fail?" 
                className="w-full h-16 bg-surface-0 border border-border-default focus-ring rounded-xl p-3 text-text-primary text-xs resize-none placeholder:text-text-tertiary"
              />
            </div>

            <div className="pt-2">
              {step !== 'done' && (
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={loading}
                  leftIcon={<Sparkles className="w-4 h-4" />}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="w-full"
                >
                  Run AI Diagnosis Pipeline
                </Button>
              )}
            </div>

            {formMessage && (
              <div className="bg-accent-amber/10 border border-accent-amber/25 rounded-xl px-3 py-2 text-xs text-accent-amber font-medium">
                {formMessage}
              </div>
            )}
          </form>
        </div>
      </Card>

      {/* Result critique panel + Attempt History Strip (5 cols) */}
      <div className="lg:col-span-5 space-y-6">
        <Card className="flex flex-col justify-between overflow-hidden relative min-h-[420px]">
          <AnimatePresence mode="wait">
            {step === 'idle' && (
              <motion.div 
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="m-auto text-center max-w-xs space-y-3 py-12"
              >
                <div className="p-4 rounded-2xl bg-surface-0 border border-border-default w-16 h-16 mx-auto flex items-center justify-center text-text-tertiary">
                  <HelpCircle className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-text-primary text-sm font-display">Diagnostic Panel Ready</h4>
                <p className="text-text-tertiary text-xs leading-relaxed">
                  Paste your solution and click **Run AI Diagnosis** to execute structural mistake classification and complexity evaluation.
                </p>
              </motion.div>
            )}

            {step === 'analyzing' && (
              <motion.div 
                key="analyzing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6 my-auto py-8"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-accent-cyan text-xs font-bold font-mono">
                    <div className="w-4 h-4 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin" />
                    <span>AI Engine Scanning Code...</span>
                  </div>
                  <h4 className="text-sm font-bold text-text-primary">Executing Dual-Stage Critique (Haiku → Sonnet)</h4>
                </div>

                <div className="space-y-3">
                  <Skeleton variant="text" className="h-6 w-3/4" />
                  <Skeleton variant="card" className="h-24" />
                  <Skeleton variant="text" className="h-4 w-1/2" />
                </div>
              </motion.div>
            )}

            {step === 'done' && result && (
              <motion.div 
                key="done"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-5 h-full flex flex-col justify-between"
              >
                <div>
                  {/* Heading */}
                  <div className="flex justify-between items-start mb-4 border-b border-border-subtle pb-3">
                    <div>
                      <h4 className="font-display font-extrabold text-text-primary text-base capitalize">{result.title}</h4>
                      <div className="flex gap-2 mt-1.5">
                        <Badge variant={result.correctness === 'Accepted' ? 'emerald' : 'rose'} dot>
                          {result.correctness}
                        </Badge>
                        <Badge variant="slate">{result.detectedDifficulty}</Badge>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={copyCritique}
                      leftIcon={copied ? <Check className="w-3.5 h-3.5 text-accent-emerald" /> : <Copy className="w-3.5 h-3.5" />}
                    >
                      {copied ? 'Copied' : 'Copy'}
                    </Button>
                  </div>

                  {/* Complexity card */}
                  <div className="grid grid-cols-2 gap-3 bg-surface-0 border border-border-subtle rounded-xl p-3 mb-4">
                    <div>
                      <span className="text-[10px] text-text-tertiary font-bold uppercase tracking-wider">Estimated Complexity</span>
                      <span className="text-xs font-bold text-text-primary font-mono mt-0.5 block">{result.complexityEstimated}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-text-tertiary font-bold uppercase tracking-wider">Actual Complexity</span>
                      <span className="text-xs font-bold text-accent-cyan font-mono mt-0.5 block">{result.complexityActual}</span>
                    </div>
                  </div>

                  {/* Section 6.2 Diff-style critique output */}
                  <div className="space-y-3">
                    <div>
                      <span className="text-[10px] text-text-tertiary font-bold uppercase tracking-wider mb-1.5 block font-display">AI Critique Breakdown</span>
                      <div className="bg-surface-0/60 border border-border-subtle rounded-xl p-3.5 text-text-secondary text-xs leading-relaxed font-sans max-h-48 overflow-y-auto">
                        {result.critique}
                      </div>
                    </div>

                    {/* Behavioral mistake tag */}
                    {result.mistakeType !== 'None' && (
                      <div className="bg-accent-rose/10 border border-accent-rose/20 rounded-xl p-3 flex items-start gap-2.5">
                        <AlertCircle className="w-4 h-4 text-accent-rose shrink-0 mt-0.5" />
                        <div>
                          <span className="text-accent-rose text-[10px] font-bold uppercase tracking-wider">Mistake Tagged (Mistake DNA)</span>
                          <p className="text-text-primary text-xs font-medium mt-0.5">{result.mistakeType}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-4 border-t border-border-subtle flex items-center justify-between">
                  <div className="text-[11px] text-text-tertiary flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-accent-violet" />
                    <span>Scheduled review: <strong className="text-text-primary font-semibold">{result.revisionIn}</strong></span>
                  </div>
                  <Button variant="secondary" size="sm" onClick={handleReset}>
                    Reset Form
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* Section 6.2 Sidebar strip showing past attempts */}
        <Card className="p-4 space-y-3">
          <div className="flex items-center gap-2 text-text-tertiary">
            <History className="w-4 h-4 text-accent-violet" />
            <span className="text-xs font-display font-bold uppercase tracking-wider text-text-secondary">Attempt History</span>
          </div>

          <div className="space-y-2">
            {mockAttempts.map((attempt) => (
              <div 
                key={attempt.id}
                onClick={() => {
                  setUrl(getAttemptUrl(attempt.problemId, '3sum'));
                  setCode(attempt.code);
                  setNotes(attempt.aiCritique);
                  setFormMessage(null);
                }}
                className="p-2.5 rounded-xl bg-surface-0/40 border border-border-subtle hover:border-border-default transition-all cursor-pointer flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <FileCode className="w-3.5 h-3.5 text-text-tertiary" />
                  <span className="font-medium text-text-primary truncate max-w-[180px]">{attempt.problemTitle}</span>
                </div>
                <Badge variant={attempt.status === 'Accepted' ? 'emerald' : 'rose'} size="sm">
                  {attempt.status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
