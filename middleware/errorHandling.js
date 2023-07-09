const { logEvent } = require("../middleware/log");

const errorHandler = (err, req, res, next) => {
  //it automatically only sends an err if the error exists
  logEvent(`${err.name}\t${err.message}`, `errLog.txt`);
  console.log(err);
  res.status(500).send(err.message);
};

module.exports = { errorHandler };
