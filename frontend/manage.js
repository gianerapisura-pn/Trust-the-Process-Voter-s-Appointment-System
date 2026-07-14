// manage.js

async function loadUserAppointments(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  try {
    const items = await listAppointments();
    container.innerHTML = items.length
      ? items.map(renderAppointmentRow).join(' ')
      : '<p>No appointments found.</p>';
  } catch (err) {
    container.innerHTML = '<p>Unable to load appointments.</p>';
  }
}

function renderAppointmentRow(appt) {
  const voter = appt.Voter || {};
  const slot = appt.AppointmentSlot || {};
  return `
    <div class="appointment-row" data-id="${appt.appointment_id}">
      <div><strong>${voter.first_name || ''} ${voter.last_name || ''}</strong></div>
      <div>${slot.slot_date || ''} ${slot.start_time || ''}</div>
      <div>Code: <code>${appt.appointment_code || ''}</code></div>
      <div>
        <button onclick="viewAppointment('${appt.appointment_id}')">View</button>
        <button onclick="cancelAppointmentHandler('${appt.appointment_id}')">Cancel</button>
      </div>
    </div>
  `;
}

async function viewAppointment(id) {
  try {
    const cached = JSON.parse(sessionStorage.getItem('appointmentSearchResults') || '[]');
    const appt = cached.find(item => String(item.appointment_id) === String(id));
    if (!appt) throw new Error('Appointment not found in the verified search results');
    localStorage.setItem('currentAppointment', JSON.stringify(appt));
    window.location.href = 'manage_appointment_details.html';
  } catch (err) {
    alert('Unable to load appointment details.');
  }
}

async function cancelAppointmentHandler(id) {
  if (!confirm('Are you sure you want to cancel this appointment?')) return;
  try {
    const cached = JSON.parse(sessionStorage.getItem('appointmentSearchResults') || '[]');
    const appt = cached.find(item => String(item.appointment_id) === String(id));
    const voter = appt && appt.Voter ? appt.Voter : {};
    if (!appt || !appt.appointment_code || !voter.email_address) {
      throw new Error('Missing appointment verification details');
    }
    await cancelAppointment(id, {
      appointment_code: appt.appointment_code,
      email_address: voter.email_address,
    });
    appt.status = 'Cancelled';
    sessionStorage.setItem('appointmentSearchResults', JSON.stringify(cached));
    const row = document.querySelector(`.appointment-row[data-id="${id}"]`);
    if (row) row.remove();
    alert('Appointment cancelled');
  } catch (err) {
    alert('Failed to cancel appointment.');
  }
}
