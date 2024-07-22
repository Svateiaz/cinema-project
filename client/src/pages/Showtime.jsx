import { useState } from "react";
import { useGetShowtimes } from "../utils/ShowtimesQueries/useGetShowtimes";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { NavLink } from "react-router-dom";
import { useGetMovies } from "../utils/MoviesQueries/useGetMovies";
import styles from "./Showtime.module.css";
import AddShowtime from "../components/Modals/AddShowtime";
import { FaEdit } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import DeleteShowtime from "../components/Modals/DeleteShowtime";
import { useTranslation } from "react-i18next";

function Showtime() {
  const { userData } = useAuth();
  const { i18n, t } = useTranslation();

  const {
    data: movies,
    isLoading: moviesLoading,
    error: moviesError,
  } = useGetMovies();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const {
    data: responseData,
    isLoading: showtimesLoading,
    isError: showtimesError,
  } = useGetShowtimes(selectedDate.toISOString().split("T")[0]);
  const showtimes = responseData?.data || [];

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const getOrderedShowtimes = (movieId) => {
    const movieShowtimes = showtimes.filter(
      (showtime) => showtime.movie._id === movieId || showtime.movie === movieId
    );
    return movieShowtimes.sort(
      (a, b) => new Date(a.showtime) - new Date(b.showtime)
    );
  };

  if (moviesLoading || showtimesLoading) return <div>Loading...</div>;

  if (moviesError || showtimesError) return <div>Error fetching data</div>;

  return (
    <div className={styles.showtimeContainer}>
      <h2>{t("navbar.showtimes")}</h2>
      <div className={styles.datePickerContainer}>
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          dateFormat="yyyy-MM-dd"
          className={styles.datePicker}
        />
      </div>
      <div className={styles.moviesGrid}>
        {movies
          .filter((movie) =>
            showtimes.some(
              (showtime) =>
                showtime.movie._id === movie._id || showtime.movie === movie._id
            )
          )
          .map((movie) => (
            <div key={movie._id} className={styles.movieCard}>
              <h3>{i18n.language === "en" ? movie.enTitle : movie.roTitle}</h3>
              <img
                src={movie.poster}
                alt={movie.enTitle}
                className={styles.moviePoster}
              />
              <div className={styles.movieDetails}>
                <div className={styles.showtimes}>
                  {getOrderedShowtimes(movie._id).map((showtime) => (
                    <div key={showtime._id} className={styles.showtimeItem}>
                      {userData?.admin && (
                        <div className={styles.iconContainer}>
                          <AddShowtime
                            movieId={movie._id}
                            showtime={showtime}
                            isEditing={true}
                            buttonText={<FaEdit />}
                          />
                          <DeleteShowtime showtimeId={showtime._id} />
                        </div>
                      )}
                      <NavLink
                        to={`/showtimes/${showtime._id}`}
                        className={styles.showtimeLink}
                      >
                        <div className={styles.showtime}>
                          <span className={styles.time}>
                            {new Date(showtime.showtime).toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </span>
                        </div>
                      </NavLink>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Showtime;
