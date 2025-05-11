const jwt = require("jsonwebtoken");

const verifyToken = (roles = []) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, "secret-key", (err, user) => {
      if (err) return res.status(403).json({ message: "Invalid token" });

      if (roles.length && !roles.includes(user.role)) {
        return res.status(403).json({ message: "Access denied" });
      }

      req.user = user; // attach user to request
      next();
    });
  };
};

module.exports = verifyToken;
