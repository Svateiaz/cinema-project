/* eslint-disable react/prop-types */
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import CreateMovieForm from "../Forms/CreateMovieForm";
import Modal from "./Modal";
import { FaEdit } from "react-icons/fa";

function AddMovie({ movie, isEditing, buttonText }) {
  const { userData } = useAuth();
  // eslint-disable-next-line no-unused-vars
  const [openName, setOpenName] = useState("");

  return (
    <div>
      {userData && (
        <Modal>
          <Modal.Open opens={isEditing ? `edit-movie-${movie._id}` : "movie-form"}>
            {isEditing ? <FaEdit className="icon" /> : <button>{buttonText}</button>}
          </Modal.Open>
          <Modal.Window name={isEditing ? `edit-movie-${movie._id}` : "movie-form"}>
            <CreateMovieForm
              initialData={isEditing ? movie : null}
              isEditing={isEditing}
              closeModal={() => setOpenName("")}
            />
          </Modal.Window>
        </Modal>
      )}
    </div>
  );
}

export default AddMovie;
