export interface Problem {
  id: string;
  title: string;
  leetcodeSlug: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  lastSolved: string;
}

export interface Attempt {
  id: string;
  problemId: string;
  problemTitle: string;
  timestamp: string;
  status: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded';
  mistakeType?: string;
  aiCritique: string;
  code: string;
}

export interface TopicNode {
  id: string;
  name: string;
  level: 'strong' | 'medium' | 'weak';
  masteryScore: number;
  prerequisites: string[];
  x: number; // For manual visual graph plotting
  y: number;
}

export interface RevisionItem {
  id: string;
  problemTitle: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  dueDate: string;
  daysOverdue: number;
  severity: 'High' | 'Medium' | 'Low';
}

export interface MistakePattern {
  subject: string;
  value: number; // percentage of attempts containing this mistake
  count: number;
}

export interface CompanyReadiness {
  name: string;
  matchPercentage: number;
  color: string;
  requirements: {
    dsa: number;
    systemDesign: number;
    behavioral: number;
    projects: number;
  };
  nextSteps: string[];
}

export const mockProblems: Problem[] = [
  { id: '1', title: 'Two Sum', leetcodeSlug: 'two-sum', difficulty: 'Easy', tags: ['Arrays', 'Hash Table'], lastSolved: '2026-07-28' },
  { id: '2', title: '3Sum', leetcodeSlug: '3sum', difficulty: 'Medium', tags: ['Two Pointers', 'Arrays'], lastSolved: '2026-07-26' },
  { id: '3', title: 'Longest Substring Without Repeating Characters', leetcodeSlug: 'longest-substring-without-repeating-characters', difficulty: 'Medium', tags: ['Sliding Window', 'Hash Table'], lastSolved: '2026-07-25' },
  { id: '4', title: 'Edit Distance', leetcodeSlug: 'edit-distance', difficulty: 'Hard', tags: ['Dynamic Programming', 'String'], lastSolved: '2026-07-20' },
  { id: '5', title: 'Valid Parentheses', leetcodeSlug: 'valid-parentheses', difficulty: 'Easy', tags: ['Stack', 'String'], lastSolved: '2026-07-27' },
];

export const mockAttempts: Attempt[] = [
  {
    id: 'a1',
    problemId: '3',
    problemTitle: 'Longest Substring Without Repeating Characters',
    timestamp: '2026-07-25 14:32',
    status: 'Accepted',
    mistakeType: 'None',
    aiCritique: 'Optimal O(N) solution using a Hash Map sliding window. Complexity matches the best case. Excellent variable naming and edge case handling (empty strings, single characters).',
    code: `function lengthOfLongestSubstring(s: string): number {
    let map = new Map<string, number>();
    let maxLen = 0, left = 0;
    for (let right = 0; right < s.length; right++) {
        if (map.has(s[right])) {
            left = Math.max(left, map.get(s[right])! + 1);
        }
        map.set(s[right], right);
        maxLen = Math.max(maxLen, right - left + 1);
    }
    return maxLen;
}`
  },
  {
    id: 'a2',
    problemId: '2',
    problemTitle: '3Sum',
    timestamp: '2026-07-26 18:10',
    status: 'Wrong Answer',
    mistakeType: 'Duplicate Handling / Off-by-one',
    aiCritique: 'Your algorithm correctly sorts the array and utilizes two pointers. However, you missed duplicates in the inner loop (skipping identical `nums[left]` or `nums[right]` elements). This resulted in repeated triplets in the output. Update lines 14-20 to increment/decrement indices when duplicates occur.',
    code: `function threeSum(nums: number[]): number[][] {
    nums.sort((a, b) => a - b);
    const result: number[][] = [];
    for (let i = 0; i < nums.length - 2; i++) {
        if (i > 0 && nums[i] === nums[i-1]) continue;
        let left = i + 1, right = nums.length - 1;
        while (left < right) {
            let sum = nums[i] + nums[left] + nums[right];
            if (sum === 0) {
                result.push([nums[i], nums[left], nums[right]]);
                left++;
                right--;
                // Missing duplicate checks here!
            } else if (sum < 0) left++;
            else right--;
        }
    }
    return result;
}`
  }
];

