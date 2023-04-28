const express = require("express");
const bussnissModel = require("../model/bussniss_model");
const jwtAuthentication = require("../config/jwt_verification");

const app = express();

app.post("/add",jwtAuthentication,(req, res)=>{
res.status(200).send({
    "user": req.user
})
});

module.exports = app;