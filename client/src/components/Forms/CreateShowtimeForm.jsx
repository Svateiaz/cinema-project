/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useCreateShowtime } from "../../utils/ShowtimesQueries/useCreateShowtime";
import { useUpdateShowtime } from "../../utils/ShowtimesQueries/useUpdateShowtime";
import styles from "./CreateShowtimeForm.module.css";

function CreateShowtimeForm({ movie, rooms, showtime, isEditing, closeModal }) {
  const [formData, setFormData] = useState({
    roomId: "",
    date: "",
    time: "",
    price: "",
  });

  const { createShowtime } = useCreateShowtime();
  const { updateShowtime } = useUpdateShowtime();

  useEffect(() => {
    if (isEditing && showtime) {
      const date = new Date(showtime.showtime);
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      setFormData({
        roomId: showtime.room._id,
        date: date.toISOString().split("T")[0],
        time: `${hours}:${minutes}`,
      });
    }
  }, [isEditing, showtime]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const selectedRoom = rooms.data.find((room) => room._id === formData.roomId);
      const availableSeats = selectedRoom ? selectedRoom.seats.rows * selectedRoom.seats.columns : 0;
      const showtimeDateTime = new Date(formData.date + " " + formData.time);

      const newData = {
        movie: movie._id,
        showtime: showtimeDateTime,
        room: formData.roomId,
        availableSeats,
        reservedSeats: [],
      };

      if (isEditing) {
        await updateShowtime({ data: newData, showtimeId: showtime._id });
      } else {
        await createShowtime(newData);
      }

      closeModal();
    } catch (error) {
      console.error("Error creating/updating showtime:", error);
    }
  };

  return (
    <div className={styles.form}>
      <form onSubmit={handleSubmit} className={styles.inputContainer}>
        <input
          type="text"
          name="movie"
          value={movie.enTitle}
          placeholder="Select Movie"
          className={styles.input}
          readOnly
        />

        <select
          name="roomId"
          value={formData.roomId}
          onChange={handleChange}
          className={`${styles.input} ${styles.select}`}
        >
          <option value="">Select Room</option>
          {rooms.data &&
            rooms.data.map((room) => (
              <option key={room._id} value={room._id} className={styles.option}>
                {room.name}
              </option>
            ))}
        </select>

        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className={styles.input}
        />

        <input
          type="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          className={styles.input}
        />

        <button type="submit" className={styles.submitButton}>
          {isEditing ? "Update Showtime" : "Create Showtime"}
        </button>
      </form>
    </div>
  );
}

export default CreateShowtimeForm;
