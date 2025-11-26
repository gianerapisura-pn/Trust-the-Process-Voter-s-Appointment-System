const { Appointment, Voter } = require('../models');
const { v4: uuidv4 } = require('uuid');

async function createAppointment(req, res) {
  try {
    const { applicant_id, slot_id } = req.body;

    if (!applicant_id || !slot_id)
      return res.status(400).json({ message: 'applicant_id and slot_id required' });

    const voter = await Voter.findByPk(applicant_id);
    if (!voter) return res.status(404).json({ message: 'Voter not found' });

    const code = uuidv4().split('-')[0].toUpperCase();

    const appt = await Appointment.create({
      applicant_id,
      slot_id,
      appointment_code: code,
      booking_datetime: new Date(),
      status: 'Pending'
    });

    res.status(201).json(appt);

  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = { createAppointment };
