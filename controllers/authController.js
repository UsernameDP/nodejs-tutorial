const bcrypt = require("bcrypt");
const UserModel = require("../model/Users");

const jwt = require("jsonwebtoken"); //imports JWT

const handleLogin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json("Username and password are required!");

  const foundUser = await UserModel.findOne({ username: username });
  if (!foundUser)
    return res.status(401).json("Unauthorized; No username found");

  const match = await bcrypt.compare(password, foundUser.password);
  if (match) {
    // create JWTs
    const accessToken = await jwt.sign(
      { username: foundUser.username, roles: foundUser.roles },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );
    const refreshToken = await jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    await UserModel.updateOne(
      { username: foundUser.username },
      { refreshToken: refreshToken }
    );

    // Saving refreshToken with current user
    await res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken });
  } else {
    res.status(400).json("The password does not match");
  }
};

module.exports = { handleLogin };
