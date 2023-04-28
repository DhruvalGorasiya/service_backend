const mongoDB =
  "mongodb+srv://dhruvalprime:Prime123@serviceprovider.cljqjyz.mongodb.net/searviceDb";
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const connectDB = mongoose
  .connect(mongoDB)
  .catch((error) => console.log("mongoDB connection error" + error))
  .then(console.log("mongoDB Connected"));

module.exports = connectDB;
