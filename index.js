const express = require("express");
const app = express();
const Auth = require("./api/auth");
const Bussnisses = require("./api/bussiness");
// const UploadImage = require("./api/upload_image");
require("./config/db_connect");
const bodyParser = require("body-parser");
const cors = require("cors");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());


// app.use("/uploads", express.static("uploads"));
app.use("/auth", Auth);
app.use("/bussnisses", Bussnisses);
// app.use("/image", UploadImage);


app.listen(3000, (error) => {
  if (error) {
    console.log(`${error}  some error is found`);
  } else {
    console.log("server connected with port 3000");
  }
});
