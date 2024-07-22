import mongoose from "mongoose";

const showtimeSchema = new mongoose.Schema({
  movie: {
    type: mongoose.Schema.ObjectId,
    ref: "Movies",
  },
  showtime: {
    type: Date,
    required: true, 
  },
  room: {
    type: mongoose.Schema.ObjectId,
    ref: "Rooms",
    required: true, 
  },
  availableSeats: {
    type: Number,
  },
  ticketPrice: {
    type: Number,
    default: 18,
  },
  reservedSeats: [
    [
      {
        type: Number,
      },
      {
        type: Number,
      },
    ],
  ],
  isDeleted: { type: Boolean, default: false },
});

const Showtime = mongoose.model("Showtime", showtimeSchema);

export default Showtime;
