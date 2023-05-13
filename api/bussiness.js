const express = require("express");
const BusinessModel = require("../model/business_model");
const jwtAuthentication = require("../config/jwt_verification");
const app = express();

app.post("/", jwtAuthentication, async (req, res) => {
    if (!req.body.business_address) {
        res.status(406).json({
            success: false,
            message: "business_address is required",
        });
    } else if (!req.body.business_name) {
        res.status(406).json({
            success: false,
            message: "business_name is required",
        });
    } else if (!req.body.business_type) {
        res.status(406).json({
            success: false,
            message: "business_type is required",
        });
    } else if (!req.body.business_email) {
        res.status(406).json({
            success: false,
            message: "business_email is required",
        });
    } else if (!req.body.business_phone) {
        res.status(406).json({
            success: false,
            message: "business_phone is required",
        });
    } else if (!req.body.business_working_days) {
        res.status(406).json({
            success: false,
            message: "business_working_days is required",
        });
    } else if (!req.body.business_time || !req.body.business_time.from || !req.body.business_time.to) {
        res.status(406).json({

            success: false,
            message: "business time is required",
        });
    } else {
        var businessModel = new BusinessModel({
            user_id: req.user.id,
            business_name: req.body.business_name,
            business_address: req.body.business_address,
            business_type: req.body.business_type,
            business_email: req.body.business_email,
            business_phone: req.body.business_phone,
            business_working_days: req.body.business_working_days,
            business_time: req.body.business_time
        });
        await businessModel.save().then((data) => {
            res.status(200).send({
                status: true,
                message: "Your business service created successfully",
                data: {
                    id: data.id,
                    user_id: data.user_id,
                    business_name: data.business_name,
                    business_address: data.business_address,
                    business_type: data.business_type,
                    business_email: data.business_email,
                    business_phone: data.business_phone,
                    business_working_days: data.business_working_days,
                    business_time: data.business_time,
                },
            });
        }).catch((fail) => {
            if (fail) {
                if (fail.name === "MongoServerError" && fail.code === 11000) {
                    if (fail.keyValue.email) {
                        return res.status(409).send({
                            succes: false,
                            message: "business already exist!",
                        });
                    } else if (fail.keyValue.user_id) {
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

app.get("/", jwtAuthentication, async (req, res) => {
    await BusinessModel.find({user_id: req.user.id }).then((data) => {
        if (data.length === 0) {
            res.status(404).send({
                status: false,
                message: "business not found",
            });
        } else {
            res.status(200).send({
                status: true,
                message: "data fatched successfully",
                data: {
                    id: data[0].id,
                    user_id: data[0].user_id,
                    business_name: data[0].business_name,
                    business_address: data[0].business_address,
                    business_type: data[0].business_type,
                    business_email: data[0].business_email,
                    business_phone: data[0].business_phone,
                    business_working_days: data[0].business_working_days,
                    business_time: data[0].business_time,
                },

            });
        }
    }).catch((fail) => {
        if (fail) {
            if (fail.name === "MongoServerError" && fail.code === 11000) {
                if (fail.keyValue.email) {
                    return res.status(409).send({
                        succes: false,
                        message: "business already exist!",
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
    } else {
        await BusinessModel.updateOne({ _id: req.body.business_id, user_id: req.user.id }, req.body).then(async (data) => {
            if (data.length === 0) {
                res.status(404).send({
                    status: false,
                    message: "business not found",
                });
            } else {
                await BusinessModel.find({ _id: req.body.business_id, user_id: req.user.id }).then((data) => {
                    if (data.length === 0) {
                        res.status(404).send({
                            status: false,
                            message: "business not found",
                        });
                    } else {
                        res.status(200).send({
                            status: true,
                            message: "business updated successfully",
                            data: {
                                id: data[0].id,
                                user_id: data[0].user_id,
                                business_name: data[0].business_name,
                                business_address: data[0].business_address,
                                business_type: data[0].business_type,
                                business_email: data[0].business_email,
                                business_phone: data[0].business_phone,
                                business_working_days: data[0].business_working_days,
                                business_time: data[0].business_time,
                            },
                        });
                    }
                })
            }
        }).catch((fail) => {
            if (fail) {
                if (fail.name === "MongoServerError" && fail.code === 11000) {
                    if (fail.keyValue.email) {
                        return res.status(409).send({
                            succes: false,
                            message: "business already exist!",
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

module.exports = app;
