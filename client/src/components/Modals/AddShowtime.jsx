/* eslint-disable react/prop-types */
import { useAuth } from "../../context/AuthContext";
import { useGetMovieById } from "../../utils/MoviesQueries/useGetMovies";
import { useGetRooms } from "../../utils/RoomsQueries/useGetRoom";
import CreateShowtimeForm from "../Forms/CreateShowtimeForm";
import Modal from "./Modal";
import Spinner from "../Spinner";
import { FaCalendarPlus, FaEdit } from "react-icons/fa";
import styles from "./AddShowtime.module.css";

function AddShowtime({ movieId, showtime, isEditing }) {
  const { userData } = useAuth();
  const { data: movie, isLoading: movieLoading, error: movieError } = useGetMovieById(movieId);
  const { data: rooms, isLoading: roomsLoading, error: roomsError } = useGetRooms();

  if (movieLoading || roomsLoading) {
    return <Spinner />;
  }

  if (movieError || roomsError) {
    return <div>Error: {movieError || roomsError}</div>;
  }

  return (
    <div>
      {userData && movie && rooms && (
        <Modal>
          <Modal.Open opens={isEditing ? `edit-showtime-${showtime._id}` : "showtime-form"}>
            {isEditing ? (
              <FaEdit className={styles.icon} />
            ) : (
              <FaCalendarPlus className={styles.insertIcon} />
            )}
          </Modal.Open>
          <Modal.Window name={isEditing ? `edit-showtime-${showtime._id}` : "showtime-form"}>
            <CreateShowtimeForm
              movie={movie}
              rooms={rooms}
              showtime={isEditing ? showtime : null}
              isEditing={isEditing}
              // eslint-disable-next-line no-undef
              closeModal={() => setOpenName("")}
            />
          </Modal.Window>
        </Modal>
      )}
    </div>
  );
}

export default AddShowtime;
