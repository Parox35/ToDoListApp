// models/Task.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config');
const List = require('./List');

const Task = sequelize.define('Task', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  listId: {
    type: DataTypes.INTEGER,
    references: {
      model: List,
      key: 'id',
    },
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  }
});

// Définir l'association
Task.belongsTo(List, { foreignKey: 'listId' });
List.hasMany(Task, { foreignKey: 'listId' });

module.exports = Task;
