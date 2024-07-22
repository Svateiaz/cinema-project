import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { useGetBookmarkedMovies } from "../../utils/MoviesQueries/useGetMovies";
import styles from "./UserList.module.css";
import { useTranslation } from "react-i18next";

function UserList() {
  const { t, i18n } = useTranslation();
  const { userData } = useAuth();
  const {
    data: bookmarks,
    isLoading,
    isError,
  } = useGetBookmarkedMovies(userData.id);
  const navigate = useNavigate();

  const handleOnNavigate = (movieId) => {
    console.log(movieId);
    navigate(`/movie/${movieId}`)
  }

  console.log(bookmarks);

  if (isLoading) {
    return <div>{t("loading")}</div>;
  }

  if (isError) {
    return <div>{t("errorFetchingData")}</div>;
  }

  return (
    <div className={styles.bookmarksContainer}>
      <h2>{t("user.myBookmarks")}</h2>
      <div className={styles.moviesGrid}>
        {bookmarks.map((movie) => (
          <div key={movie._id} className={styles.movieCard}>
            <div className={styles.movieInfo}>
              <h3>{i18n.language === "en" ? movie.enTitle : movie.roTitle}</h3>
            </div>

            <img
              src={movie.poster}
              alt={i18n.language === "en" ? movie.enTitle : movie.roTitle}
              className={styles.moviePoster}
              onClick={() => handleOnNavigate(movie._id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserList;
