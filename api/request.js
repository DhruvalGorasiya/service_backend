const express = require("express");
const RequestModel = require("../model/service_request_model");
const jwtAuthentication = require("../config/jwt_verification");
const app = express();

app.post("/send", jwtAuthentication, async (req, res) => {
    if (req.user.userType === "user") {
        if (!req.body.service_id) {
            res.status(406).json({
                success: false,
                message: "service_id is required",
            });
        } else if (!req.body.service_provider_id) {
            res.status(406).json({
                success: false,
                message: "service_provider_id is required",
            });
        } else if (!req.body.service_name) {
            res.status(406).json({
                success: false,
                message: "service_name is required",
            });
        } else if (!req.body.business_type) {
            res.status(406).json({
                success: false,
                message: "business_type is required",
            });
        } else if (!req.body.date) {
            res.status(406).json({
                success: false,
                message: "date is required",
            });
        } else {
            RequestModel.find({ user_id: req.user.id, service_id: req.body.service_id }).then(async (data) => {
                if (data.length === 0) {
                    var requestModel = new RequestModel({
                        user_id: req.user.id,
                        service_id: req.body.service_id,
                        service_provider_id: req.body.service_provider_id,
                        service_name: req.body.service_name,
                        business_type: req.body.business_type,
                        date: req.body.date,
                        request_status: 2
                    });
                    await requestModel.save().then((data) => {
                        res.status(200).send({
                            status: true,
                            message: "Your service created successfully",
                            data: {
                                id: data.id,
                                user_id: data.user_id,
                                service_id: data.service_id,
                                service_provider_id: data.service_provider_id,
                                service_name: data.service_name,
                                business_type: data.business_type,
                                date: data.date,
                                request_status: data.request_status
                            },
                        });
                    })
                } else {
                    return res.status(409).send({
                        succes: false,
                        message: "your request already exist!",
                    });
                }
            }).catch((fail) => {
                if (fail) {
                    if (fail.name === "MongoServerError" && fail.code === 11000) {
                        if (fail.keyValue.service_id) {
                            return res.status(409).send({
                                succes: false,
                                message: "your request already exist!",
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
    } else {
        res.status(406).json({
            success: false,
            message: "This api is only used by user",
        });
    }
});

app.get("/get", jwtAuthentication, async (req, res) => {

    if (!req.user.id) {
        res.status(406).json({
            success: false,
            message: "service_id is required",
        });
    } else {
        let searchMap;
        if (req.user.userType == "user") {
            searchMap = {
                user_id: req.user.id
            }
        } else {
            searchMap = {
                user_id: req.user.id
            }
        }
        await RequestModel.find(searchMap).then((data) => {
            res.status(200).send({
                status: true,
                message: "data fatched",
                data: data
            });
        }).catch((fail) => {
            if (fail) {
                if (fail.name === "MongoServerError" && fail.code === 11000) {
                    if (fail.keyValue.email) {
                        return res.status(409).send({
                            succes: false,
                            message: "service already exist!",
                        },);
                    } else if (fail.keyValue.userID) {
                        return res.status(409).send({
                            succes: false,
                            message: "User already have a business!",
                        },);
                    } else {
                        return res.status(500).send({
                            succes: false,
                            message: "Something went to wrong",
                            error: fail.message,
                        },);
                    }
                } else {
                    return res.status(500).send({
                        succes: false,
                        message: "Something went to wrong",
                        error: fail.message,
                    },);
                }
            }
        },);
    }
}
);

module.exports = app;