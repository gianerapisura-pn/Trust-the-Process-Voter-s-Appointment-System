const { Sequelize } = require('sequelize');

const DB_NAME = process.env.DB_NAME || 'StudentVoterAppointments';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASS = process.env.DB_PASS || '';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 3306;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'mysql',
  logging: false,
});

// Load models
const User = require('./user')(sequelize);
const Voter = require('./voter')(sequelize);
const Appointment = require('./appointment')(sequelize);
const AppointmentSite = require('./appointmentSite')(sequelize);
const AppointmentSlot = require('./appointmentSlot')(sequelize);

// Associations
Voter.hasMany(Appointment, { foreignKey: 'applicant_id', onDelete: 'CASCADE' });
Appointment.belongsTo(Voter, { foreignKey: 'applicant_id' });

AppointmentSlot.hasMany(Appointment, { foreignKey: 'slot_id', onDelete: 'CASCADE' });
Appointment.belongsTo(AppointmentSlot, { foreignKey: 'slot_id' });

AppointmentSite.hasMany(AppointmentSlot, { foreignKey: 'site_id', onDelete: 'CASCADE' });
AppointmentSlot.belongsTo(AppointmentSite, { foreignKey: 'site_id' });

// Export models and sequelize instance
module.exports = { sequelize, User, Voter, Appointment, AppointmentSite, AppointmentSlot };
