// ============================================================
// history.js — Problem history page with search & filter
// ============================================================

let allProblems = [];

async function loadHistory() {
  const container = document.getElementById('historyList');
  container.innerHTML = '<p class="loading">Loading problems...</p>';

  try {
    allProblems = await API.getProblems();
    renderProblems(allProblems);
  } catch (err) {
    container.innerHTML = `<p style="color:var(--red);font-family:var(--font-mono);font-size:0.85rem;">
      ⚠️ Could not load problems. Is the backend running on port 5000?
    </p>`;
  }
}

function renderProblems(problems) {
  const container = document.getElementById('historyList');

  if (!problems.length) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🗂️</div>
        <div class="empty-title">No problems found</div>
        <p>Try a different search, or <a href="index.html" style="color:var(--accent)">log a new problem</a>.</p>
      </div>`;
    return;
  }

  container.innerHTML = problems.map(p => `
    <div class="problem-card" id="card-${p._id}" onclick="toggleCard('${p._id}')">
      <div class="problem-card-header">
        <div class="problem-card-name">${p.name}</div>
        <div style="display:flex;gap:0.5rem;align-items:center">
          <span class="diff-badge diff-${p.difficulty}">${p.difficulty}</span>
          <button class="delete-btn" onclick="deleteProblem(event, '${p._id}')" title="Delete">🗑️</button>
        </div>
      </div>
      <div class="problem-card-meta">
        <span>${p.platform}</span>
        <span>${formatDate(p.createdAt)}</span>
        ${p.timeTaken ? `<span>⏱ ${p.timeTaken}m</span>` : ''}
      </div>
      <div class="problem-card-tags">
        ${(p.aiTags?.topics || []).map(t => `<span class="tag">${t}</span>`).join('')}
        ${p.aiTags?.pattern ? `<span class="tag pattern">${p.aiTags.pattern}</span>` : ''}
        ${(p.aiTags?.mistakeTypes || []).map(m => `<span class="tag mistake">${m}</span>`).join('')}
      </div>
      <div class="problem-card-analysis">
        <strong style="font-size:0.75rem;color:var(--text-muted);font-family:var(--font-mono);text-transform:uppercase;letter-spacing:0.08em;">AI Analysis</strong>
        <p style="margin-top:0.4rem">${p.aiTags?.analysis || 'No analysis.'}</p>
        ${p.aiTags?.recommendation ? `
          <div class="problem-card-rec">→ ${p.aiTags.recommendation}</div>
        ` : ''}
        ${p.approach ? `
          <div style="margin-top:0.75rem;padding-top:0.75rem;border-top:1px solid var(--border)">
            <strong style="font-size:0.75rem;color:var(--text-muted);font-family:var(--font-mono);text-transform:uppercase;letter-spacing:0.08em;">Your Approach</strong>
            <p style="margin-top:0.4rem;font-size:0.82rem">${p.approach}</p>
          </div>` : ''}
        ${p.mistakes ? `
          <div style="margin-top:0.75rem">
            <strong style="font-size:0.75rem;color:var(--red);font-family:var(--font-mono);text-transform:uppercase;letter-spacing:0.08em;">Mistakes</strong>
            <p style="margin-top:0.4rem;font-size:0.82rem;color:var(--text-muted)">${p.mistakes}</p>
          </div>` : ''}
      </div>
    </div>
  `).join('');
}

function toggleCard(id) {
  const card = document.getElementById('card-' + id);
  card.classList.toggle('expanded');
}

async function deleteProblem(e, id) {
  e.stopPropagation();
  if (!confirm('Delete this problem?')) return;
  try {
    await API.deleteProblem(id);
    allProblems = allProblems.filter(p => p._id !== id);
    filterProblems();
  } catch (err) {
    alert('Could not delete: ' + err.message);
  }
}

function filterProblems() {
  const search = document.getElementById('searchInput').value.toLowerCase();
  const diff = document.getElementById('filterDiff').value;

  const filtered = allProblems.filter(p => {
    const matchesSearch = !search ||
      p.name.toLowerCase().includes(search) ||
      (p.aiTags?.topics || []).some(t => t.toLowerCase().includes(search)) ||
      (p.aiTags?.pattern || '').toLowerCase().includes(search);

    const matchesDiff = !diff || p.difficulty === diff;

    return matchesSearch && matchesDiff;
  });

  renderProblems(filtered);
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

loadHistory();
