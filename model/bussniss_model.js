const mongoose = require("mongoose");

const BussnissesSchema = mongoose.Schema(
  {
    userID: { type: mongoose.ObjectId, required: true },
    bussnissAddress: {
      type: String,
      require: [true, "bussnissAddress is required"],
    },
    bussnissType: {
      type: String,
      require: [true, "bussnissType is required"],
    },
    bussnissEmail: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: "Please enter a valid email",
      },
      require: [true, "Email required"],
    },
    bussnissPhone: {
      type: String,
      require: [true, "bussnissPhone is required"],
    },
    bussnissType: {
      type: String,
      require: [true, "bussnissType is required"],
    },
    bussnissWorkingDays: {
      type: [String],
      require: [true, "bussnissWorkingDays is required"],
    },
    bussnissTime: {
      from: {
        type: String,
        require: [true, "fromTime is required"],
      },
      to: {
        type: String,
        require: [true, "toTime is required"],
      },
    },
  },
  {
    collection: "bussnisses",
    versionKey: false,
    timestamps: true,
    toObject: {
      transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret.password;
        return ret;
      },
    },
  }
);

const bussnissesModel = mongoose.model(
  "BussnissesSchema",
  BussnissesSchema
);

module.exports = bussnissesModel;
