// api.js
const BASE_URL = 'http://localhost:3000/api';

async function apiFetch(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const defaultHeaders = { 'Content-Type': 'application/json' };
  options.headers = { ...defaultHeaders, ...(options.headers || {}) };

  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type') || '';
    if (!res.ok) {
      let errBody = contentType.includes('application/json') ? await res.json() : await res.text();
      throw { status: res.status, body: errBody };
    }
    return contentType.includes('application/json') ? await res.json() : await res.text();
  } catch (err) {
    throw err;
  }
}

function setAuthToken(token) {
  if (token) localStorage.setItem('token', token);
  else localStorage.removeItem('token');
}

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}
