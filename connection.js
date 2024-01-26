const { Sequelize } = require('sequelize');

// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize('stock', 'root', '', {
  host: 'localhost',
  dialect: 'mysql', // mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */
  logging: false
});

module.exports.sequelize = sequelize;