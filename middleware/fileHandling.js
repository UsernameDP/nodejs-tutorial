const fsPromises = require("fs").promises;
const path = require("path");
const { logEvent } = require("./log");

const readFromFile = async (filePath) => {
  try {
    const rawData = await fsPromises.readFile(filePath, "utf8");
    const data =
      path.extname(filePath) === ".json" ? JSON.parse(rawData) : rawData;

    logEvent(`Reading From ${filePath} was successful`, "filesStatusLog.txt");

    return data;
  } catch (err) {
    logEvent(`${err.name}\t${err.message}`, "filesErrorLog.txt");
  }
};

const writeToFile = async (filePath, message) => {
  try {
    message =
      path.extname(filePath) !== ".json"
        ? message
        : JSON.stringify(message, null, 2);
    await fsPromises.writeFile(filePath, message);

    logEvent(`Writing to ${filePath} was successful`, "filesStatusLog.txt");
  } catch (err) {
    logEvent(`${err.name}\t${err.message}`, "filesErrorLog.txt");
  }
};

const appendToFile = async (filePath, message) => {
  try {
    //if it is a JSON file Read from file, push the new message, and rewrite json
    if (path.extname(filePath) === ".json") {
      const rawData = await fsPromises.readFile(filePath, "utf8");
      const data = rawData.length <= 0 ? "[]" : rawData;
      message = JSON.stringify([...JSON.parse(data), message], null, 2);
      await fsPromises.writeFile(filePath, message);
    } else {
      await fsPromises.appendFile(filePath, message);
    }

    logEvent(`Appending to ${filePath} was successful`, "filesStatusLog.txt");
  } catch (err) {
    logEvent(`${err.name}\t${err.message}`, "filesErrorLog.txt");
  }
};

module.exports = { readFromFile, writeToFile, appendToFile };
