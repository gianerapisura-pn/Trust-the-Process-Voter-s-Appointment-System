const { Appointment } = require('../models');

async function getStats(req, res) {
  try {
    const totalAppointments = await Appointment.count();
    const pending = await Appointment.count({ where: { status: 'Pending' } });
    const approved = await Appointment.count({ where: { status: 'Approved' } });
    const rejected = await Appointment.count({ where: { status: 'Rejected' } });

    res.json({ totalAppointments, pending, approved, rejected });
  } catch (err) {
    console.error('getStats error', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = { getStats };
