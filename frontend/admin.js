// admin.js

async function adminLogin(username, password) {
  const res = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
  if (res && res.token) {
    setAuthToken(res.token);
    return res;
  }
  throw new Error('Invalid login');
}

async function loadAdminDashboard(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  try {
    const stats = await apiFetch('/admin/stats', { headers: getAuthHeaders() });
    container.innerHTML = `
      <div>Total appointments: ${stats.totalAppointments}</div>
      <div>Pending: ${stats.pending}</div>
      <div>Completed: ${stats.completed}</div>
    `;
  } catch (err) {
    container.innerHTML = '<p>Unable to load dashboard.</p>';
  }
}

function adminLogout() {
  setAuthToken(null);
  window.location.href = '/index.html';
}
