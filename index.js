require("dotenv").config();
const express = require("express");
const { Server } = require("socket.io");
// const cronJobSchedule = require("./cron-job");

const sequelize = require("./connection");
const { generalRouter } = require("./routes/general");
const { createServer } = require("http");
const axios = require("axios");

const app = express();
const SERVER_PORT = process.env.SERVER_PORT || 3000;
const SOCKET_PORT = process.env.SOCKET_PORT || 3000;

const httpServer = createServer(app);
const io = new Server(httpServer);

// cronJobSchedule.initScheduledJobs();
app.use("/api/v1/", generalRouter);

async function getLastTradedPrice(ticker) {
  try {
    const current = await axios.get(
      `http://127.0.0.1:5000/stock_info/${ticker}`
    );
    console.log("stock: ", current.data.last_price);
    return current.data.last_price;
  } catch (error) {
    console.error("Error fetching stock data:", error.message);
    return null;
  }
}

io.on("connection", function (socket) {
  let interval;
  socket.on("join", (ticker) => {
    if (ticker) {
      socket.join(ticker);
      interval = setInterval(async () => {
        const stockData = await getLastTradedPrice(ticker); // Replace with your desired stock symbol
        io.to(ticker).emit("stock_data", { price: stockData });
      }, 10000);
    }
  });

  socket.on("disconnect", (reason) => {
    clearInterval(interval);
    console.log("Socket disconnected with client because ", reason);
  });
});

// module.exports.io = io;

// Define a route
app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

sequelize.sequelize.sync().then(() => {
  console.log("Database connected");
});

// Start the socket server
httpServer.listen(SOCKET_PORT, () => {
  console.log(`Socket server is listening at http://localhost:${SOCKET_PORT}`);
});

// Start the server
app.listen(SERVER_PORT, () => {
  console.log(`Server is listening at http://localhost:${SERVER_PORT}`);
});
