const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Voter = sequelize.define('Voter', {
    applicant_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    first_name: { type: DataTypes.STRING(100), allowNull: false },
    last_name: { type: DataTypes.STRING(100), allowNull: false },
    middle_name: { type: DataTypes.STRING(100) },
    suffix: { type: DataTypes.STRING(50) },
    birthday: { type: DataTypes.DATEONLY },
    gender: { type: DataTypes.ENUM('Male', 'Female', 'Other') },
    nationality: { type: DataTypes.STRING(100) },
    home_address: { type: DataTypes.STRING(255) },
    zip_code: { type: DataTypes.STRING(10) },
    email_address: { type: DataTypes.STRING(255) },
    mobile_number: { type: DataTypes.STRING(20) }
  }, {
    tableName: 'voter_applicant',
    timestamps: false
  });

  return Voter;
};
