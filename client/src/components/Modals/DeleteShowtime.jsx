/* eslint-disable react/prop-types */
import { FaTrash } from "react-icons/fa";
import Modal from "./Modal";
import useDeleteShowtime from "../../utils/ShowtimesQueries/useDeleteShowtime";
import styles from "./DeleteMovie.module.css"
function DeleteShowtime({ showtimeId }) {
  const { deleteShowtime } = useDeleteShowtime();

  const handleDeleteShowtime = async () => {
    console.log("Deleting showtime with ID:", showtimeId);
    try {
      await deleteShowtime(showtimeId);
      console.log("Showtime deleted successfully:", showtimeId);
    } catch (error) {
      console.error("Error deleting showtime:", error);
    }
  };

  return (
    <div>
      <Modal>
        <Modal.Open opens="delete-showtime">
          <FaTrash />
        </Modal.Open>
        <Modal.Window name="delete-showtime">
          <div className={styles.container}>
            <h2 className={styles.confirmationText}>Are you sure you want to delete this showtime?</h2>
            <button onClick={handleDeleteShowtime}>
              Yes
            </button>
          </div>
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default DeleteShowtime;
