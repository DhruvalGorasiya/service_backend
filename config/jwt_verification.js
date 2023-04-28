const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).send(
        {
            status: false,
            message: "Unauthorized",
          }
    );
  }
  try {
    const decoded = jwt.verify(token, "fram_app_api");
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

module.exports = verifyToken;