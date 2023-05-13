const mongoose = require("mongoose");

const requestSchema = mongoose.Schema(
  {
    service_id: { type: mongoose.ObjectId, required: true},
    user_id: {
      type: String,
      require: true,
    },
    service_provider_id: {
      type: String,
      require: true,
    },
    service_name: {
      type: String,
      require: true
    },
    business_type: {
      type: String,
      require: true
    },
    date: {
      type: String,
      require: true,
    },
    request_status: {
      type: Number,
      default: 2
    },
  },
  {
    collection: "request",
    versionKey: false,
    timestamps: true,
    toObject: {
      transform: function (doc, ret, options) {
        ret.id = ret._id;
        return ret;
      },
    },
  }
);

const requestModel = mongoose.model(
  "requestSchema",
  requestSchema
);

module.exports = requestModel;
