import Movies from "../models/movies.js";
import User from "../models/User.js";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import sharp from "sharp";
dotenv.config();

const bucketName = process.env.VITE_BUCKET_NAME;
const bucketRegion = process.env.VITE_BUCKET_REGION;
const accessKey = process.env.VITE_ACCESS_KEY;
const secretKey = process.env.VITE_SECRET_ACCESS_KEY;

const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretKey,
  },
  region: bucketRegion,
});

export const getMovies = async (req, res) => {
  try {
    let query = { isDeleted: false, releaseDate: { $lte: new Date() } };
    const { genre, rating } = req.query;

    if (genre) {
      query.genre = { $regex: new RegExp(genre, "i") };
    }
    if (rating) {
      query.rating = rating;
    }

    const movies = await Movies.find(query);
    res.status(200).json({ success: true, data: movies });
  } catch (err) {
    res.status(400).json({ success: false, message: err });
  }
};

export const getUpcomingMovies = async (req, res) => {
  try {
    const currentDate = new Date();
    const futureDate = new Date();
    futureDate.setDate(currentDate.getDate() + 30);

    const movies = await Movies.find({
      isDeleted: false,
      releaseDate: { $gt: currentDate, $lte: futureDate },
    });

    res.status(200).json({ success: true, data: movies });
  } catch (err) {
    res.status(400).json({ success: false, message: err });
  }
};


export const getMovie = async (req, res) => {
  try {
    const movie = await Movies.findOne({
      _id: req.params.id,
      isDeleted: false,
    });
    if (!movie) {
      return res
        .status(404)
        .json({ success: false, message: "Movie not found" });
    }
    res.status(200).json({ success: true, data: movie });
  } catch (err) {
    res.status(400).json({ success: false, message: err });
  }
};

export const getMoviePoster = async (req, res) => {
  try {
    const movieId = req.params.id;
    const movie = await Movies.findOne({ _id: movieId, isDeleted: false });
    if (!movie) {
      return res
        .status(404)
        .json({ success: false, message: "Movie not found" });
    }
    const posterUrl = movie.poster;
    return res.status(200).json({ success: true, posterUrl });
  } catch (err) {
    console.error("Error fetching movie poster:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const createMovie = async (req, res) => {
  try {
    if (!req.files || !req.files.poster || !req.files.trailer) {
      return res.status(400).json({
        success: false,
        message: "Please upload both poster and video files",
      });
    }

    const {
      enTitle,
      roTitle,
      genre,
      duration,
      enDescription,
      roDescription,
      rating,
      cast,
      releaseDate,
    } = req.body;
    const { originalname: posterName, buffer: posterBuffer } =
      req.files.poster[0];
    const { originalname: trailerName, buffer: trailerBuffer } =
      req.files.trailer[0];

    const buffer = await sharp(posterBuffer)
      .resize({ height: 400, width: 500, fit: "outside" })
      .toBuffer();

    const posterParams = {
      Bucket: bucketName,
      Key: posterName,
      Body: buffer,
    };

    const trailerParams = {
      Bucket: bucketName,
      Key: trailerName,
      Body: trailerBuffer,
    };

    await Promise.all([
      s3.send(new PutObjectCommand(posterParams)),
      s3.send(new PutObjectCommand(trailerParams)),
    ]);

    const movie = await Movies.create({
      enTitle,
      roTitle,
      genre,
      duration,
      enDescription,
      roDescription,
      rating,
      cast,
      releaseDate,
      poster: `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/${posterName}`,
      trailer: `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/${trailerName}`,
    });

    res.status(201).json({ success: true, data: movie });
  } catch (err) {
    console.error("Error creating movie:", err);
    res.status(400).json({ success: false, message: err.message });
  }
};

export const updateMovie = async (req, res) => {
  try {
    const movie = await Movies.findOne({
      _id: req.params.id,
      isDeleted: false,
    });
    if (!movie) {
      return res
        .status(404)
        .json({ success: false, message: "Movie not found" });
    }

    if (req.files && req.files.poster) {
      const { originalname: posterName, buffer: posterBuffer } =
        req.files.poster[0];
      const buffer = await sharp(posterBuffer)
        .resize({ height: 400, width: 500, fit: "outside" })
        .toBuffer();
      const posterParams = {
        Bucket: bucketName,
        Key: posterName,
        Body: buffer,
      };
      await s3.send(new PutObjectCommand(posterParams));
      movie.poster = `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/${posterName}`;
    }

    if (req.files && req.files.trailer) {
      const { originalname: trailerName, buffer: trailerBuffer } =
        req.files.trailer[0];
      const trailerParams = {
        Bucket: bucketName,
        Key: trailerName,
        Body: trailerBuffer,
      };
      await s3.send(new PutObjectCommand(trailerParams));
      movie.trailer = `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/${trailerName}`;
    }

    Object.keys(req.body).forEach((key) => {
      if (
        key === "scores" &&
        typeof req.body[key] === "string" &&
        req.body[key] === ""
      ) {
        return;
      }
      if (key === "duration") {
        movie.duration = parseInt(req.body[key]);
      } else {
        movie[key] = req.body[key];
      }
    });

    await movie.save();
    res.status(200).json({ success: true, data: movie });
  } catch (err) {
    console.error("Error updating movie:", err);
    res.status(400).json({ success: false, message: err.message });
  }
};

export const deleteMovie = async (req, res) => {
  try {
    const movie = await Movies.findById(req.params.id);
    if (!movie) {
      return res.status(400).json({
        success: false,
        message: `Movie with id ${req.params.id} not found`,
      });
    }
    movie.isDeleted = true;
    await movie.save();
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, message: err });
  }
};

