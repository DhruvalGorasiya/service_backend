const jwt = require("jsonwebtoken");
const UserModel = require("../model/auth/user_model");
const config = process.env;

const verifyToken = async (req, res, next) => {
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
    await UserModel.find({ _id: req.user.id })
      .exec()
      .then((data) => {
        if (data.length < 1) {
          return res.status(404).send({
            status: false,
            message: "Invalid Token",
          });
        } else {
          return next();
        }
      })
      .catch((err) => {
        res.status(500).send({
          status: false,
          message: "Something went wrong",
          err: { err },
        });
      });
  } catch (err) {
    return res.status(401).send({
      status: false,
      message: "Invalid Token"
    });
  }
};
module.exports = verifyToken;