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
      <div class="stat-card">
        <div class="label">Total appointments</div>
        <div class="value">${stats.totalAppointments}</div>
      </div>
      <div class="stat-card">
        <div class="label">Pending</div>
        <div class="value">${stats.pending}</div>
      </div>
      <div class="stat-card">
        <div class="label">Approved</div>
        <div class="value">${stats.approved}</div>
      </div>
      <div class="stat-card">
        <div class="label">Rejected</div>
        <div class="value">${stats.rejected}</div>
      </div>
    `;
  } catch (err) {
    container.innerHTML = '<p>Unable to load dashboard.</p>';
  }
}

async function loadAdminAppointments(tbodyId, filters = {}) {
  const tbody = document.getElementById(tbodyId);
  if (!tbody) return;
  try {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => { if (v) params.append(k, v); });
    const path = params.toString() ? `/appointments?${params.toString()}` : '/appointments';
    const items = await apiFetch(path, { headers: getAuthHeaders() });
    tbody.innerHTML = items.length ? items.map(renderAdminRow).join('') : '<tr><td colspan="5">No appointments found.</td></tr>';
  } catch (err) {
    console.error(err);
    tbody.innerHTML = '<tr><td colspan="5">Unable to load appointments.</td></tr>';
  }
}

function renderAdminRow(appt) {
  const voter = appt.Voter || {};
  const slot = appt.AppointmentSlot || {};
  const site = slot.AppointmentSite || {};
  const fullName = voter.first_name ? `${voter.first_name} ${voter.last_name}` : 'N/A';
  return `
    <tr data-id="${appt.appointment_id}">
      <td>${fullName}</td>
      <td>${slot.slot_date || ''}</td>
      <td>${slot.start_time ? `${slot.start_time} - ${slot.end_time || ''}` : ''}</td>
      <td>${appt.status}</td>
      <td>
        <button class="action-btn approve" onclick="updateAppointmentStatus(${appt.appointment_id}, 'Approved')">Approve</button>
        <button class="action-btn reject" onclick="updateAppointmentStatus(${appt.appointment_id}, 'Rejected')">Reject</button>
      </td>
    </tr>
  `;
}

async function updateAppointmentStatus(id, status) {
  try {
    await apiFetch(`/appointments/${id}/status`, {
      method: 'PUT',
      headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    await loadAdminAppointments('appointments-body');
    await loadAdminDashboard('stats');
  } catch (err) {
    alert('Unable to update status.');
  }
}

function adminLogout() {
  setAuthToken(null);
  window.location.href = 'index-admin.html';
}
