import express from "express";
import multer from "multer";
import {
  createMovie,
  deleteMovie,
  getMovie,
  getMoviePoster,
  getMovies,
  rateMovie,
  getRecommendations,
  updateMovie,
  getUpcomingMovies,
} from "../controllers/moviesController.js";
import { isAdmin, isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router
  .route("/")
  .get(getMovies)
  .post(
    isAdmin,
    upload.fields([
      { name: "poster", maxCount: 1 },
      { name: "trailer", maxCount: 1 },
    ]),
    createMovie
  );

router.route("/rate").post(isAuthenticated, rateMovie);
router.route("/posters").get(getMoviePoster);
router.route("/upcoming").get(getUpcomingMovies);
router
  .route("/:id")
  .get(getMovie)
  .delete(isAdmin, deleteMovie)
  .put(
    isAdmin,
    upload.fields([
      { name: "poster", maxCount: 1 },
      { name: "trailer", maxCount: 1 },
    ]),
    updateMovie
  );

router
  .route("/recommendations/:userId")
  .get(isAuthenticated, getRecommendations);

export default router;
