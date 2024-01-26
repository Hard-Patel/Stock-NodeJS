"use strict";

const moment = require("moment");
const yahooFinance = require("yahoo-finance");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let quotes = await yahooFinance.historical({
      symbol: "AAPL",
      from: "2017-01-01",
      to: moment().format("YYYY-MM-DD"),
      period: "d", // 'd' (daily), 'w' (weekly), 'm' (monthly), 'v' (dividends only)
    });
    quotes = quotes.map((quote) => {
      return {
        date: quote.date,
        company: quote.symbol,
        open: quote.open,
        high: quote.high,
        low: quote.low,
        close: quote.close,
        adjClose: quote.adjClose,
        volume: quote.volume,
        unique_date_company: quote.date + quote.symbol,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });
    await queryInterface.bulkInsert("Stocks", quotes);
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Stocks", null, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};

//
// const stock = await Stock.create({
//   date: quotes[0].date,
//   company: quotes[0].symbol,
//   open: quotes[0].open,
//   high: quotes[0].high,
//   low: quotes[0].low,
//   close: quotes[0].close,
//   adjClose: quotes[0].adjClose,
//   volume: quotes[0].volume,
//   unique_date_company: quotes[0].date + quotes[0].symbol,
// });
// res.send({ msg: "Data fetched successfully", data: stock });
// }
