const API_BASE = '/api';

export async function executeQuery(sql) {
  const res = await fetch(`${API_BASE}/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sql }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Query execution failed');
  return data;
}

export async function getHistory(limit = 50) {
  const res = await fetch(`${API_BASE}/history?limit=${limit}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch history');
  return data;
}

export async function clearHistory() {
  const res = await fetch(`${API_BASE}/history`, { method: 'DELETE' });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to clear history');
  return data;
}

export async function generateSQL(prompt) {
  const res = await fetch(`${API_BASE}/ai-query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to generate SQL');
  return data;
}

export async function getStats() {
  const res = await fetch(`${API_BASE}/stats`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch stats');
  return data;
}
