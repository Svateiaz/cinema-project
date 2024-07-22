/* eslint-disable react/prop-types */
import { FaTrash } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import useDeleteRoom from "../../utils/RoomsQueries/useDeleteRoom";
import Modal from "./Modal";
import styles from "./DeleteMovie.module.css"

function DeleteRoom({ roomId, roomName }) {
  const { t } = useTranslation();
  const { deleteRoom } = useDeleteRoom();

  const handleDeleteRoom = async () => {
    console.log("Deleting room with ID:", roomId);
    try {
      await deleteRoom(roomId);
      console.log("Room deleted successfully:", roomId);
    } catch (error) {
      console.error("Error deleting room:", error);
    }
  };

  return (
    <div>
      <Modal>
        <Modal.Open opens="delete-room">
          <FaTrash />
        </Modal.Open>
        <Modal.Window name="delete-room">
          <div className={styles.container}>
            <h2 className={styles.confirmationText}>{`Are you sure you want to delete ${roomName}?`}</h2>
            <button onClick={handleDeleteRoom} className={styles.confirmationButton}>
              {t("movies.confirmationResponse")}
            </button>
          </div>
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default DeleteRoom;
