const { model, Schema } = require("mongoose");

const userSchema = new Schema(
  {
    image: String,
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    googleId: String,
  },
  {
    timestamps: true,
  }
);

module.exports = model("User", userSchema);
