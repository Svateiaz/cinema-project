import { useAuth } from "../../context/AuthContext";
import CreateRoomForm from "../Forms/CreateRoomForm";
import Modal from "./Modal";
import { FaEdit } from "react-icons/fa";

// eslint-disable-next-line react/prop-types
function AddRoom({ roomId, roomData, isEditing }) {
  const { userData } = useAuth();

  return (
    <div>
      {userData && (
        <Modal>
          <Modal.Open opens={isEditing ? `edit-room-${roomId}` : "room-form"}>
            {isEditing ? <FaEdit /> : <button>Create room</button>}
            
          </Modal.Open>
        
          <Modal.Window name={isEditing ? `edit-room-${roomId}` : "room-form"}>
            <CreateRoomForm
              roomData={isEditing ? roomData : null}
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

export default AddRoom;
