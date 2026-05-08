const API = 'http://localhost:5000/api';

let allProblems = [];

// ===== PAGE NAVIGATION =====
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

  document.getElementById('page-' + name).classList.add('active');
  event.currentTarget.classList.add('active');

  if (name === 'dashboard') loadDashboard();
  if (name === 'history') loadHistory();
  if (name === 'dna') loadDNA();
  if (name === 'recommend') loadRecommendations();
}

// ===== SUBMIT PROBLEM =====
async function submitProblem() {
  const name = document.getElementById('f-name').value.trim();
  const approach = document.getElementById('f-approach').value.trim();

  if (!name || !approach) {
    showToast('⚠ Problem name and approach are required!', true);
    return;
  }

  const btn = document.getElementById('submit-btn');
  const btnText = document.getElementById('btn-text');
  btn.disabled = true;
  btnText.textContent = '🤖 AI is analyzing your approach...';

  const body = {
    name,
    platform: document.getElementById('f-platform').value,
    difficulty: document.getElementById('f-difficulty').value,
    approach,
    solution: document.getElementById('f-solution').value.trim(),
    mistakes: document.getElementById('f-mistakes').value.trim(),
    timeTaken: parseInt(document.getElementById('f-time').value) || 0,
    solved: document.getElementById('f-solved').value === 'true'
  };

  try {
    const res = await fetch(`${API}/problems`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await res.json();

    if (!data.success) throw new Error(data.error || 'Unknown error');

    const ai = data.problem.aiTags;
    showAIResult(ai, body.difficulty);
    clearForm();
    showToast('✅ Problem logged and analyzed!');
    updateStreakCount();

  } catch (err) {
    showToast('❌ Error: ' + err.message, true);
    console.error(err);
  } finally {
    btn.disabled = false;
    btnText.textContent = '⬡ Analyze & Log Problem';
  }
}

function showAIResult(ai, difficulty) {
  const box = document.getElementById('ai-result');
  box.classList.remove('hidden');

  const diffTag = difficulty !== 'Unknown'
    ? `<span class="tag tag-${difficulty.toLowerCase()}">${difficulty}</span>`
    : `<span class="tag tag-topic">${ai.aiDifficulty}</span>`;

  const topicTags = (ai.topics || []).map(t =>
    `<span class="tag tag-topic">${t}</span>`).join('');

  const mistakeTags = (ai.mistakeTypes || []).map(m =>
    `<span class="tag tag-hard">${m}</span>`).join('');

  box.innerHTML = `
    <div class="ai-result-title">⬡ AI Analysis Complete</div>
    <div class="ai-grid">
      <div class="ai-block">
        <div class="ai-block-label">Topics Detected</div>
        <div class="ai-block-value tags-row">${topicTags || '<span class="tag tag-topic">General</span>'}</div>
      </div>
      <div class="ai-block">
        <div class="ai-block-label">Pattern Used</div>
        <div class="ai-block-value tags-row"><span class="tag tag-pattern">${ai.pattern || 'Unknown'}</span></div>
      </div>
      <div class="ai-block">
        <div class="ai-block-label">Difficulty</div>
        <div class="ai-block-value tags-row">${diffTag}</div>
      </div>
      <div class="ai-block">
        <div class="ai-block-label">Mistake Types</div>
        <div class="ai-block-value tags-row">${mistakeTags || '<span class="tag tag-easy">None</span>'}</div>
      </div>
    </div>
    <div class="ai-why">
      <div class="ai-block-label" style="color: var(--accent2); margin-bottom:8px;">⚠ Why You Struggled</div>
      <div class="ai-block-value">${ai.whyFailed || '—'}</div>
    </div>
    <div class="ai-hint">
      <div class="ai-block-label" style="color: var(--accent3); margin-bottom:8px;">💡 Key Insight for Next Time</div>
      <div class="ai-block-value">${ai.hint || '—'}</div>
    </div>
  `;
  box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function clearForm() {
  ['f-name', 'f-approach', 'f-solution', 'f-mistakes', 'f-time'].forEach(id => {
    document.getElementById(id).value = '';
  });
}

// ===== DASHBOARD =====
async function loadDashboard() {
  try {
    const res = await fetch(`${API}/dashboard`);
    const data = await res.json();
    if (!data.success) return;

    const s = data.stats;

    document.getElementById('stat-total').textContent = s.totalSolved;
    document.getElementById('stat-topics').textContent = Object.keys(s.topicDistribution).length;
    document.getElementById('stat-patterns').textContent = Object.keys(s.patternDistribution).length;
    document.getElementById('stat-mistakes').textContent = s.mistakeDNA.length;

    // Recent problems
    const recentEl = document.getElementById('recent-list');
    if (s.recentProblems.length === 0) {
      recentEl.innerHTML = '<div class="empty-state">No problems logged yet. Start logging!</div>';
    } else {
      recentEl.innerHTML = s.recentProblems.map(p => `
        <div class="recent-item" onclick="openProblemModal('${p.id}')">
          <div class="recent-name">${p.name}</div>
          <div class="recent-meta">
            ${p.difficulty ? `<span class="tag tag-${(p.difficulty||'').toLowerCase()}">${p.difficulty}</span>` : ''}
            ${p.pattern ? `<span class="tag tag-pattern">${p.pattern}</span>` : ''}
          </div>
        </div>
      `).join('');
    }

    // Weak topics
    const weakEl = document.getElementById('weak-topics');
    if (s.weakTopics.length === 0) {
      weakEl.innerHTML = '<div class="empty-state">Log more problems to find weak spots</div>';
    } else {
      const maxCount = s.weakTopics[0]?.count || 1;
      weakEl.innerHTML = s.weakTopics.map(t => `
        <div class="weak-item">
          <span class="weak-name">${t.topic}</span>
          <div class="weak-bar-bg">
            <div class="weak-bar-fill" style="width:${(t.count/maxCount)*100}%"></div>
          </div>
          <span class="weak-count">${t.count}x</span>
        </div>
      `).join('');
    }

    // Topic bars
    const topicEl = document.getElementById('topic-bars');
    const topics = Object.entries(s.topicDistribution).sort((a, b) => b[1] - a[1]);
    const maxTopic = topics[0]?.[1] || 1;

    if (topics.length === 0) {
      topicEl.innerHTML = '<div class="empty-state">No topic data yet</div>';
    } else {
      topicEl.innerHTML = topics.map(([topic, count]) => `
        <div class="topic-bar-item">
          <div class="topic-bar-label">
            <span>${topic}</span>
            <span>${count}</span>
          </div>
          <div class="topic-bar-bg">
            <div class="topic-bar-fill" style="width:${(count/maxTopic)*100}%"></div>
          </div>
        </div>
      `).join('');
    }

  } catch (err) {
    console.error('Dashboard load error:', err);
  }
}

// ===== HISTORY =====
async function loadHistory() {
  try {
    const res = await fetch(`${API}/problems`);
    const data = await res.json();
    allProblems = data.problems || [];
    renderHistory(allProblems);
  } catch (err) {
    document.getElementById('history-list').innerHTML =
      '<div class="empty-state">Error loading problems. Is the server running?</div>';
  }
}

function renderHistory(problems) {
  const el = document.getElementById('history-list');
  if (problems.length === 0) {
    el.innerHTML = '<div class="empty-state">No problems found.</div>';
    return;
  }

  el.innerHTML = problems.map(p => `
    <div class="history-item">
      <div onclick="openProblemModal('${p._id}')">
        <div class="history-name">${p.name}</div>
        <div class="history-meta">
          ${p.difficulty ? `<span class="tag tag-${p.difficulty.toLowerCase()}">${p.difficulty}</span>` : ''}
          ${p.platform ? `<span class="tag tag-topic">${p.platform}</span>` : ''}
          ${p.aiTags?.pattern ? `<span class="tag tag-pattern">${p.aiTags.pattern}</span>` : ''}
          ${(p.aiTags?.topics||[]).map(t => `<span class="tag tag-topic">${t}</span>`).join('')}
          <span class="history-date">${formatDate(p.createdAt)}</span>
        </div>
      </div>
      <div class="history-actions">
        <button class="btn-delete" onclick="deleteProblem('${p._id}', event)">Delete</button>
      </div>
    </div>
  `).join('');
}

function filterProblems() {
  const search = document.getElementById('search-input').value.toLowerCase();
  const diff = document.getElementById('filter-diff').value;
  const platform = document.getElementById('filter-platform').value;

  let filtered = allProblems.filter(p => {
    const matchName = p.name.toLowerCase().includes(search);
    const matchDiff = !diff || p.difficulty === diff;
    const matchPlat = !platform || p.platform === platform;
    return matchName && matchDiff && matchPlat;
  });

  renderHistory(filtered);
}

async function deleteProblem(id, e) {
  e.stopPropagation();
  if (!confirm('Delete this problem?')) return;

  try {
    await fetch(`${API}/problems/${id}`, { method: 'DELETE' });
    allProblems = allProblems.filter(p => p._id !== id);
    renderHistory(allProblems);
    showToast('🗑 Problem deleted');
  } catch (err) {
    showToast('Error deleting', true);
  }
}

// ===== MISTAKE DNA =====
async function loadDNA() {
  try {
    const res = await fetch(`${API}/dashboard`);
    const data = await res.json();
    const dna = data.stats.mistakeDNA;
    const el = document.getElementById('dna-content');

    if (dna.length === 0) {
      el.innerHTML = '<div class="empty-state">Log more problems to reveal your Mistake DNA</div>';
      return;
    }

    const colors = ['#ff3e6c', '#ff8c42', '#ffb830', '#a8ff3e', '#00e5ff'];

    el.innerHTML = dna.map((m, i) => `
      <div class="dna-card ${i === 0 ? 'top-mistake' : ''}">
        ${i === 0 ? '<div class="modal-label" style="color:var(--accent2)">⚠ BIGGEST WEAKNESS</div>' : ''}
        <div class="dna-type">${m.type}</div>
        <div class="dna-bar-bg">
          <div class="dna-bar-fill" style="width:${m.percentage}%; background:${colors[i % colors.length]}"></div>
        </div>
        <div class="dna-percent">${m.percentage}%</div>
        <div class="dna-label">${m.count} occurrence${m.count !== 1 ? 's' : ''}</div>
      </div>
    `).join('');
  } catch (err) {
    document.getElementById('dna-content').innerHTML =
      '<div class="empty-state">Error loading DNA data</div>';
  }
}

// ===== RECOMMENDATIONS =====
async function loadRecommendations() {
  try {
    const res = await fetch(`${API}/recommendations`);
    const data = await res.json();
    const el = document.getElementById('rec-content');

    if (!data.recommendations?.length) {
      el.innerHTML = '<div class="empty-state">No recommendations yet. Log some problems first!</div>';
      return;
    }

    el.innerHTML = data.recommendations.map(rec => `
      <div class="rec-section">
        <div class="rec-reason">${rec.reason}</div>
        <div class="rec-problems">
          ${(rec.problems || []).map(p => `
            <div class="rec-problem">
              <div class="rec-prob-name">${p.name}</div>
              <div class="rec-prob-meta">
                ${p.platform} ${p.number ? `#${p.number}` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');
  } catch (err) {
    document.getElementById('rec-content').innerHTML =
      '<div class="empty-state">Error loading recommendations</div>';
  }
}

// ===== PROBLEM MODAL =====
async function openProblemModal(id) {
  try {
    const res = await fetch(`${API}/problems/${id}`);
    const data = await res.json();
    const p = data.problem;

    const ai = p.aiTags || {};
    const topicTags = (ai.topics||[]).map(t => `<span class="tag tag-topic">${t}</span>`).join(' ');
    const mistakeTags = (ai.mistakeTypes||[]).map(m => `<span class="tag tag-hard">${m}</span>`).join(' ');

    document.getElementById('modal-content').innerHTML = `
      <div class="modal-title">${p.name}</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:20px;">
        <span class="tag tag-${(p.difficulty||'').toLowerCase()}">${p.difficulty}</span>
        <span class="tag tag-topic">${p.platform}</span>
        ${ai.pattern ? `<span class="tag tag-pattern">${ai.pattern}</span>` : ''}
        ${topicTags}
        <span style="font-family:var(--font-mono);font-size:11px;color:var(--text2);padding:4px 0;">${formatDate(p.createdAt)}</span>
      </div>

      <div class="modal-section">
        <div class="modal-label">Your Approach</div>
        <div class="modal-text">${p.approach}</div>
      </div>

      ${p.mistakes ? `
      <div class="modal-section">
        <div class="modal-label">Mistakes Made</div>
        <div class="modal-text">${p.mistakes}</div>
      </div>` : ''}

      ${p.solution ? `
      <div class="modal-section">
        <div class="modal-label">Solution</div>
        <div class="modal-code">${escapeHtml(p.solution)}</div>
      </div>` : ''}

      ${ai.whyFailed ? `
      <div class="modal-section">
        <div class="modal-label" style="color:var(--accent2)">⚠ Why You Struggled (AI)</div>
        <div class="modal-text">${ai.whyFailed}</div>
      </div>` : ''}

      ${ai.hint ? `
      <div class="modal-section">
        <div class="modal-label" style="color:var(--accent3)">💡 Key Insight (AI)</div>
        <div class="modal-text">${ai.hint}</div>
      </div>` : ''}

      ${mistakeTags ? `
      <div class="modal-section">
        <div class="modal-label">Mistake Types</div>
        <div class="tags-row">${mistakeTags}</div>
      </div>` : ''}

      ${p.timeTaken ? `
      <div class="modal-section">
        <div class="modal-label">Time Taken</div>
        <div class="modal-text">${p.timeTaken} minutes</div>
      </div>` : ''}
    `;

    document.getElementById('modal').classList.remove('hidden');
  } catch (err) {
    showToast('Error loading problem', true);
  }
}

function closeModal(e) {
  if (e.target.id === 'modal') closeModalDirect();
}
function closeModalDirect() {
  document.getElementById('modal').classList.add('hidden');
}

// ===== UTILS =====
function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function showToast(msg, isError = false) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.remove('hidden', 'error');
  if (isError) t.classList.add('error');
  setTimeout(() => t.classList.add('hidden'), 3500);
}

function updateStreakCount() {
  const key = 'agos_last_log';
  const today = new Date().toDateString();
  const last = localStorage.getItem(key);
  let streak = parseInt(localStorage.getItem('agos_streak') || '0');

  if (last === today) {
    // same day, no change
  } else if (last === new Date(Date.now() - 86400000).toDateString()) {
    streak += 1;
  } else {
    streak = 1;
  }

  localStorage.setItem(key, today);
  localStorage.setItem('agos_streak', streak);
  document.getElementById('streak-count').textContent = streak;
}

// ===== INIT =====
window.onload = () => {
  const streak = localStorage.getItem('agos_streak') || '0';
  document.getElementById('streak-count').textContent = streak;
  loadDashboard();
};
