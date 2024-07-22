/* eslint-disable no-unused-vars */
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { useGetUserReviews } from "../../utils/MoviesQueries/useGetMovies";
import styles from "./UserRatings.module.css";
import { FaStar } from "react-icons/fa";

function UserReviews() {
  const { userData } = useAuth();
  const { data, isLoading, isError } = useGetUserReviews(userData.id);
  const navigate = useNavigate();
  

  const handleOnNavigate = (movieId) => {
    navigate(`/movies/${movieId}`);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching user reviews.</div>;
  }

  const reviews = data.data; 

  const imageUrls = reviews.map((review) => review.movie.poster);

  return (
    <div className={styles.reviewsContainer}>
      <h2>My Reviews</h2>
      <div className={styles.moviesGrid}>
        {reviews.map((review) => (
          <div key={review.movie._id} className={styles.movieCard}>
            <div className={styles.movieInfo}>
              <h3 className={styles.movieTitle}>
                {review.movie.enTitle}
                <span className={styles.rating}>
                  {review.score}
                  <FaStar className={styles.starIcon} />
                </span>
              </h3>
            </div>
            <img
              loading="eager"
              src={review.movie.poster}
              alt={review.movie.enTitle}
              className={styles.poster}
              onClick={() => handleOnNavigate(review.movie._id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserReviews;
