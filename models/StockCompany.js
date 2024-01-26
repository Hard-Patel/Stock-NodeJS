const { DataTypes } = require("sequelize");
const { sequelize } = require("../connection");

const Stock = sequelize.define("Stock", {
  // Model attributes are defined here
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  company: {
    type: DataTypes.STRING,
  },
  date: {
    type: DataTypes.DATE,
  },
  open: {
    type: DataTypes.INTEGER,
  },
  high: {
    type: DataTypes.INTEGER,
  },
  low: {
    type: DataTypes.INTEGER,
  },
  close: {
    type: DataTypes.INTEGER,
  },
  adjClose: {
    type: DataTypes.INTEGER,
  },
  volume: {
    type: DataTypes.INTEGER,
  },
  unique_date_company: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

module.exports.Stock = Stock;
