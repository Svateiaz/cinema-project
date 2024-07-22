import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import styles from "./MovieShowtimes.module.css";
import Spinner from "./Spinner";

function MovieShowtimes({ showtimes }) {
  if (!showtimes) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  return (
    <div className={styles.showtimeContainer}>
      <ul className={styles.showtimeList}>
        <h3>Available showtimes:</h3>
        {showtimes.map((showtime) => (
          <li key={showtime._id} className={styles.showtimeDetails}>
            <div>Showtime: {new Date(showtime.showtime).toLocaleString()}</div>
            <div className={styles.showtime}>
              <div>
                <div>{showtime.room?.name}</div>
                <div> {showtime.availableSeats} tickets left</div>
              </div>
              <NavLink to={`/showtimes/${showtime._id}`}>
                <button>Click here</button>
              </NavLink>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

MovieShowtimes.propTypes = {
  showtimes: PropTypes.array.isRequired,
};

export default MovieShowtimes;
