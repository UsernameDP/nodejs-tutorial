const UserModel = require("../model/Users");

const handleLogOut = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204);

  const refreshToken = cookies.jwt;

  res.clearCookie("jwt", { httpOnly: true });
  console.log(refreshToken);

  await UserModel.updateOne(
    { refreshToken: refreshToken },
    { $unset: { refreshToken: "" } }
  ).exec((err, result) => {
    if (err) return console.log(`${err.name}\t${err.message}`);

    console.log(result);
  });

  //if user was not found, yet the key still exists clear it

  res.sendStatus(204);
};

module.exports = { handleLogOut };
