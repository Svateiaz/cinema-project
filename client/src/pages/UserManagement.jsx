import { useAuth } from "../context/AuthContext";
import { useGetUsers, useToggleAdminStatus } from "../utils/UserQueries/useGetUsers";
import styles from "./UserManagement.module.css";

function UserManagement() {
  const { userData } = useAuth();
  const { data: users, isLoading, isError } = useGetUsers();
  const { mutate: toggleAdmin, isLoading: isTogglingAdmin } = useToggleAdminStatus();

  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (isError) {
    return <div className={styles.error}>Error fetching users</div>;
  }

  if (!Array.isArray(users) || users.length === 0) {
    return <div className={styles.error}>No users found</div>;
  }

  return (
    <div className={styles.container}>
      <h2>All Users</h2>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Id</th>
              <th>Username</th>
              <th>Email</th>
              <th>Admin</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.admin ? "Yes" : "No"}</td>
                <td>
                  {userData.id !== user.id && (
                    <button
                      className={styles.button}
                      onClick={() => toggleAdmin(user.id)}
                      disabled={isTogglingAdmin}
                    >
                      {user.admin ? "Revoke Admin" : "Make Admin"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserManagement;
