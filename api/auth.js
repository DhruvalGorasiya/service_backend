const express = require("express");
const bcrypt = require("bcrypt");
const UserModel = require("../model/auth/user_model");
const jwt = require("jsonwebtoken");
const app = express();
const JWT_SECRET = "fram_app_api";
// const { transporter } = require("../services/nodemailer");
var otp = Math.random();
otp = otp * 1000000;
otp = parseInt(otp);
otp = 123456;

app.post("/sign_up", async (req, res) => {
  if (!req.body.userName) {
    res.status(406).json({
      success: false,
      message: "userName is Required",
    });
  } else if (!req.body.email) {
    res.status(406).json({
      success: false,
      message: "email is Required",
    });
  } else if (!req.body.password) {
    res.status(406).json({
      success: false,
      message: "password is Required",
    });
  } else if (!req.body.phone) {
    res.status(406).json({
      success: false,
      message: "phone is Required",
    });
  } else if (!req.body.userType) {
    res.status(406).json({
      success: false,
      message: "userType is Required",
    });
  } else if (req.body.userType !== "service_provider" && req.body.userType !== "user") {

    res.status(406).json({
      success: false,
      message: "Please enter a valid userType",
    });
  } else {
    var userModel = new UserModel({
      userName: req.body.userName,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
      phone: req.body.phone,
      userType: req.body.userType
    });
    // var mailOptions = {
    //   to: req.body.email,
    //   subject: "Otp for registration is: ",
    //   html:
    //     "<h3>OTP for account verification is </h3>" +
    //     "<h1 style='font-weight:bold;'>" +
    //     otp +
    //     "</h1>",
    // };

    await userModel
      .save()
      .then(async (data) => {
        const token = jwt.sign(
          {
            email: req.body.email,
            id: data.id,
            userType: data.userType
          },
          JWT_SECRET,
          {
            expiresIn: "24h",
          }
        );

        res.status(200).send({
          status: true,
          message: "User created successfully",
          data: {
            id: data.id,
            email: data.email,
            userName: data.userName,
            phone: data.phone,
            userType: data.userType,
            token: token,
          },
        });
        // await OtpModel.updateOne(
        //   { email: req.body.email },
        //   { email: req.body.email, otp: bcrypt.hashSync(otp.toString(), 10) },
        //   { upsert: true }
        // )
        //   // .then((otpData) => {
        //   //   transporter.sendMail(mailOptions, async (error, info) => {
        //   //     if (error) {
        //   //       return res.send({
        //   //         status: false,
        //   //         message: "Otp Error",
        //   //         error: { error },
        //   //       });
        //   //     } else {
        //   //       return res.status(200).json({
        //   //         succes: true,
        //   //         message: "Otp Send on your email",
        //   //         data: {
        //   //           email: req.body.email,
        //   //         },
        //   //       });
        //   //     }
        //   //   });
        //   // })
        //   .catch((fail) => {
        //     if (fail) {
        //       return res.status(400).send({
        //         succes: false,
        //         message: "Something went to wrong 1 ",
        //         error: { fail },
        //       });
        //     }
        //   });
      })
      .catch((fail) => {
        if (fail) {
          if (fail.name === "MongoServerError" && fail.code === 11000) {
            if (fail.keyValue.email) {
              return res.status(409).send({
                succes: false,
                message: "Email already exist!",
              });
            } else {
              return res.status(500).send({
                succes: false,
                message: "Something went to wrong",
                error: fail.message,
              });
            }
          } else {
            return res.status(500).send({
              succes: false,
              message: "Something went to wrong",
              error: fail.message,
            });
          }
        }
      });
  }
});

