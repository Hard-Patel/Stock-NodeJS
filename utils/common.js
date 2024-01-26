const EventEmitter = require("events");

const updateClient = async (status) => {
  console.log("updateClient status: ", status);
  const eventEmitter = new EventEmitter();
  eventEmitter.emit("market-status", status);
};

// Function to handle circular references in JSON.stringify
const replacer = () => {
  const seen = new WeakSet();
  return (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};

module.exports = { updateClient, replacer };
