// ===== ALGOBRAINOS APP =====
const API = 'http://localhost:5000/api';

// ===== BOOT SEQUENCE =====
window.addEventListener('DOMContentLoaded', () => {
  const messages = [
    'Initializing kernel...',
    'Loading DSA modules...',
    'Connecting to AI engine...',
    'Calibrating mistake detector...',
    'System ready.'
  ];
  const fill = document.querySelector('.boot-fill');
  const status = document.getElementById('boot-status');
  let i = 0;
  const interval = setInterval(() => {
    if (i < messages.length) {
      status.textContent = messages[i];
      fill.style.width = ((i + 1) / messages.length * 100) + '%';
      i++;
    } else {
      clearInterval(interval);
      setTimeout(() => {
        const boot = document.getElementById('boot-screen');
        boot.style.opacity = '0';
        setTimeout(() => {
          boot.style.display = 'none';
          document.getElementById('app').style.display = 'flex';
          loadDashboard();
          startClock();
        }, 500);
      }, 400);
    }
  }, 320);
});

// ===== CLOCK =====
function startClock() {
  const update = () => {
    const now = new Date();
    document.getElementById('clock').textContent =
      now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };
  update();
  setInterval(update, 1000);
}

// ===== NAVIGATION =====
const pageTitles = {
  dashboard: 'Dashboard',
  log: 'Log Problem',
  problems: 'All Problems',
  mistakes: 'Mistake DNA',
  recommend: 'Recommendations',
  mentor: 'AI Mentor'
};

function navigate(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  document.querySelector(`[data-page="${page}"]`).classList.add('active');
  document.getElementById('page-title').textContent = pageTitles[page];

  if (page === 'dashboard') loadDashboard();
  if (page === 'problems') loadProblems();
  if (page === 'mistakes') loadMistakeDNA();
}

// ===== API HELPER =====
async function api(method, path, body) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' }
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(API + path, opts);
  return res.json();
}

// ===== DASHBOARD =====
async function loadDashboard() {
  try {
    const data = await api('GET', '/dashboard');
    const { total, difficultyBreakdown, topicDistribution, mistakeDNA, recentProblems } = data;

    document.getElementById('stat-num-total').textContent = total;
    document.getElementById('stat-easy').textContent = difficultyBreakdown.Easy || 0;
    document.getElementById('stat-medium').textContent = difficultyBreakdown.Medium || 0;
    document.getElementById('stat-hard').textContent = difficultyBreakdown.Hard || 0;
    document.getElementById('total-tag').textContent = total + ' problems';

    // Topic chart
    const topicEl = document.getElementById('topic-chart');
    if (!topicDistribution || topicDistribution.length === 0) {
      topicEl.innerHTML = '<div class="empty">No topics yet. Start logging problems!</div>';
    } else {
      const max = topicDistribution[0].count;
      topicEl.innerHTML = topicDistribution.map(t => `
        <div class="topic-bar">
          <div class="topic-name">${t.topic}</div>
          <div class="bar-track"><div class="bar-fill" style="width:${(t.count/max*100)}%"></div></div>
          <div class="topic-count">${t.count}</div>
        </div>`).join('');
    }

    // Mistake DNA mini
    const dnaEl = document.getElementById('mistake-dna-mini');
    if (!mistakeDNA || mistakeDNA.length === 0) {
      dnaEl.innerHTML = '<div class="empty">No mistakes tracked yet</div>';
    } else {
      dnaEl.innerHTML = mistakeDNA.slice(0, 5).map((m, i) => `
        <div class="dna-item">
          <div class="dna-label">${m.type} <span>${m.percent}%</span></div>
          <div class="dna-track"><div class="dna-fill t${(i%5)+1}" style="width:${m.percent}%"></div></div>
        </div>`).join('');
    }

    // Recent problems
    const recentEl = document.getElementById('recent-problems');
    if (!recentProblems || recentProblems.length === 0) {
      recentEl.innerHTML = '<div class="empty">No problems logged yet. Click "Log Problem" to start!</div>';
    } else {
      recentEl.innerHTML = recentProblems.map(p => `
        <div class="recent-item">
          <span class="recent-name">${p.name}</span>
          <div class="topic-chips">${(p.topics||[]).slice(0,2).map(t=>`<span class="chip">${t}</span>`).join('')}</div>
          <span class="diff-badge diff-${p.difficulty}">${p.difficulty}</span>
        </div>`).join('');
    }
  } catch (err) {
    console.error('Dashboard load error:', err);
  }
}

