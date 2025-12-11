const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const AppointmentSite = sequelize.define('AppointmentSite', {
    site_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    site_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }, {
    tableName: 'appointment_site',
    timestamps: false,
  });

  return AppointmentSite;
};
