import useDeleteMovie from "../../utils/MoviesQueries/useDeleteMovie";
import Modal from "./Modal";
import styles from "./DeleteMovie.module.css";
import { FaTrash } from "react-icons/fa";
import { useTranslation } from "react-i18next";

// eslint-disable-next-line react/prop-types
function DeleteMovie({ movieId, movieTitle }) {
  const { t } = useTranslation();
  const { deleteMovie } = useDeleteMovie();

  const handleDeleteMovie = async () => {
    console.log("Deleting movie with ID:", movieId);
    try {
      await deleteMovie(movieId);
      console.log("Movie deleted successfully:", movieId);
    } catch (error) {
      console.error("Error deleting movie:", error);
    }
  };

  return (
    <div>
      <Modal>
        <Modal.Open opens="delete-movie">
          <FaTrash className={styles.deleteIcon} />
        </Modal.Open>
        <Modal.Window name="delete-movie">
          <div className={styles.container}>
            <h2 className={styles.confirmationText}>
              {`${t("movies.deleteConfirmation")} "${movieTitle}"?`}
            </h2>{" "}
            <button
              onClick={handleDeleteMovie}
              className={styles.confirmationButton}
            >
              {t("movies.confirmationResponse")}
            </button>
          </div>
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default DeleteMovie;
