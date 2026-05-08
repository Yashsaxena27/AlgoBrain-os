// ============================================================
// api.js — Central API communication module
// All fetch calls to the backend go through here
// ============================================================

const BASE_URL = 'http://localhost:5000/api';

const API = {
  // Log a new problem (triggers AI analysis on backend)
  async logProblem(data) {
    const res = await fetch(`${BASE_URL}/problems`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to log problem');
    }
    return res.json();
  },

  // Get all problems
  async getProblems() {
    const res = await fetch(`${BASE_URL}/problems`);
    if (!res.ok) throw new Error('Failed to fetch problems');
    return res.json();
  },

  // Get one problem by ID
  async getProblem(id) {
    const res = await fetch(`${BASE_URL}/problems/${id}`);
    if (!res.ok) throw new Error('Problem not found');
    return res.json();
  },

  // Delete a problem
  async deleteProblem(id) {
    const res = await fetch(`${BASE_URL}/problems/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete');
    return res.json();
  },

  // Get dashboard stats
  async getDashboardStats() {
    const res = await fetch(`${BASE_URL}/dashboard/stats`);
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  }
};
