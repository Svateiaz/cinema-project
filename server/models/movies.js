import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
  enTitle: { type: String, required: true },
  roTitle: { type: String, required: true },
  releaseDate: { type: Date, required: true },
  genre: { type: String, required: true },
  duration: { type: Number, required: true },
  enDescription: { type: String, required: true },
  roDescription: { type: String, required: true },
  rating: { type: String, required: true },
  userScore: { type: Number },
  cast: { type: String, required: true },
  poster: { type: String, required: true },
  trailer: { type: String, required: true },
  scores: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      score: { type: Number, min: 0, max: 10 },
    },
  ],
  averageScore: { type: Number, default: 0 },
  isDeleted: { type: Boolean, default: false },
});

const Movies = mongoose.model("Movies", movieSchema);
export default Movies;