export const rateMovie = async (req, res) => {
  const { userId, movieId, score } = req.body;

  if (score < 0 || score > 10) {
    return res
      .status(400)
      .json({ success: false, message: "Score must be between 0 and 5" });
  }

  try {
    const user = await User.findById(userId);
    const movie = await Movies.findOne({ _id: movieId, isDeleted: false });

    if (!user || !movie) {
      return res
        .status(404)
        .json({ success: false, message: "User or Movie not found" });
    }

    if (!user.movieRatings) {
      user.movieRatings = [];
    }

    if (!movie.scores) {
      movie.scores = [];
    }

    const existingUserRating = user.movieRatings.find((rating) =>
      rating.movieId.equals(movieId)
    );
    if (existingUserRating) {
      existingUserRating.score = score;
    } else {
      user.movieRatings.push({ movieId, score });
    }
    await user.save();

    const existingMovieRating = movie.scores.find((rating) =>
      rating.userId.equals(userId)
    );
    if (existingMovieRating) {
      existingMovieRating.score = score;
    } else {
      movie.scores.push({ userId, score });
    }

    const totalScore = movie.scores.reduce((acc, curr) => acc + curr.score, 0);
    movie.averageScore = totalScore / movie.scores.length;

    await movie.save();

    res.status(200).json({ success: true, data: movie });
  } catch (err) {
    console.error("Error rating movie:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getRecommendations = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId).populate("bookmarks");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const bookmarkedMovies = user.bookmarks;

    if (!bookmarkedMovies.length) {
      return res.status(200).json({ success: true, data: [] });
    }

    const genres = new Set();
    const ratings = new Set();

    bookmarkedMovies.forEach((movie) => {
      movie.genre.split(", ").forEach((genre) => genres.add(genre));
      ratings.add(movie.rating);
    });

    const recommendations = await Movies.find({
      $or: [{ genre: { $in: [...genres] } }, { rating: { $in: [...ratings] } }],
      _id: { $nin: bookmarkedMovies.map((movie) => movie._id) },
      isDeleted: false,
    }).sort({ averageScore: -1 });

    res.status(200).json({ success: true, data: recommendations });
  } catch (err) {
    console.error("Error fetching recommendations:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
