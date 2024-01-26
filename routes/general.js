const router = require("express").Router();
const yahooFinance = require("yahoo-finance");
const { Stock } = require("../models/StockCompany");
const {
  MARKET_STATUS_ENDPOINT,
  ALPHA_VANTAGE_API_KEY,
} = require("../utils/constants");
const axios = require("axios");
const moment = require("moment");

// 8DY8C9XBD2R04EUG

router.get("/fetch/:ticker", async (req, res) => {
  const ticker = req.params.ticker ?? "aapl";
  try {
    const requestBody = {
      ticker: ticker,
      start_date: "2022-01-01",
      end_date: "2022-12-31",
      window_size: 5,
    };

    const response = await axios.post(
      "http://127.0.0.1:5000/predict_stock",
      requestBody
    );

    const current = await axios.get(
      `http://127.0.0.1:5000/stock_info/${requestBody.ticker}`
    );

    if (current) {
      res.send({
        msg: "Data fetched successfully",
        data: { stock_info: current.data, predictions: response.data },
      });
      return;
    }
    res.send({ msg: "Invalid request" });
  } catch (e) {
    console.log("error: ", e);
    res.send({ msg: "Something went wrong" });
  }
});

router.get("/market-status/:ticker", async (req, res) => {
  const ticker = req.params.ticker ?? "aapl";
  try {
    const today = moment().format("YYYY-MM-DD");
    const fifteenDaysAgo = moment().subtract(3, "days").format("YYYY-MM-DD");
    const requestBody = {
      ticker: ticker,
      start_date: fifteenDaysAgo,
      end_date: today,
    };

    // const response = await axios.post(
    //   "http://127.0.0.1:5000/predict_stock",
    //   requestBody
    // );

    const current = await axios.post(
      `http://127.0.0.1:5000/stock_history`,
      requestBody
    );
    console.log("current: ", JSON.stringify(current.data));

    if (current) {
      res.send({
        msg: "Data fetched successfully",
        data: { stock_info: current.data },
      });
      return;
    }
    res.send({ msg: "Invalid request" });
  } catch (e) {
    console.log("error: ", e);
    res.send({ msg: "Something went wrong" });
  }
});

module.exports.generalRouter = router;
