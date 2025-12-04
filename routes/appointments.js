const express = require('express');
const router = express.Router();
const { Appointment, Voter } = require('../models');

// GET all appointments
router.get('/',  async (req, res) => {
  try {
    const query = {};
    if (req.query.appointment_code) query.appointment_code = req.query.appointment_code;
    if (req.query.email_address) query['$Voter.email_address$'] = req.query.email_address;

    const appointments = await Appointment.findAll({
      include: [{ model: Voter }],
      where: query
    });
    res.json(appointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

// GET appointment by ID
router.get('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id, { include: [Voter] });
    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });
    res.json(appointment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch appointment' });
  }
});

// CREATE new appointment
router.post('/', async (req, res) => {
  try {
    const { applicant_id, slot_id, status } = req.body;

    if (!applicant_id || !slot_id) {
      return res.status(400).json({ error: 'applicant_id and slot_id are required.' });
    }

    const appointmentData = {
      applicant_id,
      slot_id,
      status: status || 'Pending',
      booking_datetime: new Date(),
    };

    const newAppointment = await Appointment.create(appointmentData);
    res.status(201).json(newAppointment);
  } catch (err) {
    console.error('Database Error:', err);
    res.status(500).json({ error: 'Failed to create appointment. Check foreign keys and required fields.' });
  }
});

// UPDATE appointment
router.put('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });

    await appointment.update(req.body);
    res.json(appointment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update appointment' });
  }
});

// DELETE appointment
router.delete('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });

    await appointment.destroy();
    res.json({ message: 'Appointment deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete appointment' });
  }
});

module.exports = router;
