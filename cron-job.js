const cron = require("node-cron");
const moment = require("moment");
const yahooFinance = require("yahoo-finance");
const { io } = require("./index");

const checkMarketStatus = async () => {
  try {
    let quotes = await yahooFinance.historical({
      symbol: "AAPL",
      from: moment().subtract(1, "week").format("YYYY-MM-DD"),
      to: moment().format("YYYY-MM-DD"),
      period: "d", // 'd' (daily), 'w' (weekly), 'm' (monthly), 'v' (dividends only)
    });
    // console.log('response: ', quotes);

    const lastRefreshed = moment(quotes[0].date);
    const lastRefreshedDate = lastRefreshed.format("YYYY-MM-DD");
    const currentDate = moment().format("YYYY-MM-DD");

    // updateClient(lastRefreshedDate);

    io.on("connection", function (socket) {
      console.log("Socket connected with client.");
      socket.on("disconnect", (reason) => {
        console.log("Socket disconnected with client because ", reason);
      });
      
      socket.emit("market-status", () => {
        console.log("Socket got update from eventEmitter ", lastRefreshedDate);
      });
    });
    

    if (lastRefreshed && currentDate) {
      // Compare the date to determine if the market is open or closed
      if (
        lastRefreshedDate == currentDate &&
        lastRefreshed.format("HH") >= 9 &&
        lastRefreshed.format("HH") <= 17
      ) {
        console.log("The stock market is currently open at: ", currentDate);
      } else {
        console.log("The stock market is currently closed at: ", currentDate);
      }
    } else {
      console.log("Unable to retrieve market status at: ", currentDate);
    }
  } catch (e) {
    console.log("error: ", e);
  }
};

exports.initScheduledJobs = () => {
  const scheduledJobFunction = cron.schedule("*/5 * * * * *", () => {
    checkMarketStatus();
  });

  scheduledJobFunction.start();
};
