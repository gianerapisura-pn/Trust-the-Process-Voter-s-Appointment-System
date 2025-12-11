const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

dotenv.config();

const { sequelize, User, AppointmentSite, AppointmentSlot } = require('./models');
const authRoutes = require('./routes/auth');
const votersRoutes = require('./routes/voters');
const appointmentsRoutes = require('./routes/appointments');
const adminRoutes = require('./routes/admin');
const sitesRoutes = require('./routes/sites');
const slotsRoutes = require('./routes/slots');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'frontend')));

app.use('/api/auth', authRoutes);
app.use('/api/voters', votersRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/sites', sitesRoutes);
app.use('/api/slots', slotsRoutes);

app.get('/health', (req, res) => {
  res.json({ message: 'CICS Voters API running', timestamp: new Date() });
});

async function seedData() {
  const adminUsername = process.env.ADMIN_USER || 'admin';
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.ADMIN_PASS || 'admin123';

  const existingAdmin = await User.findOne({ where: { username: adminUsername } });
  if (!existingAdmin) {
    const hash = await bcrypt.hash(adminPassword, 10);
    await User.create({
      username: adminUsername,
      email: adminEmail,
      password_hash: hash,
      role: 'admin',
    });
    console.log(`Seeded admin user: ${adminUsername} / ${adminEmail}`);
  }

  let site = await AppointmentSite.findByPk(1);
  if (!site) {
    site = await AppointmentSite.create({
      site_id: 1,
      site_name: 'Quezon City',
      address: '123 Mabini Street, Barangay San Isidro, Quezon City',
      is_active: true,
    });
    console.log('Seeded default site: id=1 Quezon City');
  }

  const canonicalSites = [
    { site_id: 1, site_name: 'Quezon City', address: 'Quezon City Hall, Quezon City, Philippines', is_active: true },
    { site_id: 2, site_name: 'Makati City', address: 'Legazpi Village, Makati, Philippines', is_active: true },
    { site_id: 3, site_name: 'Pasig City', address: 'Ortigas Avenue, Ortigas, Philippines', is_active: true },
  ];

  for (const data of canonicalSites) {
    const [record, created] = await AppointmentSite.findOrCreate({
      where: { site_id: data.site_id },
      defaults: data,
    });
    if (!created) {
      await record.update(data);
    }
  }

  await AppointmentSite.update({ is_active: false }, { where: { site_id: { [require('sequelize').Op.notIn]: canonicalSites.map(s => s.site_id) } } });

  let slot = await AppointmentSlot.findByPk(1);
  if (!slot) {
    slot = await AppointmentSlot.create({
      slot_id: 1,
      site_id: 1,
      slot_date: new Date().toISOString().slice(0, 10),
      start_time: '09:30:00',
      end_time: '10:30:00',
      max_capacity: 50,
      bookings_count: 0,
    });
    console.log(`Seeded default slot id=1 for site_id=1`);
  } else {
    const desiredCapacity = 100000;
    const desiredCount = Math.min(slot.bookings_count || 0, desiredCapacity);
    if (slot.max_capacity < desiredCapacity || slot.bookings_count !== desiredCount || slot.site_id !== 1) {
      await slot.update({ max_capacity: desiredCapacity, bookings_count: desiredCount, site_id: 1 });
      console.log(`Adjusted slot id=1 capacity/count/site -> capacity=${desiredCapacity}, bookings=${desiredCount}, site_id=1`);
    }
  }
}

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await sequelize.sync();
    await seedData();
    app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
