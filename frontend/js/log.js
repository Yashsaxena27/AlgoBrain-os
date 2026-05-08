// ============================================================
// log.js — Handles the Problem Logging form
// ============================================================

const form = document.getElementById('problemForm');
const submitBtn = document.getElementById('submitBtn');
const btnText = document.getElementById('btnText');
const btnLoader = document.getElementById('btnLoader');
const successCard = document.getElementById('successCard');
const aiResult = document.getElementById('aiResult');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = {
    name: document.getElementById('name').value.trim(),
    platform: document.getElementById('platform').value,
    difficulty: document.getElementById('difficulty').value,
    timeTaken: parseInt(document.getElementById('timeTaken').value) || 0,
    approach: document.getElementById('approach').value.trim(),
    mistakes: document.getElementById('mistakes').value.trim(),
    solution: document.getElementById('solution').value.trim()
  };

  if (!data.name || !data.approach) {
    alert('Please fill in Problem Name and Approach at minimum.');
    return;
  }

  // Show loading state
  submitBtn.disabled = true;
  btnText.classList.add('hidden');
  btnLoader.classList.remove('hidden');

  try {
    const result = await API.logProblem(data);
    const tags = result.problem.aiTags;

    // Build AI result display
    aiResult.innerHTML = `
      <div class="ai-block">
        <div class="ai-block-label">🏷️ Topics Identified</div>
        <div class="ai-block-value">
          ${(tags.topics || []).map(t => `<span class="tag">${t}</span>`).join('')}
        </div>
      </div>
      <div class="ai-block">
        <div class="ai-block-label">🔁 Algorithm Pattern</div>
        <div class="ai-block-value">
          <span class="tag pattern">${tags.pattern || 'N/A'}</span>
        </div>
      </div>
      ${tags.mistakeTypes && tags.mistakeTypes.length > 0 ? `
      <div class="ai-block">
        <div class="ai-block-label">⚠️ Mistake Types</div>
        <div class="ai-block-value">
          ${tags.mistakeTypes.map(m => `<span class="tag mistake">${m}</span>`).join('')}
        </div>
      </div>` : ''}
      <div class="ai-block">
        <div class="ai-block-label">🧠 AI Analysis</div>
        <div class="ai-block-value">${tags.analysis || 'No analysis available.'}</div>
      </div>
      <div class="ai-block">
        <div class="ai-block-label">🎯 What to Practice Next</div>
        <div class="ai-block-value" style="color:var(--accent)">${tags.recommendation || 'Keep practicing!'}</div>
      </div>
    `;

    form.classList.add('hidden');
    successCard.classList.remove('hidden');

  } catch (err) {
    alert('Error: ' + err.message + '\n\nMake sure your backend server is running on port 5000.');
    submitBtn.disabled = false;
    btnText.classList.remove('hidden');
    btnLoader.classList.add('hidden');
  }
});

function resetForm() {
  form.reset();
  form.classList.remove('hidden');
  successCard.classList.add('hidden');
  submitBtn.disabled = false;
  btnText.classList.remove('hidden');
  btnLoader.classList.add('hidden');
}
