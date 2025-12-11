const { AppointmentSite } = require('../models');

async function listSites(req, res) {
  try {
    const canonicalSites = [
      { site_id: 1, site_name: 'Quezon City', address: 'Quezon City Hall, Quezon City, Philippines', is_active: true },
      { site_id: 2, site_name: 'Makati City', address: 'Legazpi Village, Makati, Philippines', is_active: true },
      { site_id: 3, site_name: 'Pasig City', address: 'Ortigas Avenue, Ortigas, Philippines', is_active: true },
    ];

    const existingCount = await AppointmentSite.count();
    if (existingCount === 0) {
      await AppointmentSite.bulkCreate(canonicalSites, { ignoreDuplicates: true });
    }

    const sites = await AppointmentSite.findAll({
      where: { is_active: true },
      order: [['site_name', 'ASC']],
    });

    const result = sites.map((s) => ({
      ...s.toJSON(),
      is_active_label: s.is_active ? 'Active' : 'Not Active',
    }));

    res.json(result);
  } catch (err) {
    console.error('listSites error', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function createSite(req, res) {
  try {
    const site = await AppointmentSite.create(req.body);
    res.status(201).json(site);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function updateSite(req, res) {
  try {
    const site = await AppointmentSite.findByPk(req.params.id);
    if (!site) return res.status(404).json({ message: 'Site not found' });
    await site.update(req.body);
    res.json(site);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function deleteSite(req, res) {
  try {
    const site = await AppointmentSite.findByPk(req.params.id);
    if (!site) return res.status(404).json({ message: 'Site not found' });
    await site.destroy();
    res.json({ message: 'Site deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = { listSites, createSite, updateSite, deleteSite };
