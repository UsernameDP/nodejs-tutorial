const { allowedOrigins } = require("./allowedOrigins");

const corsOptions = {
  origin: (origin, callback) => {
    //origin e.g https://www.google.com
    if (allowedOrigins.indexOf(origin) != -1 || !origin) {
      //Checks if origin is in whitelist, or from localserver
      //Remove !origin after dev, otherwise, all local servers will be whitelisted
      callback(null, true);
      //null stands for no error
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200 //Ok sign
};

module.exports = { corsOptions };
