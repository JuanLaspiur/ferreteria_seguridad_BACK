const { response } = require("express");

const isAdminRole = (req, res = response, next) => {
  if (!req.user) {
    return res.status(500).json({
      msg: "Mal orden de middlewares",
    });
  }

  const { role, name } = req.user;

  if (role !== "ADMIN_ROLE")
    return res.status(401).json({
      msg: `Usuario: ${name} - no es administrador`,
    });
  next();
};

const hasRole =
  (...roles) =>
  (req, res = response, next) => {
    if (!req.user) return res.status(500).json({ msg: "Error middlewares" });
    if (!roles.includes(req.user.role))
      return res.status(401).json({
        msg: `No tienes los permisos necesarios`,
      });
    next();
  };

module.exports = {
  isAdminRole,
  hasRole,
};
