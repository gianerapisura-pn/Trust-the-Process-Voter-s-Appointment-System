const { Voter, Appointment, AppointmentSlot, AppointmentSite } = require('../models');
const { v4: uuidv4 } = require('uuid');

async function createVoter(req, res) {
  try {
    const payload = { ...req.body };

    if (!payload.first_name || !payload.last_name || !payload.birthday) {
      return res.status(400).json({ message: 'first_name, last_name, and birthday are required' });
    }

    if (!payload.gender) payload.gender = 'Male';
    if (!payload.nationality) payload.nationality = 'Not provided';
    if (!payload.home_address) payload.home_address = 'Not provided';
    if (!payload.zip_code) payload.zip_code = '0000';
    if (!payload.mobile_number) payload.mobile_number = '0000000000';
    if (!payload.email_address) {
      payload.email_address = `pending-${uuidv4().slice(0, 8)}@example.local`;
    }

    if (!payload.slot_id && (payload.site_id || payload.site_name) && payload.slot_date && payload.start_time && payload.end_time) {
      let site = null;
      if (payload.site_id) {
        site = await AppointmentSite.findByPk(payload.site_id);
      }
      if (!site && payload.site_name) {
        site = await AppointmentSite.findOne({ where: { site_name: payload.site_name } });
      }
      if (!site && payload.site_name) {
        site = await AppointmentSite.create({
          site_name: payload.site_name,
          address: payload.site_address || 'TBD',
          is_active: true,
        });
      }

      let slot = await AppointmentSlot.findOne({
        where: {
          site_id: site.site_id,
          slot_date: payload.slot_date,
          start_time: payload.start_time,
          end_time: payload.end_time,
        },
      });

      if (!slot) {
        slot = await AppointmentSlot.create({
          site_id: site.site_id,
          slot_date: payload.slot_date,
          start_time: payload.start_time,
          end_time: payload.end_time,
          max_capacity: 100000,
          bookings_count: 0,
        });
      }

      payload.slot_id = slot.slot_id;
    }

    // Reuse existing voter by email to avoid unique constraint collisions; update with latest details
    let voter = null;
    if (payload.email_address) {
      voter = await Voter.findOne({ where: { email_address: payload.email_address } });
      if (voter) {
        const updates = {};
        ['first_name', 'last_name', 'middle_name', 'suffix', 'birthday', 'gender', 'nationality', 'home_address', 'zip_code', 'mobile_number'].forEach((field) => {
          if (payload[field]) updates[field] = payload[field];
        });
        if (Object.keys(updates).length) {
          await voter.update(updates);
        }
      }
    }

    if (!voter) {
      voter = await Voter.create(payload);
    }

    // Optionally create appointment if slot is provided
    let appointment = null;
    if (payload.slot_id) {
      let slot = await AppointmentSlot.findByPk(payload.slot_id);
      if (!slot) {
        // Fallback: create default site/slot if none exists for the provided id
        let site = await AppointmentSite.findByPk(1);
        if (!site) {
          site = await AppointmentSite.create({
            site_id: 1,
            site_name: 'Default Site',
            address: 'TBD',
            is_active: true,
          });
        }
        slot = await AppointmentSlot.create({
          slot_id: payload.slot_id,
          site_id: site.site_id,
          slot_date: new Date().toISOString().slice(0, 10),
          start_time: '09:00:00',
          end_time: '10:00:00',
          max_capacity: 100,
          bookings_count: 0,
        });
      }
      if (slot.max_capacity !== null && slot.bookings_count >= slot.max_capacity) {
        return res.status(400).json({ message: 'Slot is full' });
      }

      const appointmentCode = uuidv4().split('-')[0].toUpperCase();
      appointment = await Appointment.create({
        applicant_id: voter.applicant_id,
        slot_id: payload.slot_id,
        appointment_code: appointmentCode,
        booking_datetime: new Date(),
        status: 'Pending'
      });

      await slot.update({ bookings_count: slot.bookings_count + 1 });
    }

    res.status(201).json({ voter, appointment });

  } catch (err) {
    console.error(err);
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'Duplicate value for a unique field (email may already exist).' });
    }
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
