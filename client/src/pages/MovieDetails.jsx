import { useState } from "react";
import { useParams } from "react-router-dom";
import { useGetMovieById } from "../utils/MoviesQueries/useGetMovies";
import { useGetShowtimesByMovie } from "../utils/ShowtimesQueries/useGetShowtimes";
import styles from "./MovieDetails.module.css";
import MovieShowtimes from "../components/MovieShowtimes";
import RateMovie from "../components/RateMovie";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import { FaClock } from "react-icons/fa";
import { FaTheaterMasks } from "react-icons/fa";
import { MdOutlineLocalMovies } from "react-icons/md";


function MovieDetails() {
  const { movieId } = useParams();
  const { data: movie, isLoading, isError } = useGetMovieById(movieId);
  const { data: showtimes } = useGetShowtimesByMovie(movieId);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const { userData } = useAuth();
  const { i18n } = useTranslation();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching movie details</div>;

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const getTitle = (movie) => {
    return i18n.language === "en" ? movie.enTitle : movie.roTitle;
  };

  const getDescription = (movie) => {
    return i18n.language === "en" ? movie.enDescription : movie.roDescription;
  };

  return (
    <div className={styles.container}>
      <div className={styles.videoContainer}>
        <video
          controls
          className={styles.trailer}
          onPlay={handlePlay}
          onPause={handlePause}
        >
          <source src={movie.trailer} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {!isPlaying && (
          <div className={styles.trailerData}>
            <img
              className={styles.posterImage}
              src={movie.poster}
              alt="Movie Poster"
              onLoad={() => setLoaded(true)}
              style={{ visibility: loaded ? "visible" : "hidden" }}
            />

            <div className={styles.movieDetails}>
              {userData && (
                <RateMovie
                  movieId={movie._id}
                  userId={userData.id}
                  averageScore={movie.averageScore}
                />
              )}
              <div className={styles.movieTitle}>{getTitle(movie)}</div>
              <div className={styles.movieGenre}> <FaTheaterMasks /> {movie.genre}</div>
              <div className={styles.movieRating}><MdOutlineLocalMovies /> {movie.rating}</div>
              <div className={styles.movieDuration}>
              <FaClock /> {movie.duration} minutes
              </div>
              <div className={styles.movieDescription}>
                {getDescription(movie)}
              </div>
            </div>
          </div>
        )}
      </div>
      <MovieShowtimes showtimes={showtimes} />
    </div>
  );
}

export default MovieDetails;
