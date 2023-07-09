const jwt = require("jsonwebtoken"); //imports JWT

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401);
  //check if header recieved anything

  //Bearer Token <- format when consolelogged

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403); //invalid token
    req.roles = decoded.roles;
    next();
  });
};

module.exports = { verifyJWT };
