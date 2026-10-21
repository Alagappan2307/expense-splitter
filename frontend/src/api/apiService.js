const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

async function handleResponse(res) {
  if (!res.ok) {
    let errorMsg = 'An error occurred';
    try {
      const errData = await res.json();
      errorMsg = errData.message || (errData.validationErrors ? Object.values(errData.validationErrors).join(', ') : res.statusText);
    } catch {
      errorMsg = res.statusText || `HTTP error ${res.status}`;
    }
    throw new Error(errorMsg);
  }
  return res.json();
}

export const api = {
  // Users
  getUsers: () => fetch(`${API_BASE}/users`).then(handleResponse),
  getUser: (id) => fetch(`${API_BASE}/users/${id}`).then(handleResponse),
  createUser: (data) => fetch(`${API_BASE}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleResponse),

  // Groups
  getGroups: () => fetch(`${API_BASE}/groups`).then(handleResponse),
  getGroup: (id) => fetch(`${API_BASE}/groups/${id}`).then(handleResponse),
  createGroup: (data) => fetch(`${API_BASE}/groups`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleResponse),
  addMember: (groupId, userId) => fetch(`${API_BASE}/groups/${groupId}/members`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  }).then(handleResponse),
  getGroupMembers: (groupId) => fetch(`${API_BASE}/groups/${groupId}/members`).then(handleResponse),

  // Expenses
  getExpenses: (groupId) => fetch(`${API_BASE}/expenses/group/${groupId}`).then(handleResponse),
  getExpense: (id) => fetch(`${API_BASE}/expenses/${id}`).then(handleResponse),
  createExpense: (data) => fetch(`${API_BASE}/expenses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleResponse),

  // Balances
  getBalances: (groupId) => fetch(`${API_BASE}/groups/${groupId}/balances`).then(handleResponse),

  // Simplified Debts
  getSimplifiedDebts: (groupId) => fetch(`${API_BASE}/groups/${groupId}/simplify-debts`).then(handleResponse),

  // Settlements
  recordSettlement: (data) => fetch(`${API_BASE}/settlements`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleResponse),
  getSettlements: (groupId) => fetch(`${API_BASE}/groups/${groupId}/settlements`).then(handleResponse),

  // Full Group Report
  getGroupReport: (groupId) => fetch(`${API_BASE}/groups/${groupId}/report`).then(handleResponse),
};
