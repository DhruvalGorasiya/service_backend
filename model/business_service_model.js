const mongoose = require("mongoose");

const BusinesseServiceSchema = mongoose.Schema(
  {
    business_id: { type: mongoose.ObjectId, required: true },
    user_id: { type: mongoose.ObjectId, required: true },
    service_name: {
      type: String,
      require: true
    },
    service_description: {
      type: String,
      require: true
    },
    business_type: {
      type: String,
      require: true
    },
    service_price: {
      type: Number,
      require: true
    },
    is_available: {
      type: Boolean,
      default: true,
    },
  },
  {
    collection: "businesse_service",
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

const businesseServiceModel = mongoose.model(
  "businesseServiceSchema",
  BusinesseServiceSchema
);

module.exports = businesseServiceModel;
