/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import styles from "./CreateShowtimeForm.module.css";
import { useCreateRoom } from "../../utils/RoomsQueries/useCreateRoom";
import { useUpdateRoom } from "../../utils/RoomsQueries/useUpdateRoom";

function CreateRoomForm({ roomData, isEditing, closeModal }) {
  const [formData, setFormData] = useState({
    name: "",
    rows: "",
    columns: "",
  });

  const { createRoom } = useCreateRoom();
  const { updateRoom } = useUpdateRoom();

  useEffect(() => {
    if (isEditing && roomData) {
      setFormData({
        name: roomData.name,
        rows: roomData.seats.rows.toString(),
        columns: roomData.seats.columns.toString(),
      });
    }
  }, [isEditing, roomData]);

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
      const newData = {
        name: formData.name,
        seats: {
          rows: parseInt(formData.rows, 10),
          columns: parseInt(formData.columns, 10),
        },
      };

      if (isEditing) {
        await updateRoom({ data: newData, roomId: roomData._id });
      } else {
        await createRoom(newData);
      }

      closeModal(); 
    } catch (error) {
      console.error(`Error ${isEditing ? "updating" : "creating"} room:`, error);
    }
  };

  return (
    <div className={styles.form}>
      <form onSubmit={handleSubmit} className={styles.inputContainer}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Room Name"
          className={styles.input}
        />

        <input
          type="number"
          name="rows"
          value={formData.rows}
          onChange={handleChange}
          placeholder="Number of Rows"
          className={styles.input}
        />

        <input
          type="number"
          name="columns"
          value={formData.columns}
          onChange={handleChange}
          placeholder="Number of Columns"
          className={styles.input}
        />

        <button type="submit" className={styles.submitButton}>
          {isEditing ? "Update Room" : "Create Room"}
        </button>
      </form>
    </div>
  );
}

export default CreateRoomForm;
