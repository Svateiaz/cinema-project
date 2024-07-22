import { useState, useEffect } from "react";
import Spinner from "../components/Spinner";
import AddMovie from "../components/Modals/AddMovie";
import styles from "./Movies.module.css";
import { useGetMovies } from "../utils/MoviesQueries/useGetMovies";
import { useAuth } from "../context/AuthContext";
import Recommendations from "../components/Recommendations";
import { useTranslation } from "react-i18next";
import UpcomingMovies from "../components/UpcomingMovies";
import MovieCard from "../components/MovieCard";

function Movies() {
  const { i18n, t } = useTranslation();
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedRating, setSelectedRating] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [bookmarkedMovies, setBookmarkedMovies] = useState([]);
  const { userData } = useAuth();
  const {
    data: movies,
    isLoading,
    error,
  } = useGetMovies(selectedGenre, selectedRating);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/user/${userData.id}/bookmarks`,
          {
            credentials: "include",
          }
        );
        if (response.ok) {
          const bookmarksData = await response.json();
          setBookmarkedMovies(
            bookmarksData.bookmarks.map((bookmark) => bookmark._id)
          );
        } else {
          console.error("Failed to fetch bookmarks:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching bookmarks:", error.message);
      }
    };

    if (userData) {
      fetchBookmarks();
    }
  }, [userData]);

  if (isLoading) {
    return <Spinner />;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const handleAddToBookmarks = async (movieId) => {
    try {
      if (bookmarkedMovies.includes(movieId)) {
        const response = await fetch(
          `http://localhost:3000/user/${userData.id}/bookmarks/${movieId}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );
        if (response.ok) {
          setBookmarkedMovies((prevBookmarkedMovies) =>
            prevBookmarkedMovies.filter((id) => id !== movieId)
          );
        } else {
          console.error(
            "Failed to remove movie from bookmarks:",
            response.statusText
          );
        }
      } else {
        const response = await fetch(
          `http://localhost:3000/user/${userData.id}/bookmarks`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ movieId }),
          }
        );
        if (response.ok) {
          setBookmarkedMovies((prevBookmarkedMovies) => [
            ...prevBookmarkedMovies,
            movieId,
          ]);
        } else {
          console.error(
            "Failed to add movie to bookmarks:",
            response.statusText
          );
        }
      }
    } catch (error) {
      console.error(
        "Error adding/removing movie to/from bookmarks:",
        error.message
      );
    }
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const getTitle = (movie) => {
    return i18n.language === "en" ? movie.enTitle : movie.roTitle;
  };

  const filteredMovies = movies.filter((movie) => {
    const lowerCaseTitle = getTitle(movie).toLowerCase();
    const lowerCaseGenre = movie.genre.toLowerCase();

    if (!selectedGenre && !searchQuery) {
      return true;
    }

    if (selectedGenre && !searchQuery) {
      return lowerCaseGenre.includes(selectedGenre.toLowerCase());
    }

    if (!selectedGenre && searchQuery) {
      return lowerCaseTitle.includes(searchQuery.toLowerCase());
    }

    return (
      lowerCaseGenre.includes(selectedGenre.toLowerCase()) &&
      lowerCaseTitle.includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className={styles.pageContainer}>
      <div className={styles.topBar}>
        <AddMovie buttonText="Add New Movie" isEditing={false} />
        <div className={styles.filtersContainer}>
          <div>
            <label htmlFor="genre"></label>
            <select
              id="genre"
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
            >
              <option value="">{t("movies.genre")}</option>
              <option value="horror">Horror</option>
              <option value="action">Action</option>
              <option value="comedy">Comedy</option>
            </select>
          </div>
          <div>
            <label htmlFor="rating"></label>
            <select
              id="rating"
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
            >
              <option value="">{t("movies.rating")}</option>
              <option value="PG-13">PG-13</option>
              <option value="AG">AG</option>
            </select>
          </div>
          <div>
            <label htmlFor="search"></label>
            <input
              className={styles.searchBar}
              type="text"
              id="search"
              placeholder={t("movies.search")}
              value={searchQuery}
              onChange={handleSearchInputChange}
            />
          </div>
        </div>
      </div>
      <div className={styles.moviesContainer}>
        {filteredMovies.length > 0 ? (
          filteredMovies.map((movie) => (
            <MovieCard
              key={movie._id}
              movie={movie}
              bookmarkedMovies={bookmarkedMovies}
              handleAddToBookmarks={handleAddToBookmarks}
              getTitle={getTitle}
            />
          ))
        ) : (
          <p>No movies available.</p>
        )}
      </div>
      <UpcomingMovies
        bookmarkedMovies={bookmarkedMovies}
        handleAddToBookmarks={handleAddToBookmarks}
        getTitle={getTitle}
      />
      {userData && <Recommendations />}
    </div>
  );
}

export default Movies;
