require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const PORT = 3500;
const cookieParser = require("cookie-parser");
const { logger } = require("./middleware/log");
const { errorHandler } = require("./middleware/errorHandling");
const { verifyJWT } = require("./middleware/verifyJWT");
const { corsOptions } = require("./config/corsHandling");
const { credentials } = require("./config/allowedOrigins");
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const connectDB = require("./config/connectToDB");

//Connect to MongoDB
connectDB();
global.dataDB = require("./middleware/globalHandler"); //Anytime the json file changes, this value also changes

app.use(credentials);
app.use(cors(corsOptions)); //cors will automaitcally call these functions
app.use(logger);
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.json());

app.use(express.static(path.join(__dirname, "Public")));
app.use("/subdir", express.static(path.join(__dirname, "Public")));

app.use("/", require("./routes/root"));
app.use("/subdir", require("./routes/subdir")); //any request going to /SUBDIR routes to subdir.js
app.use("/register", require("./routes/API/register"));
app.use("/auth", require("./routes/API/authentication"));
app.use("/logout", require("./routes/API/logOut"));
app.use("/refresh", require("./routes/API/refresh"));

app.use(verifyJWT);
app.use("/users", require("./routes/API/users"));

app.use(errorHandler); //checks for error

app.all("*", (req, res) => {
  if (req.accepts("html")) {
    res.status(404);
    res.sendFile(path.join(__dirname, "..", "views", "404.html"));
  }
});

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
