const allowedOrigins = ["https://www.google.com"]; //Make sure there are no "/" at the end

const credentials = (req, res, next) => {
  if (allowedOrigins.includes(req.headers.origins)) {
    res.header("Access-Control-Allow-Credentials", true);
  }
  next();
};

module.exports = { allowedOrigins, credentials };
