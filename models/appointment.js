const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Appointment = sequelize.define('Appointment', {
    appointment_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    applicant_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    slot_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    appointment_code: {
      type: DataTypes.STRING(15),
      unique: true
    },
    booking_datetime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false
    }
  }, {
    tableName: 'appointment',
    timestamps: false
  });

  return Appointment;
};
