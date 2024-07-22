import AddRoom from "../components/Modals/AddRoom";
import DeleteRoom from "../components/Modals/DeleteRoom";
import Spinner from "../components/Spinner";
import { useGetRooms } from "../utils/RoomsQueries/useGetRoom";
import styles from "./UserManagement.module.css";

function Rooms() {
  const { data: rooms, isLoading, isError } = useGetRooms();
  console.log(rooms);

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <div>Error loading rooms</div>;
  }

  return (
    <div className={styles.container}>
      <AddRoom />

      <h2>Manage Rooms</h2>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Columns</th>
              <th>Rows</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {rooms.data.map((room) => (
              <tr key={room._id}>
                <td>{room._id}</td>
                <td>{room.name}</td>
                <td>{room.seats.columns}</td>
                <td>{room.seats.rows}</td>
                <td>
                  <AddRoom 
                    roomId={room._id} 
                    roomData={room} 
                    isEditing={true} 
                  />
                </td>
                <td>
                  <DeleteRoom roomId={room._id} roomName={room.name} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Rooms;
