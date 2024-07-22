/* eslint-disable react/prop-types */
import { NavLink } from "react-router-dom";
import { CiBookmark } from "react-icons/ci";
import { FaBookmark, FaEdit } from "react-icons/fa";
import AddShowtime from "./Modals/AddShowtime";
import AddMovie from "./Modals/AddMovie";
import DeleteMovie from "./Modals/DeleteMovie";
import styles from "./MovieCard.module.css";
import { useAuth } from "../context/AuthContext";

const MovieCard = ({ movie, bookmarkedMovies, handleAddToBookmarks, getTitle }) => {
  const { userData } = useAuth();

  return (
    <div className={styles.movieItem}>
      {userData && (
        <div
          className={
            userData.admin
              ? styles.buttonsContainerAdmin
              : styles.buttonsContainer
          }
        >
          {userData && (
            <div className={styles.icon}>
              {bookmarkedMovies.includes(movie._id) ? (
                <FaBookmark
                  onClick={() => handleAddToBookmarks(movie._id)}
                />
              ) : (
                <CiBookmark
                  onClick={() => handleAddToBookmarks(movie._id)}
                />
              )}
            </div>
          )}
          {userData && userData.admin && (
            <>
              <div className={styles.icon}>
                <AddShowtime movieId={movie._id} />
              </div>

              <AddMovie
                movie={movie}
                isEditing={true}
                buttonText={<FaEdit />}
              />

              <div className={styles.icon}>
                <DeleteMovie
                  movieId={movie._id}
                  movieTitle={movie.enTitle}
                />
              </div>
            </>
          )}
        </div>
      )}
      <div>
        <NavLink to={`/movies/${movie._id}`} className={styles.nav}>
          <div className={styles.movieTitle}>{getTitle(movie)}</div>
          {movie.poster && (
            <div>
              <img
                src={movie.poster}
                alt={movie.enTitle}
                className={styles.poster}
              />
            </div>
          )}
        </NavLink>
      </div>
    </div>
  );
};

export default MovieCard;
