import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import styles from "./Notifications.module.css";
import { useGetBookmarkedMovies } from "../utils/useGetMovies";

function Notifications() {
  const { userData } = useAuth();
  const { data: bookmarkedMovies, isLoading, isError } = useGetBookmarkedMovies(userData?.id);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (bookmarkedMovies) {
      const today = new Date();
      const upcomingNotifications = bookmarkedMovies
        .filter((movie) => {
          const releaseDate = new Date(movie.releaseDate);
          const diffDays = Math.ceil((releaseDate - today) / (1000 * 60 * 60 * 24));
          return diffDays === 7;
        })
        .map((movie) => `Movie ${movie.title} will release in 7 days!`);

      setNotifications(upcomingNotifications);
    }
  }, [bookmarkedMovies]);

  if (isLoading) return <p>Loading notifications...</p>;
  if (isError) return <p>Error loading notifications.</p>;

  return (
    <div className={styles.notifications}>
      {notifications.length > 0 ? (
        notifications.map((notification, index) => (
          <p key={index}>{notification}</p>
        ))
      ) : (
        <p>No new notifications</p>
      )}
    </div>
  );
}

export default Notifications;
