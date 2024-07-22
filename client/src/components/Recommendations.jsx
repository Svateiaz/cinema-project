import Slider from "react-slick";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";
import { useGetRecommendations } from "../utils/MoviesQueries/useGetMovies";
import styles from "./Recommendations.module.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router";

function Recommendations() {
  const { userData } = useAuth();
  const { data: recommendations, isLoading, error } = useGetRecommendations(userData.id);
  const navigate = useNavigate();

  const handleOnNavigate = (movieId) => {
    navigate(`${movieId}`);
  }

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
    pauseOnHover: true,
    centerMode: true,
  };

  return (
    <div className={styles.recommendationsContainer}>
      <h2>Recommended Movies</h2>
      <Slider {...settings} className={styles.carouselContainer}>
        {recommendations.map((movie, index) => (
          <div key={index} className={styles.movieItem}>
            {movie.poster && (
              <img
                src={movie.poster}
                alt={movie.enTitle}
                className={styles.poster}
                onClick={() => handleOnNavigate(movie._id)}
              />
            )}
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default Recommendations;