export const mockTopics: TopicNode[] = [
  { id: 'arrays', name: 'Arrays & Hashing', level: 'strong', masteryScore: 92, prerequisites: [], x: 150, y: 100 },
  { id: 'pointers', name: 'Two Pointers', level: 'strong', masteryScore: 84, prerequisites: ['arrays'], x: 350, y: 100 },
  { id: 'sliding', name: 'Sliding Window', level: 'medium', masteryScore: 68, prerequisites: ['pointers'], x: 550, y: 100 },
  { id: 'stack', name: 'Stacks & Queues', level: 'strong', masteryScore: 88, prerequisites: ['arrays'], x: 150, y: 250 },
  { id: 'trees', name: 'Trees & BSTs', level: 'weak', masteryScore: 42, prerequisites: ['stack'], x: 350, y: 250 },
  { id: 'graphs', name: 'Graphs & BFS/DFS', level: 'weak', masteryScore: 35, prerequisites: ['trees'], x: 550, y: 250 },
  { id: 'dp', name: 'Dynamic Programming', level: 'weak', masteryScore: 18, prerequisites: ['sliding', 'trees'], x: 750, y: 175 },
];

export const mockRevisionQueue: RevisionItem[] = [
  { id: 'r1', problemTitle: '3Sum', difficulty: 'Medium', dueDate: 'Today', daysOverdue: 0, severity: 'High' },
  { id: 'r2', problemTitle: 'Edit Distance', difficulty: 'Hard', dueDate: '2 days ago', daysOverdue: 2, severity: 'High' },
  { id: 'r3', problemTitle: 'Valid Parentheses', difficulty: 'Easy', dueDate: 'Today', daysOverdue: 0, severity: 'Low' },
  { id: 'r4', problemTitle: 'Koko Eating Bananas', difficulty: 'Medium', dueDate: 'Tomorrow', daysOverdue: -1, severity: 'Medium' },
];

export const mockMistakeRadar: MistakePattern[] = [
  { subject: 'Edge Cases (null/empty)', value: 85, count: 12 },
  { subject: 'Off-by-One Errors', value: 70, count: 9 },
  { subject: 'Time Complexity Overrun', value: 45, count: 6 },
  { subject: 'Duplicate Results', value: 65, count: 8 },
  { subject: 'Wrong Constraint Reading', value: 30, count: 4 },
  { subject: 'Recursion Base Case Missing', value: 50, count: 5 },
];

export const mockCompanyReadiness: CompanyReadiness[] = [
  {
    name: 'Amazon',
    matchPercentage: 67,
    color: '#ff9900',
    requirements: { dsa: 82, systemDesign: 55, behavioral: 60, projects: 70 },
    nextSteps: [
      'Solve 4 Medium/Hard Graph questions to bring DSA graph mastery to 70%',
      'Review Amazon Leadership Principles (Customer Obsession, Ownership)',
      'Complete one System Design mock (focus on Load Balancing)'
    ]
  },
  {
    name: 'Microsoft',
    matchPercentage: 58,
    color: '#0078d7',
    requirements: { dsa: 75, systemDesign: 45, behavioral: 50, projects: 65 },
    nextSteps: [
      'Complete the Spaced Revision queue (3 tasks outstanding)',
      'Master Trees & BST nodes (current mastery is weak at 42%)'
    ]
  },
  {
    name: 'Google',
    matchPercentage: 42,
    color: '#ea4335',
    requirements: { dsa: 95, systemDesign: 60, behavioral: 55, projects: 80 },
    nextSteps: [
      'Advance Dynamic Programming mastery to 70% (currently 18%)',
      'Solve Hard problems using sliding window & two pointers under 35 mins'
    ]
  }
];

