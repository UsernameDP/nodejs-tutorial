const { format } = require("date-fns");
const { v4: uuid } = require("uuid");

const fs = require("fs");
const fsPromise = require("fs").promises;
const path = require("path");

const logEvent = async (mes, fileName) => {
  const folderPath = path.join(__dirname, "..", "Logs");
  const filePath = path.join(folderPath, fileName);
  if (!fs.existsSync(folderPath)) {
    fs.mkdir(path.join(__dirname, fileName));
  }

  const date = `${format(new Date(), "yyyy/MM/dd\tHH:mm:ss")}`;
  let textToAppend = `${date}\t${uuid()}\t${mes}\n`;
  await fsPromise.appendFile(filePath, textToAppend);
};

const logger = (req, res, next) => {
  //if there is an error, then this does not run
  logEvent(`${req.method}\t${req.headers.origin}\t${req.url}`, "reqLog.txt");
  console.log(`${req.method}\t${req.headers.origin}\t${req.url}`);
  next();
};

module.exports = { logger, logEvent };
