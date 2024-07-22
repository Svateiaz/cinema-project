import Showtime from "../models/Showtime.js";
import Movies from "../models/movies.js";

const showtimeValidation = async (req, res, next) => {
  try {
    const { room, showtime, movie } = req.body;
    console.log("Request received:", req.body);
    const movieDetails = await Movies.findById(movie);
    if (!movieDetails) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    const movieDuration = movieDetails.duration * 60000; 
    const bufferTime = 15 * 60000; 
    console.log("Movie details:", movieDetails);
    console.log("Movie duration in milliseconds:", movieDuration);

    const startTime = new Date(showtime);
    const endTime = new Date(startTime.getTime() + movieDuration + bufferTime);
    console.log("Showtime start time:", startTime);
    console.log("Showtime end time:", endTime);

    const overlappingShowtimes = await Showtime.find({
      room: room,
      isDeleted: false,
      $or: [
        {
          showtime: {
            $lt: endTime,
            $gte: startTime,
          },
        },
        {
          $and: [
            { showtime: { $lte: startTime } },
            { showtime: { $gt: startTime } },
          ],
        },
        {
          $and: [
            { showtime: { $lt: endTime } },
            { showtime: { $gte: startTime } },
          ],
        },
      ],
    });

    console.log("Overlapping showtimes:", overlappingShowtimes);

    if (overlappingShowtimes.length > 0) {
      return res.status(400).json({
        success: false,
        message: "The showtime overlaps with an existing showtime in the same room.",
      });
    }

    next();
  } catch (error) {
    console.error("Error validating showtime overlap:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export default showtimeValidation;
