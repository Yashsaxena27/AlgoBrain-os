const API_BASE = 'http://localhost:5000/api';

const api = {
  async post(endpoint, data) {
    const res = await fetch(API_BASE + endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  async get(endpoint) {
    const res = await fetch(API_BASE + endpoint);
    return res.json();
  },
  async delete(endpoint) {
    const res = await fetch(API_BASE + endpoint, { method: 'DELETE' });
    return res.json();
  }
};

function showToast(msg, type = 'info') {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  const icons = { success: '✅', error: '❌', info: '🔔' };
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type]}</span> ${msg}`;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function getDiffClass(diff) {
  const map = { Easy: 'easy', Medium: 'medium', Hard: 'hard', Unknown: 'medium' };
  return map[diff] || 'medium';
}

function getStatusClass(status) {
  const map = { Solved: 'solved', Attempted: 'attempted', 'Need Revision': 'revision' };
  return map[status] || 'solved';
}
