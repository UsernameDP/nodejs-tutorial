const UserModel = require("../model/Users");

const getAll = async (req, res) => {
  const allUsers = await UserModel.find({}).exec();
  res.status(201).json(allUsers);
};
const getSpecific = async (req, res) => {
  const username = req.params.username;
  const foundUser = await UserModel.findOne({ username: username }).exec();
  if (!foundUser)
    return res.status(401).json(`user ${username} does not exist`);

  res.json(foundUser);
};

const updateUser = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.status(401).json("There is no refreshToken");

  const refreshToken = cookies.jwt;

  const { username } = req.body;

  if (!username)
    return res.status(401).json(`Body needs to include 'username'`);

  const duplicate = await UserModel.findOne({ username: username });
  if (duplicate)
    return res
      .status(409)
      .json(`There is already a username with the username : ${username}`);

  await UserModel.updateOne(
    { refreshToken: refreshToken },
    { $set: { username: username } }
  ).exec((err, result) => {
    if (err) return console.err(err);
    console.log(result);
  });
};

module.exports = { getAll, getSpecific, updateUser };
