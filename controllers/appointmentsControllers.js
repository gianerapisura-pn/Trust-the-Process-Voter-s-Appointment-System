const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const { Appointment, Voter, AppointmentSlot, AppointmentSite } = require('../models');

async function listAppointments(req, res) {
  try {
    const { status, site_id, slot_date, appointment_code, email_address } = req.query;
    const where = {};

    if (status) where.status = status;
    if (appointment_code) where.appointment_code = appointment_code;

    const include = [
      { model: Voter, attributes: ['applicant_id', 'first_name', 'last_name', 'email_address', 'mobile_number'] },
      {
        model: AppointmentSlot,
        include: [{ model: AppointmentSite }],
      },
    ];

    if (email_address) {
      include[0].where = { email_address };
    }

    if (slot_date || site_id) {
      include[1].where = {};
      if (slot_date) include[1].where.slot_date = slot_date;
      if (site_id) include[1].where.site_id = site_id;
    }

    if (!req.user) {
      if (!appointment_code || !email_address) {
        return res.status(401).json({ message: 'Authentication required' });
      }
    }

    const appointments = await Appointment.findAll({ where, include, order: [['booking_datetime', 'DESC']] });
    res.json(appointments);
  } catch (err) {
    console.error('listAppointments error', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function getAppointment(req, res) {
  try {
    const appt = await Appointment.findByPk(req.params.id, {
      include: [
        { model: Voter },
        { model: AppointmentSlot, include: [AppointmentSite] },
      ],
    });
    if (!appt) return res.status(404).json({ message: 'Appointment not found' });
    res.json(appt);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function createAppointment(req, res) {
  try {
    const { applicant_id, slot_id } = req.body;
    if (!applicant_id || !slot_id)
      return res.status(400).json({ message: 'applicant_id and slot_id required' });

    const voter = await Voter.findByPk(applicant_id);
    if (!voter) return res.status(404).json({ message: 'Voter not found' });

    const slot = await AppointmentSlot.findByPk(slot_id, { include: [AppointmentSite] });
    if (!slot) return res.status(404).json({ message: 'Slot not found' });
    if (slot.max_capacity !== null && slot.bookings_count >= slot.max_capacity) {
      return res.status(400).json({ message: 'Slot is full' });
    }

    const code = uuidv4().split('-')[0].toUpperCase();

    const appt = await Appointment.create({
      applicant_id,
      slot_id,
      appointment_code: code,
      booking_datetime: new Date(),
      status: 'Pending',
    });

    await slot.update({ bookings_count: slot.bookings_count + 1 });

    res.status(201).json(appt);
  } catch (err) {
    console.error('createAppointment error', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function updateAppointment(req, res) {
  try {
    const appt = await Appointment.findByPk(req.params.id);
    if (!appt) return res.status(404).json({ message: 'Appointment not found' });
    await appt.update(req.body);
    res.json(appt);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function updateStatus(req, res) {
  try {
    const { status } = req.body;
    const allowed = ['Pending', 'Approved', 'Rejected', 'Cancelled', 'Confirmed'];
    if (!status) return res.status(400).json({ message: 'status is required' });
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Allowed: ${allowed.join(', ')}` });
    }
    const appt = await Appointment.findByPk(req.params.id);
    if (!appt) return res.status(404).json({ message: 'Appointment not found' });
    await appt.update({ status });
    res.json(appt);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function deleteAppointment(req, res) {
  try {
    const appt = await Appointment.findByPk(req.params.id);
    if (!appt) return res.status(404).json({ message: 'Appointment not found' });

    const slot = await AppointmentSlot.findByPk(appt.slot_id);
    await appt.destroy();

    if (slot) {
      await slot.update({ bookings_count: Math.max(0, slot.bookings_count - 1) });
    }

    res.json({ message: 'Appointment deleted successfully' });
  } catch (err) {
    console.error('deleteAppointment error', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  listAppointments,
  getAppointment,
  createAppointment,
  updateAppointment,
  updateStatus,
  deleteAppointment,
};
