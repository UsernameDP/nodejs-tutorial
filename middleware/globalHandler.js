const path = require("path");
const fs = require("fs");
const { writeToFile, readFromFile } = require("./fileHandling");

const JSONFilePath = path.join(__dirname, "..", "model", "users.json");

try {
  global.dataDB = require("../model/users.json");
} catch (err) {
  global.dataDB = [];
  writeToFile(JSONFilePath, []);
}

fs.watch(JSONFilePath, async (eventType, fileName) => {
  if (eventType === "change") {
    global.dataDB = await readFromFile(JSONFilePath);
  }
});

module.exports = global.dataDB;
