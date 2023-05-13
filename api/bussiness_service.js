const express = require("express");
const BusinessServiceModel = require("../model/business_service_model");
const jwtAuthentication = require("../config/jwt_verification");
const app = express();

app.post("/", jwtAuthentication, async (req, res) => {
    if (!req.body.business_id) {
        res.status(406).json({
            success: false,
            message: "business_id is required",
        });
    } else if (!req.body.service_name) {
        res.status(406).json({
            success: false,
            message: "service_name is required",
        });
    } else if (!req.body.service_description) {
        res.status(406).json({
            success: false,
            message: "service_description is required",

        });
    } else if (!req.body.is_available) {
        res.status(406).json({
            success: false,
            message: "is_available is required",
        });
    } else if (!req.body.business_type) {
        res.status(406).json({
            success: false,
            message: "business_type is required",
        });
    } else if (!req.body.service_price) {
        res.status(406).json({
            success: false,
            message: "service_price is required",
        });
    } else {
        var businessServiceModel = new BusinessServiceModel({
            user_id: req.user.id,
            business_id: req.body.business_id,
            service_name: req.body.service_name,
            service_description: req.body.service_description,
            service_price: req.body.service_price,
            business_type: req.body.business_type,
            is_available: req.body.is_available
        });
        await businessServiceModel.save().then((data) => {
            res.status(200).send({
                status: true,
                message: "Your service created successfully",
                data: {
                    id: data.id,
                    user_id: data.user_id,
                    business_id: data.business_id,
                    searvice_name: data.service_name,
                    business_type: req.body.business_type,

                    searvice_description: data.service_description,
                    searvice_price: data.service_price,
                    is_available: data.is_available
                },
            });
        }).catch((fail) => {
            if (fail) {
                if (fail.name === "MongoServerError" && fail.code === 11000) {
                    if (fail.keyValue.email) {
                        return res.status(409).send({
                            succes: false,
                            message: "service already exist!",
                        });
                    } else if (fail.keyValue.userID) {
                        return res.status(409).send({
                            succes: false,
                            message: "User already have a business!",
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

app.delete("/", jwtAuthentication, async (req, res) => {
    if (!req.body.business_id) {
        res.status(406).json({
            success: false,
            message: "business_id is required",
        });
    } else if (!req.body.service_id) {
        res.status(406).json({
            success: false,
            message: "service_id is required",
        });
    } else {
        await BusinessServiceModel.deleteOne({ _id: req.body.service_id, user_id: req.user.id, business_id: req.body.business_id }).then((data) => {

            if (data.length === 0 || data.deletedCount === 0) {
                res.status(404).send({
                    status: false,
                    message: "service not found",
                });
            } else {
                res.status(200).send({
                    status: true,
                    message: "Your service successfully deleted",
                    data: data
                });
            }
        }).catch((fail) => {
            console.log(fail);
            if (fail) {
                if (fail.name === "MongoServerError" && fail.code === 11000) {
                    if (fail.keyValue.email) {
                        return res.status(409).send({
                            succes: false,
                            message: "service already exist!",
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

app.get("/search", jwtAuthentication, async (req, res) => {
    console.log(req.query.key);
    if (req.user.userType === "user") {
        await BusinessServiceModel.find(
            {
                "$or": [
                    { business_type: { $regex: req.query.key } }

                ]
            }

        ).then((data) => {
            if (data.length === 0) {
                res.status(404).send({
                    status: false,
                    message: "service not found",
                });
            } else {
                const reCreatedData = [];
                data.forEach((element) => {
                    reCreatedData.push({
                        id: element.id,
                        user_id: element.user_id,
                        business_id: element.business_id,
                        service_name: element.service_name,
                        service_description: element.service_description,
                        service_price: element.service_price,
                        business_type: element.business_type,
                        is_available: element.is_available
                    });
                })
                res.status(200).send({
                    status: true,
                    message: "data fatched successfully",
                    length: data.length,
                    data: reCreatedData
                });
            }
        }).catch((fail) => {
            console.log(fail);
            if (fail) {
                if (fail.name === "MongoServerError" && fail.code === 11000) {
                    if (fail.keyValue.email) {
                        return res.status(409).send({
                            succes: false,
                            message: "service already exist!",
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
    } else {
        res.status(406).json({
            success: false,
            message: "This api is only used by user",
        });
    }
});

app.post("/list", jwtAuthentication, async (req, res) => {
    await BusinessServiceModel.find({ user_id: req.user.id }).then((data) => {

        if (data.length === 0) {

            res.status(404).send({
                status: false,
                message: "service not found",
            });
        } else {
            res.status(200).send({
                status: true,
                message: "data fatched successfully",
                length: data.length,
                data: data

            });
        }
    }).catch((fail) => {
        console.log(fail);
        if (fail) {
            if (fail.name === "MongoServerError" && fail.code === 11000) {
                if (fail.keyValue.email) {
                    return res.status(409).send({
                        succes: false,
                        message: "service already exist!",
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

});

app.put("/", jwtAuthentication, async (req, res) => {
    if (!req.body.business_id) {
        res.status(406).json({
            success: false,
            message: "business_id is required",
        });
    } else if (!req.body.service_id) {
        res.status(406).json({
            success: false,
            message: "service_id is required",

        });
    } else {
        await BusinessServiceModel.updateOne({ _id: req.body.service_id, user_id: req.user.id, business_id: req.body.business_id }, req.body).then(async (data) => {
            if (data.length === 0) {
                res.status(404).send({
                    status: false,
                    message: "service not found",
                });
            } else {
                await BusinessServiceModel.find({ _id: req.body.service_id, business_id: req.body.business_id, user_id: req.user.id }).then((data) => {
                    if (data.length === 0) {

                        res.status(404).send({
                            status: false,
                            message: "service not found",
                        });
                    } else {
                        res.status(200).send({
                            status: true,
                            message: "service updated successfully",
                            data: data[0]
                        });
                    }
                })
            }
        }).catch((fail) => {
            if (fail) {
                return res.status(500).send({
                    succes: false,
                    message: "Something went to wrong",
                    error: fail.message,
                });

            }
        });
    }
});
module.exports = app;
