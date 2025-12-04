const { Voter, Appointment } = require('../models');
const { v4: uuidv4 } = require('uuid');

async function createVoter(req, res) {
  try {
    const payload = req.body;

    if (!payload.first_name || !payload.last_name)
      return res.status(400).json({ message: 'first_name and last_name required' });

    // Create voter
    const voter = await Voter.create(payload);

    // Create appointment automatically
    const appointmentCode = uuidv4().split('-')[0].toUpperCase();
    const appointment = await Appointment.create({
      applicant_id: voter.id,
      slot_id: payload.slot_id || 1, // default slot
      appointment_code: appointmentCode,
      booking_datetime: new Date(),
      status: 'Pending'
    });

    res.status(201).json({ voter, appointment });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function getAllVoters(req, res) {
  try {
    const voters = await Voter.findAll();
    res.json(voters);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function getVoter(req, res) {
  try {
    const voter = await Voter.findByPk(req.params.id);
    if (!voter) return res.status(404).json({ message: 'Voter not found' });
    res.json(voter);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function updateVoter(req, res) {
  try {
    const voter = await Voter.findByPk(req.params.id);
    if (!voter) return res.status(404).json({ message: 'Not found' });
    await voter.update(req.body);
    res.json(voter);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function deleteVoter(req, res) {
  try {
    const voter = await Voter.findByPk(req.params.id);
    if (!voter) return res.status(404).json({ message: 'Not found' });
    await voter.destroy();
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = { createVoter, getAllVoters, getVoter, updateVoter, deleteVoter };