export const mockFutureFeatures = [
  {
    id: 'weak-topic',
    title: 'Weak-Topic Resources',
    description: 'Curated + AI-recommended videos/articles with auto-generated mini-explanations mapped to your exact mistakes.',
    phase: 'Phase 2',
    tier: 'Free',
    whyDeferred: 'Needs a stable topic database. Low value until the mastery graph logs active weak nodes.'
  },
  {
    id: 'mock-interview',
    title: 'Interactive Mock Interview Mode',
    description: 'AI voice/chat agent that cold-poses problems, interrupts with complexity questions ("Why O(N)?"), and forces active recall.',
    phase: 'Phase 2',
    tier: 'Premium Wedge',
    whyDeferred: 'Requires low-latency WebSockets and stable LLM critique feedback (built in Week 2).'
  },
  {
    id: 'resume-intel',
    title: 'Resume ↔ Reality Cross-Check',
    description: 'Automatically scans your resume text against actual LeetCode logs and GitHub repositories to check claims and flag inconsistencies.',
    phase: 'Phase 2',
    tier: 'Premium Wedge',
    whyDeferred: 'High complexity. Mapped as first Week 9 feature after shipping core MVP.'
  },
  {
    id: 'browser-extension',
    title: 'Automatic Problem Capture Extension',
    description: 'Chrome/Firefox browser extension that automatically captures your code, metadata, and submit status direct from LeetCode/HackerRank.',
    phase: 'Phase 2',
    tier: 'Utility',
    whyDeferred: 'Avoids initial browser context switching. Manual paste is sufficient for proving the core AI critique loop.'
  },
  {
    id: 'time-travel',
    title: 'Time-Travel Replay',
    description: 'AI resurfaces problems solved months ago and triggers active recall: "You solved this differently back in January. Can you optimize it now?"',
    phase: 'Phase 2',
    tier: 'Retention Hook',
    whyDeferred: 'Requires a minimum of 2-3 months of user historical data to make the prompt meaningful.'
  },
  {
    id: 'accountability-pods',
    title: 'Accountability Pods',
    description: 'Cooperative 4-5 person peer groups with weekly digest logs instead of anxiety-inducing public leaderboards.',
    phase: 'Phase 3',
    tier: 'Retention Hook',
    whyDeferred: 'Requires user scaling and socket subscriptions.'
  }
];

export interface PeerUser {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  level: number;
  xp: number;
  streak: number;
  dsaMastery: number;
  edgeCaseScore: number;
  weeklyCommits: number;
  solvingSpeedMin: number;
  rank: number;
  targetCompany: string;
}

export const mockPeers: PeerUser[] = [
  {
    id: '1',
    name: 'Priya Sharma',
    role: 'SDE-2 Candidate',
    avatarUrl: 'P',
    level: 18,
    xp: 4200,
    streak: 21,
    dsaMastery: 88,
    edgeCaseScore: 85,
    weeklyCommits: 28,
    solvingSpeedMin: 20,
    rank: 1,
    targetCompany: 'Google'
  },
  {
    id: '2',
    name: 'Yash Saxena (You)',
    role: 'Backend Engineer',
    avatarUrl: 'Y',
    level: 15,
    xp: 3450,
    streak: 14,
    dsaMastery: 82,
    edgeCaseScore: 70,
    weeklyCommits: 32,
    solvingSpeedMin: 24,
    rank: 2,
    targetCompany: 'Amazon'
  },
  {
    id: '3',
    name: 'Alex Chen',
    role: 'Systems Engineer',
    avatarUrl: 'A',
    level: 14,
    xp: 3100,
    streak: 12,
    dsaMastery: 78,
    edgeCaseScore: 78,
    weeklyCommits: 24,
    solvingSpeedMin: 26,
    rank: 3,
    targetCompany: 'Microsoft'
  },
  {
    id: '4',
    name: 'Marcus Vance',
    role: 'Full Stack Engineer',
    avatarUrl: 'M',
    level: 13,
    xp: 2800,
    streak: 9,
    dsaMastery: 71,
    edgeCaseScore: 65,
    weeklyCommits: 19,
    solvingSpeedMin: 31,
    rank: 4,
    targetCompany: 'Meta'
  }
];

export const mockWeeklyVelocity = [
  { week: 'W1', userXP: 1200, peerAvgXP: 1000, top10PercentXP: 1600 },
  { week: 'W2', userXP: 1800, peerAvgXP: 1400, top10PercentXP: 2100 },
  { week: 'W3', userXP: 2400, peerAvgXP: 1800, top10PercentXP: 2800 },
  { week: 'W4', userXP: 3450, peerAvgXP: 2200, top10PercentXP: 3900 },
];

export const mockDifficultyDistribution = [
  { name: 'Easy', userSolves: 45, peerAvgSolves: 38, fill: '#34D399' },
  { name: 'Medium', userSolves: 62, peerAvgSolves: 42, fill: '#FBBF24' },
  { name: 'Hard', userSolves: 18, peerAvgSolves: 12, fill: '#FB7185' },
];

