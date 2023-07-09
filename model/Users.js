const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String, //defines the dataT of object
    required: true, //Makes sure this object specified, else throw err prob
  },
  roles: {
    user: {
      type: Number,
      default: 2022, //since default, no need to mention when adding to DB
    },
    admin: Number,
  },
  password: {
    type: String,
    required: true,
  },
  refreshToken: String, //type is the default property that needs to be specified
});

module.exports = mongoose.model("users", userSchema);
