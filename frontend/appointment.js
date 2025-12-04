// appointment.js

async function createAppointment(payload) {
  return await apiFetch('/appointments', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
}

async function getAppointment(appointmentId) {
  return await apiFetch(`/appointments/${encodeURIComponent(appointmentId)}`, {
    headers: getAuthHeaders(),
  });
}

async function listAppointments(query = {}) {
  const q = query ? `?${new URLSearchParams(query).toString()}` : '';
  return await apiFetch(`/appointments${q}`, { headers: getAuthHeaders() });
}

async function cancelAppointment(appointmentId) {
  return await apiFetch(`/appointments/${encodeURIComponent(appointmentId)}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
}

function attachAppointmentFormHandler(formId, onSuccess) {
  const form = document.getElementById(formId);
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await createAppointment(data);
      if (onSuccess) onSuccess(res);
    } catch (err) {
      alert('Failed to create appointment.');
    }
  });
}
