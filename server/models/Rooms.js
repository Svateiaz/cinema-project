import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  name: { type: String,  required: true,  },
  seats: {
    columns: { type: Number },
    rows: { type: Number },
  },
  isDeleted: { type: Boolean, default: false },
});

const Rooms = mongoose.model("Rooms", roomSchema);
export default Rooms;
