const { DataTypes } = require('sequelize');
const sequelize = require('../config');
const List = require('./List');


const User = sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});


User.belongsToMany(List, { through: 'UserLists' });
List.belongsToMany(User, { through: 'UserLists' });


module.exports = User;
