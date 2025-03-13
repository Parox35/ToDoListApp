const { DataTypes } = require('sequelize');
const sequelize = require('../config');

const List = sequelize.define('List', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = List;
