// ============================================================
// dashboard.js — Loads and renders dashboard stats
// ============================================================

async function loadDashboard() {
  try {
    const stats = await API.getDashboardStats();

    if (stats.total === 0) {
      document.getElementById('emptyState').classList.remove('hidden');
      document.getElementById('dashContent').classList.add('hidden');
      return;
    }

    document.getElementById('emptyState').classList.add('hidden');
    document.getElementById('dashContent').classList.remove('hidden');

    // Stat cards
    document.getElementById('totalCount').textContent = stats.total;
    document.getElementById('easyCount').textContent = stats.difficultyCount.Easy;
    document.getElementById('medCount').textContent = stats.difficultyCount.Medium;
    document.getElementById('hardCount').textContent = stats.difficultyCount.Hard;

    // Weekly chart
    renderWeekChart(stats.weeklyActivity);

    // Top Topics
    renderTopics(stats.topTopics);

    // Mistake DNA
    renderMistakeDNA(stats.mistakeDNA);

    // Patterns
    renderPatterns(stats.patterns);

    // Recent problems
    renderRecent(stats.recent);

  } catch (err) {
    console.error('Dashboard load error:', err);
    document.getElementById('dashContent').innerHTML =
      `<p class="loading">⚠️ Could not load dashboard. Is the backend running?</p>`;
  }
}

function renderWeekChart(weeklyActivity) {
  const container = document.getElementById('weekChart');
  const maxCount = Math.max(...weeklyActivity.map(d => d.count), 1);
  const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });

  container.innerHTML = weeklyActivity.map((day, i) => {
    const heightPct = (day.count / maxCount) * 100;
    const isToday = day.day === today;
    return `
      <div class="week-bar-wrap">
        <div class="week-bar ${isToday ? 'today' : ''}"
          style="height:${Math.max(heightPct, 4)}%"
          title="${day.count} problem${day.count !== 1 ? 's' : ''}"></div>
        <div class="week-day">${day.day}</div>
      </div>
    `;
  }).join('');
}

function renderTopics(topics) {
  const container = document.getElementById('topicsList');
  if (!topics.length) {
    container.innerHTML = '<p style="color:var(--text-muted);font-size:0.8rem;">No topics yet.</p>';
    return;
  }
  const maxCount = topics[0].count;
  container.innerHTML = topics.map(t => `
    <div class="topic-bar-row">
      <div class="topic-name">${t.topic}</div>
      <div class="topic-bar-bg">
        <div class="topic-bar-fill" style="width:${(t.count / maxCount) * 100}%"></div>
      </div>
      <div class="topic-count">${t.count}</div>
    </div>
  `).join('');
}

function renderMistakeDNA(mistakes) {
  const container = document.getElementById('mistakeDNA');
  if (!mistakes.length) {
    container.innerHTML = '<p style="color:var(--text-muted);font-size:0.8rem;">No mistakes logged yet. 🎉</p>';
    return;
  }
  container.innerHTML = mistakes.map(m => `
    <div class="mistake-row">
      <div class="mistake-header">
        <span class="mistake-name">${m.type}</span>
        <span class="mistake-pct">${m.percent}%</span>
      </div>
      <div class="mistake-bar-bg">
        <div class="mistake-bar-fill" style="width:${m.percent}%"></div>
      </div>
    </div>
  `).join('');
}

function renderPatterns(patterns) {
  const container = document.getElementById('patternsList');
  if (!patterns.length) {
    container.innerHTML = '<p style="color:var(--text-muted);font-size:0.8rem;">No patterns yet.</p>';
    return;
  }
  container.innerHTML = patterns.map(p => `
    <span class="pattern-badge">${p.pattern} <span style="opacity:0.5">×${p.count}</span></span>
  `).join('');
}

function renderRecent(problems) {
  const container = document.getElementById('recentList');
  if (!problems.length) {
    container.innerHTML = '';
    return;
  }
  container.innerHTML = problems.map(p => `
    <div class="problem-card">
      <div class="problem-card-header">
        <div class="problem-card-name">${p.name}</div>
        <span class="diff-badge diff-${p.difficulty}">${p.difficulty}</span>
      </div>
      <div class="problem-card-meta">
        <span>${p.platform}</span>
        <span>${formatDate(p.createdAt)}</span>
        ${p.timeTaken ? `<span>⏱ ${p.timeTaken}m</span>` : ''}
      </div>
      <div class="problem-card-tags">
        ${(p.aiTags?.topics || []).map(t => `<span class="tag">${t}</span>`).join('')}
        ${p.aiTags?.pattern ? `<span class="tag pattern">${p.aiTags.pattern}</span>` : ''}
      </div>
    </div>
  `).join('');
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

loadDashboard();
