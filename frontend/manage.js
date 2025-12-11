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
    const appt = await getAppointment(id);
    localStorage.setItem('currentAppointment', JSON.stringify(appt));
    window.location.href = 'manage_appointment_details.html';
  } catch (err) {
    alert('Unable to load appointment details.');
  }
}

async function cancelAppointmentHandler(id) {
  if (!confirm('Are you sure you want to cancel this appointment?')) return;
  try {
    await cancelAppointment(id);
    alert('Appointment cancelled');
    const container = document.querySelector('.appointments-container');
    if (container) loadUserAppointments(container.id);
  } catch (err) {
    alert('Failed to cancel appointment.');
  }
}