app.post("/login", async (req, res) => {

  // re.

  var { email, password } = req.body;
  if (!email || !password) {
    res.status(406).send({ message: "Please enter all fields" });
  }
  await UserModel.find({ email: req.body.email })
    .exec()
    .then((data) => {
      if (data.length < 1) {
        return res.status(404).send({
          status: false,
          message: "User not found",
        });
      } else {
        bcrypt.compare(
          req.body.password,
          data[0].password,
          async (err, result) => {
            if (!result) {
              return res.status(401).send({
                status: false,
                message: "Password not match",
                err: err,
              });
            } else {
              console.log
              const token = jwt.sign(
                {
                  email: req.body.email,
                  id: data[0].id,
                  userType: data[0].userType
                },
                JWT_SECRET,
                {
                  expiresIn: "24h",
                }
              );
              res.status(200).send({
                status: true,
                message: "User login successfully",
                data: {
                  id: data[0].id,
                  email: data[0].email,
                  phone: data[0].phone,
                  userName: data[0].userName,
                  userType: data[0].userType,
                  token: token,
                },
              });
              // var mailOptions = {
              //   to: email,
              //   subject: "Otp for registration is: ",
              //   html:
              //     "<h3>OTP for account verification is </h3>" +
              //     "<h1 style='font-weight:bold;'>" +
              //     otp +
              //     "</h1>",
              // };
              // await OtpModel.updateOne(
              //   { email: email },
              //   { email: email, otp: bcrypt.hashSync(otp.toString(), 10) },
              //   { upsert: true }
              // )
              //   .then((data) => {
              //     transporter.sendMail(mailOptions, async (error, info) => {
              //       if (error) {
              //         return res.send({
              //           status: false,
              //           message: "Otp Error",
              //           error: { error },
              //         });
              //       } else {
              //         return res.status(200).json({
              //           succes: true,
              //           message: "Otp Send on your email",
              //           data: {
              //             userId: email,
              //           },
              //         });
              //       }
              //     });
              //   })
              //   .catch((fail) => {
              //     if (fail) {
              //       return res.status(400).send({
              //         succes: false,
              //         message: "Something went to wrong 1",
              //         error: fail,
              //       });
              //     }
              //   });
            }
          }
        );
      }
    })
    .catch((err) => {
      res.status(500).send({
        status: false,
        message: "Something went wrong",
        err: { err },
      });
    });
});

// app.post("/verify_otp", async (req, res) => {
//   let email = req.body.email;
//   let otp = req.body.otp;
//   if (email && otp) {
//     const otpVerificationModel = await OtpModel.find({ email });
//     if (otpVerificationModel.length <= 0) {
//       res.status(404).send({
//         status: false,
//         message: "Otp not found Please Login or SignUp to create new Otp",
//       });
//     } else {
//       let hashOtp = otpVerificationModel[0].otp;
//       if (await bcrypt.compare(otp, hashOtp)) {
// const token = jwt.sign(
//   {
//     id: email,
//   },
//   JWT_SECRET,
//   {
//     expiresIn: "24h",
//   }
// );
//         const userModelList = await userModel.find({ email: email }).exec();
//         res.status(200).send({
//           status: true,
//           message: "Your profile created successfully",
//           data: {
//             id: userModelList[0].id,
//             email: userModelList[0].email,
//             username: userModelList[0].username,
//             phone: userModelList[0].phone,
//             token: token,
//           },
//         });
//         await OtpModel.deleteMany({ email });
//       } else {
//         res.status(400).send({
//           status: false,
//           message: "invalid otp",
//         });
//       }
//     }
//   } else {
//     res.status(400).send({
//       status: false,
//       message: "otp and email is required",
//     });
//   }
// });

// app.post("/resend_otp", async (req, res) => {
//   let email = req.body.email;
//   var mailOptions = {
//     to: email,
//     subject: "Otp for registration is: ",
//     html:
//       "<h3>OTP for account verification is </h3>" +
//       "<h1 style='font-weight:bold;'>" +
//       otp +
//       "</h1>",
//   };
//   if (email) {
//     OtpModel.find({ email: email }).then((data) => {
//       if (data.length) {
//         OtpModel.updateOne(
//           { email: email },
//           { email: email, otp: bcrypt.hashSync(otp.toString(), 10) }
//         )
//           .then((data) => {
//             transporter.sendMail(mailOptions, async (error, info) => {
//               if (error) {
//                 return res.send({
//                   status: false,
//                   message: "Otp send error",
//                   error: { error },
//                 });
//               } else {
//                 return res.status(200).json({
//                   succes: true,
//                   message: "Otp Resended successfully",
//                   data: {
//                     userId: email,
//                   },
//                 });
//               }
//             });
//           })
//           .catch((fail) => {
//             return res.status(400).send({
//               succes: false,
//               message: "Something went to wrong 1",
//               error: fail,
//             });
//           });
//       }
//     });
//   } else {
//     res.status(400).send({
//       status: false,
//       message: "email is required",
//     });
//   }
// });

module.exports = app;
