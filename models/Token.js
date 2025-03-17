const { DataTypes } = require('sequelize');
const sequelize = require('../config');

const tokenSchema = sequelize.define('token', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        expires: 3600,
    },
});

module.exports = tokenSchema;