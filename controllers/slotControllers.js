const { AppointmentSlot, AppointmentSite } = require('../models');

async function listSlots(req, res) {
  try {
    const where = {};
    if (req.query.site_id) where.site_id = req.query.site_id;
    if (req.query.slot_date) where.slot_date = req.query.slot_date;

    const slots = await AppointmentSlot.findAll({
      where,
      include: [AppointmentSite],
      order: [['slot_date', 'ASC'], ['start_time', 'ASC']],
    });
    res.json(slots);
  } catch (err) {
    console.error('listSlots error', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function createSlot(req, res) {
  try {
    const slot = await AppointmentSlot.create({
      site_id: req.body.site_id,
      slot_date: req.body.slot_date,
      start_time: req.body.start_time,
      end_time: req.body.end_time,
      max_capacity: req.body.max_capacity || 1,
      bookings_count: req.body.bookings_count || 0,
    });
    res.status(201).json(slot);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function updateSlot(req, res) {
  try {
    const slot = await AppointmentSlot.findByPk(req.params.id);
    if (!slot) return res.status(404).json({ message: 'Slot not found' });
    await slot.update(req.body);
    res.json(slot);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function deleteSlot(req, res) {
  try {
    const slot = await AppointmentSlot.findByPk(req.params.id);
    if (!slot) return res.status(404).json({ message: 'Slot not found' });
    await slot.destroy();
    res.json({ message: 'Slot deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = { listSlots, createSlot, updateSlot, deleteSlot };
