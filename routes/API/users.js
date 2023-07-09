const express = require("express");
const ROLES_LIST = require("../../config/rolesList");
const router = express.Router();
const {
  getAll,
  getSpecific,
  updateUser,
} = require("../../controllers/usersController");
const { verifyRoles } = require("../../middleware/verifyRoles");

router.route("/").get(getAll).post(updateUser);

router.route("/:username").get(getSpecific);

module.exports = router;
