import PropTypes from 'prop-types';
import ReactStars from 'react-stars';

const RateMovie = ({ movieId, userId, averageScore }) => {
  const handleRating = async (rating) => {
    console.log('Submitting rating:', { userId, movieId, score: rating });

    try {
      const response = await fetch('http://localhost:3000/movies/rate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, movieId, score: rating }),
        credentials: 'include', 
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      let data;
      try {
        data = await response.json();
      } catch (error) {
        console.error('Error parsing response JSON:', error);
        data = null;
      }

      if (response.ok) {
        console.log('Rating submission successful:', data);
      } else {
        console.error('Error rating movie:', data ? data.message : 'No response body');
      }
    } catch (error) {
      console.error('Error rating movie:', error);
    }
  };

  return (
    <div>
      <ReactStars
        count={5}
        onChange={handleRating}
        value={averageScore}
        size={24}
        color1={'#5a698f'}
        color2={'#ff6600'}
      />
    </div>
  );
};

RateMovie.propTypes = {
  movieId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  averageScore: PropTypes.number.isRequired,
};

export default RateMovie;
