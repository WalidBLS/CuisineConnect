const { DataTypes } = require('sequelize');
const sequelize = require('../lib/sequelize');

module.exports = sequelize.define(
    'User',
    {
        username: {
            type: DataTypes.STRING,
            unique: true,
            validate: {
                len: [3, 32],
            },
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM('ADMIN', 'USER'),
            allowNull: false,
            defaultValue: 'USER',
        },
    },
    {
        tableName: 'users',
        paranoid: true,
    },
);