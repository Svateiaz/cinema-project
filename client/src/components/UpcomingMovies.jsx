/* eslint-disable react/prop-types */
import styles from "./UpcomingMovies.module.css";
import { useTranslation } from "react-i18next";
import Spinner from "./Spinner";
import { useGetUpcomingMovies } from "../utils/MoviesQueries/useGetMovies";
import MovieCard from "./MovieCard";

function UpcomingMovies({ bookmarkedMovies, handleAddToBookmarks, getTitle }) {
  const { data: comingSoon, isLoading, error } = useGetUpcomingMovies();
  const { t } = useTranslation();

  if (isLoading) {
    return <Spinner />;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className={styles.pageContainer}>
      <h3 className={styles.comingSoon}>{t("movies.comingSoon")}</h3>
      <div className={styles.moviesContainer}>
        {comingSoon.map((movie) => (
          <MovieCard
            key={movie._id}
            movie={movie}
            bookmarkedMovies={bookmarkedMovies}
            handleAddToBookmarks={handleAddToBookmarks}
            getTitle={getTitle}
          />
        ))}
      </div>
    </div>
  );
}

export default UpcomingMovies;
