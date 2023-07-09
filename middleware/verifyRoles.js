const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const requiredRoles = [...allowedRoles];
    const rolesSent = Object.values(req.roles);

    const inside = requiredRoles
      .map((role) => rolesSent.includes(role))
      .find((bool) => bool === false);

    if (!inside) return res.sendStatus(401);

    next();
  };
};

module.exports = { verifyRoles };
