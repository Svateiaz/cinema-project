import express from "express";
import {
  createShowtime,
  getShowtime,
  getShowtimesByMovie,
  getShowtimes,
  updateShowtime,
  deleteShowtime,
} from "../controllers/showtimesController.js";
import showtimeValidation from "../middleware/showtimeValidation.js";
import { isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(getShowtimes).post(isAdmin, showtimeValidation, createShowtime);
router.route("/:showtimeId").get(getShowtime).put(isAdmin, updateShowtime).delete(isAdmin, deleteShowtime);
router.route("/movie/:movieId").get(getShowtimesByMovie);

export default router;
