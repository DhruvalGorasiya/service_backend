const mongoose = require("mongoose");

const businessSchema = mongoose.Schema(
  {
    user_id: { type: mongoose.ObjectId, required: true, unique: true },
    business_name: {
      type: String,
      require: true,
    },
    business_address: {
      type: String,
      require: true,
    },
    business_category: {
      type: String,
      require: true,
    },
    business_type: {
      type: String,
      require: true,
    },
    business_location: {
      type: { type: String },
      coordinates: [Number]
    },
    business_email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: false,
      validate: {
        validator: function (v) {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: "Please enter a valid email",
      },
      require: [true, "Email required"],
    },
    business_phone: {
      type: String,
      require: true,
    },
    business_working_days: {
      type: [String],
      require: true,
    },
    business_time: {
      from: {
        type: String,
        require: true,
      },
      to: {
        type: String,
        require: true,
      },
    },
  },
  {
    collection: "businesses",
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

const businessesModel = mongoose.model(
  "businessesSchema",
  businessSchema
);

module.exports = businessesModel;
