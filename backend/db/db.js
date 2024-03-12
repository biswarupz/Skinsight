const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://admin:Sayu1fyqWVxa8iMz@test-cluster-1.qiqhvln.mongodb.net/skinsight_db"
);
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number,
  gender: String,
  password: String,
  photos: Array,
  description: String,
  acc_create_time: String,
  status: Boolean,
  reports: Array,
});

const User = mongoose.model("User", UserSchema);
module.exports = { User };
