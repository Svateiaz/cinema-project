import Showtime from "../models/Showtime.js";
import Showtimes from "../models/Showtime.js";

export const createShowtime = async (req, res) => {
  try {
    console.log("Request body received:", req.body); 
    const showtime = await Showtimes.create(req.body);
    console.log("Showtime created:", showtime); 
    res.status(201).json({ success: true, data: showtime });
  } catch (err) {
    console.error("Error creating showtime:", err); 
    res.status(400).json({ success: false, message: err });
  }
};

export const getShowtimes = async (req, res) => {
  try {
    const { date } = req.query;
    let showtimes;
    if (date) {
      showtimes = await Showtimes.find({
        showtime: {
          $gte: new Date(date),
          $lt: new Date(date).setDate(new Date(date).getDate() + 1),
        },
        isDeleted: false,
      }).populate("room");
    } else {
      showtimes = await Showtimes.find({ isDeleted: false }).populate("room");
    }

    res.status(200).json({ success: true, data: showtimes });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getShowtime = async (req, res) => {
  try {
    const showtimeId = req.params.showtimeId;
    const showtime = await Showtimes.findOne({ _id: showtimeId, isDeleted: false })
      .populate("movie")
      .populate("room");

    if (!showtime) {
      return res.status(400).json({
        success: false,
        message: `Showtime with id ${showtimeId} not found`,
      });
    }

    res.status(200).json({ success: true, data: showtime });
  } catch (err) {
    res.status(400).json({ success: false, message: err });
  }
};

export const getShowtimesByMovie = async (req, res) => {
  try {
    const movieId = req.params.movieId;
    const showtimes = await Showtimes.find({ movie: movieId, isDeleted: false }).populate('room');

    res.status(200).json({ success: true, data: showtimes });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const updateShowtime = async (req, res) => {
  try {
    const showtimeId = req.params.showtimeId;
    const { movie, showtime, room, availableSeats, reservedSeats, ticketPrice } = req.body;

    console.log("Received update request for showtimeId:", showtimeId);
    console.log("Request body:", req.body);

    const existingShowtime = await Showtimes.findById(showtimeId);
    if (!existingShowtime) {
      console.log(`Showtime with id ${showtimeId} not found.`);
      return res.status(404).json({
        success: false,
        message: `Showtime with id ${showtimeId} not found.`,
      });
    }

    console.log("Existing showtime data:", existingShowtime);

    // Update fields if they are provided in the request
    if (movie) existingShowtime.movie = movie;
    if (showtime) existingShowtime.showtime = showtime;
    if (room) existingShowtime.room = room;
    if (availableSeats !== undefined) existingShowtime.availableSeats = availableSeats;
    if (ticketPrice !== undefined) existingShowtime.ticketPrice = ticketPrice;

    if (Array.isArray(reservedSeats)) {
      existingShowtime.reservedSeats = existingShowtime.reservedSeats.concat(reservedSeats);
      console.log("Updated reservedSeats:", existingShowtime.reservedSeats);

      const boughtSeatsCount = reservedSeats.length;
      existingShowtime.availableSeats -= boughtSeatsCount;
      console.log("Updated availableSeats:", existingShowtime.availableSeats);
    } else {
      console.log("Invalid reservedSeats format:", reservedSeats);
      return res.status(400).json({
        success: false,
        message: "Invalid reservedSeats format. It should be an array.",
      });
    }

    const updatedShowtime = await existingShowtime.save();
    console.log("Successfully updated showtime:", updatedShowtime);

    res.status(200).json({ success: true, data: updatedShowtime });
  } catch (err) {
    console.log("Error updating showtime:", err);
    res.status(400).json({ success: false, message: err.message });
  }
};




export const deleteShowtime = async (req, res) => {
  try {
    const { showtimeId } = req.params;
    const showtime = await Showtime.findById(showtimeId);
    if (!showtime) {
      return res.status(404).json({ success: false, message: 'Showtime not found' });
    }
    showtime.isDeleted = true;
    await showtime.save();
    res.status(200).json({ success: true, message: 'Showtime deleted' });
  } catch (err) {
    console.error('Error deleting showtime:', err);
    res.status(400).json({ success: false, message: err.message });
  }
};
