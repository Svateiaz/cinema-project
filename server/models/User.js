import mongoose from "mongoose";
import bcrypt from "bcrypt";
import passportLocalMongoose from "passport-local-mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true, 
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true, 
  },
  admin: {
    type: Boolean,
    default: false,
  },
  tickets: [
    {
      showtimeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Showtime",
      },
      seats: [
        {
          row: {
            type: Number,
          },
          column: {
            type: Number,
          },
        },
      ],
      ticketCode: {
        type: String,
      },
      boughtDate: {
        type: Date,
      },
      paymentInfo: {
        cardNumber: String,
        ccv: String,
        expiration: String,
      },
    },
  ],
  bookmarks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movies",
    },
  ],
  notifications: [
    {
      movieId: { type: mongoose.Schema.Types.ObjectId, ref: "Movies" },
      message: { type: String },
      date: { type: Date },
      dismissed: { type: Boolean, default: false },
    },
  ],

  resetPasswordCode: String,
  resetPasswordExpires: Date,
  isDeleted: { type: Boolean, default: false },
});

userSchema.plugin(passportLocalMongoose, { usernameField: "email" });

userSchema.methods.isValidPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
