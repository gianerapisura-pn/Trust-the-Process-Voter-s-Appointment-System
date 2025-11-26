const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('studentvoterappointments', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false
});

// Load models
const User = require('./user')(sequelize);
const Voter = require('./voter')(sequelize);
const Appointment = require('./appointment')(sequelize);

// Associations
Voter.hasMany(Appointment, { foreignKey: 'applicant_id', onDelete: 'CASCADE' });
Appointment.belongsTo(Voter, { foreignKey: 'applicant_id' });

// Export models and sequelize
module.exports = { sequelize, User, Voter, Appointment };
