const express = require("express");
const app = express();
const Auth = require("./api/auth");
const Request = require("./api/request");
const businesses = require("./api/bussiness");
const bussinessService = require("./api/bussiness_service");
require("./config/db_connect");
const bodyParser = require("body-parser");
const cors = require("cors");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use("/auth", Auth);
app.use("/businesses", businesses);
app.use("/businesses/services", bussinessService);
app.use("/request", Request);

app.get('*', (req, res)=> {
  console.log(req.originalUrl);
  res.status(404).send({
    status: false,
    message: "invalid route",
  });
});
app.listen(3000, (error) => {
  if (error) {
    console.log(`${error}  some error is found`);
  } else {
    console.log("server connected with port 3000");
  }
});
