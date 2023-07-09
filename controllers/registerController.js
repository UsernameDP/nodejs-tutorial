const bcrypt = require("bcrypt");

const UserModel = require("../model/Users");

async function registerUser(req, res) {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json("Username and password are required!");

  const duplicate = await UserModel.findOne({ username: username }).exec();
  if (duplicate) return res.sendStatus(409);

  try {
    const result = await UserModel.create({
      username: username,
      password: await bcrypt.hash(password, 10),
    });

    console.log(result);

    res.status(201).json(`${username} was created`);
  } catch (err) {
    res.status(500).json(`Error Message: ${err.name}\t${err.message}`);
  }
}

module.exports = { registerUser };
