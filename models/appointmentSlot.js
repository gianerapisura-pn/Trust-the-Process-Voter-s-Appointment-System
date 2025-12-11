const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const AppointmentSlot = sequelize.define('AppointmentSlot', {
    slot_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    site_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    slot_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    end_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    max_capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    bookings_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  }, {
    tableName: 'appointment_slot',
    timestamps: false,
  });

  return AppointmentSlot;
};