// ===== SUBMIT PROBLEM =====
async function submitProblem() {
  const btn = document.getElementById('submit-btn');
  const txt = document.getElementById('submit-text');
  const result = document.getElementById('submit-result');

  const name = document.getElementById('f-name').value.trim();
  const approach = document.getElementById('f-approach').value.trim();

  if (!name || !approach) {
    result.innerHTML = '<div class="error-msg">⚠ Problem name and approach are required</div>';
    return;
  }

  btn.disabled = true;
  txt.textContent = '⬡ Analyzing with AI...';
  result.innerHTML = '<div class="loading"><div class="spinner"></div> AI is analyzing your approach...</div>';

  try {
    const data = await api('POST', '/problems', {
      name,
      difficulty: document.getElementById('f-difficulty').value,
      approach,
      mistakes: document.getElementById('f-mistakes').value.trim(),
      solution: document.getElementById('f-solution').value.trim(),
      timeSpent: parseInt(document.getElementById('f-time').value) || 0
    });

    if (data.error) throw new Error(data.error);

    const p = data.problem;
    const hasAI = p.aiAnalysis || p.topics?.length > 0;

    result.innerHTML = `
      <div class="ai-result">
        <div class="ai-result-title">${hasAI ? '⬡ AI Analysis Complete' : '✓ Problem Saved'}</div>
        ${p.topics?.length ? `<div class="ai-row"><div class="ai-key">Topics</div><div class="ai-val topic-chips">${p.topics.map(t=>`<span class="chip">${t}</span>`).join('')}</div></div>` : ''}
        ${p.pattern ? `<div class="ai-row"><div class="ai-key">Pattern</div><div class="ai-val">${p.pattern}</div></div>` : ''}
        ${p.difficulty ? `<div class="ai-row"><div class="ai-key">Difficulty</div><div class="ai-val"><span class="diff-badge diff-${p.difficulty}">${p.difficulty}</span></div></div>` : ''}
        ${p.mistakeTypes?.length ? `<div class="ai-row"><div class="ai-key">Mistakes</div><div class="ai-val">${p.mistakeTypes.join(', ')}</div></div>` : ''}
        ${p.aiAnalysis ? `<div class="ai-row"><div class="ai-key">Analysis</div><div class="ai-val">${p.aiAnalysis}</div></div>` : ''}
        ${p.hint ? `<div class="ai-row"><div class="ai-key">Next Tip</div><div class="ai-val accent" style="color:var(--accent)">${p.hint}</div></div>` : ''}
        ${!hasAI ? '<div class="ai-row"><div class="ai-key" style="color:var(--yellow)">Note</div><div class="ai-val" style="color:var(--yellow)">Add your Anthropic API key in backend/.env for AI analysis</div></div>' : ''}
      </div>`;

    // Reset form
    ['f-name','f-approach','f-mistakes','f-solution','f-time'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('f-difficulty').value = 'Medium';

  } catch (err) {
    result.innerHTML = `<div class="error-msg">❌ Error: ${err.message}</div>`;
  }

  btn.disabled = false;
  txt.textContent = '⬡ Analyze & Save';
}

// ===== LOAD ALL PROBLEMS =====
async function loadProblems() {
  const el = document.getElementById('problems-list');
  el.innerHTML = '<div class="loading"><div class="spinner"></div> Loading problems...</div>';
  try {
    const problems = await api('GET', '/problems');
    if (!problems.length) {
      el.innerHTML = '<div class="empty">No problems yet. Go log one!</div>';
      return;
    }
    el.innerHTML = problems.map(p => `
      <div class="problem-card" onclick="toggleCard('${p._id}')">
        <div class="card-top">
          <span class="card-name">${p.name}</span>
          ${p.pattern ? `<span class="card-pattern">${p.pattern}</span>` : ''}
          <span class="diff-badge diff-${p.difficulty}">${p.difficulty}</span>
        </div>
        <div class="card-meta">
          <div class="topic-chips">${(p.topics||[]).map(t=>`<span class="chip">${t}</span>`).join('')}</div>
          <span class="card-date">${new Date(p.createdAt).toLocaleDateString('en-IN')}</span>
        </div>
        <div class="card-expanded" id="exp-${p._id}">
          ${p.approach ? `<div class="exp-section"><div class="exp-label">Approach</div><div class="exp-text">${p.approach}</div></div>` : ''}
          ${p.mistakes ? `<div class="exp-section"><div class="exp-label">Mistakes</div><div class="exp-text">${p.mistakes}</div></div>` : ''}
          ${p.aiAnalysis ? `<div class="exp-section"><div class="exp-label">AI Analysis</div><div class="exp-text">${p.aiAnalysis}</div></div>` : ''}
          ${p.hint ? `<div class="exp-section"><div class="exp-label">AI Tip</div><div class="exp-text accent">${p.hint}</div></div>` : ''}
          <button class="delete-btn" onclick="deleteProblem(event,'${p._id}')">✕ Delete</button>
        </div>
      </div>`).join('');
  } catch (err) {
    el.innerHTML = `<div class="error-msg">Error loading problems: ${err.message}</div>`;
  }
}

function toggleCard(id) {
  document.getElementById('exp-' + id).classList.toggle('open');
}

async function deleteProblem(e, id) {
  e.stopPropagation();
  if (!confirm('Delete this problem?')) return;
  await api('DELETE', '/problems/' + id);
  loadProblems();
}

// ===== MISTAKE DNA =====
async function loadMistakeDNA() {
  const el = document.getElementById('mistake-dna-full');
  el.innerHTML = '<div class="loading"><div class="spinner"></div> Loading mistake patterns...</div>';
  try {
    const data = await api('GET', '/dashboard');
    const { mistakeDNA } = data;
    if (!mistakeDNA || mistakeDNA.length === 0) {
      el.innerHTML = '<div class="empty">No mistakes tracked yet. The AI will extract mistake types when you log problems.</div>';
      return;
    }
    el.innerHTML = `
      <div class="panel" style="max-width:700px">
        <div class="panel-title">Your Error Fingerprint</div>
        ${mistakeDNA.map((m, i) => `
          <div class="dna-item">
            <div class="dna-label">
              ${m.type}
              <span>${m.count} occurrence${m.count>1?'s':''} — ${m.percent}%</span>
            </div>
            <div class="dna-track">
              <div class="dna-fill t${(i%5)+1}" style="width:${m.percent}%"></div>
            </div>
          </div>`).join('')}
        <div style="margin-top:1.5rem; padding-top:1rem; border-top:1px solid var(--border)">
          <div class="exp-label">Main Weakness</div>
          <div style="color:var(--accent); font-weight:700; margin-top:0.4rem">${mistakeDNA[0]?.type || 'N/A'} — ${mistakeDNA[0]?.percent || 0}% of all mistakes</div>
        </div>
      </div>`;
  } catch (err) {
    el.innerHTML = `<div class="error-msg">Error: ${err.message}</div>`;
  }
}

// ===== RECOMMENDATIONS =====
async function loadRecommendations() {
  const el = document.getElementById('recommend-list');
  el.innerHTML = '<div class="loading"><div class="spinner"></div> AI is generating personalized recommendations...</div>';
  try {
    const data = await api('POST', '/ai/recommend');
    const recs = data.recommendations;
    if (!recs || recs.length === 0) {
      el.innerHTML = '<div class="empty">No recommendations yet. Log more problems first, or add your Anthropic API key.</div>';
      return;
    }
    el.innerHTML = recs.map(r => `
      <div class="rec-card">
        <div class="rec-name">${r.name}</div>
        <div class="rec-why">${r.why}</div>
        <div class="rec-meta">
          <span class="chip">${r.topic}</span>
          <span class="diff-badge diff-${r.difficulty}">${r.difficulty}</span>
          <span style="font-family:var(--font-mono);font-size:0.65rem;color:var(--muted)">${r.platform}</span>
        </div>
      </div>`).join('');
  } catch (err) {
    el.innerHTML = `<div class="error-msg">Error: ${err.message}. Make sure your Anthropic API key is configured.</div>`;
  }
}

// ===== MENTOR =====
async function getMentorHint() {
  const name = document.getElementById('m-name').value.trim();
  const approach = document.getElementById('m-approach').value.trim();
  const el = document.getElementById('mentor-result');

  if (!name || !approach) {
    el.innerHTML = '<div class="error-msg">Fill in both fields first</div>';
    return;
  }

  el.innerHTML = '<div class="loading"><div class="spinner"></div> AI Mentor is thinking...</div>';
  try {
    const data = await api('POST', '/ai/mentor', { problemName: name, approach });
    el.innerHTML = `
      <div class="mentor-hint">
        <div class="mentor-hint-label">◆ Mentor Hint</div>
        <div class="mentor-hint-text">${data.hint}</div>
      </div>`;
  } catch (err) {
    el.innerHTML = `<div class="error-msg">Error: ${err.message}. Make sure your API key is configured.</div>`;
  }
}
