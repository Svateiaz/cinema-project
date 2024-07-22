import { useState } from "react";
import UserNavbar from "../components/UserComponents/UserNavbar";
import UserHistory from "../components/UserComponents/UserHistory";
import styles from "./UserProfile.module.css";
import UserList from "../components/UserComponents/UserList";
import UserRatings from "../components/UserComponents/UserRatings";
import UserSettings from "../components/UserComponents/UserSettings";

function UserProfile() {
  const [activeComponent, setActiveComponent] = useState("history");

  return (
    <div className={styles.container}>
      <UserNavbar setActiveComponent={setActiveComponent} />
      <div className={styles.content}>
        {activeComponent === "history" ? <UserHistory /> : null}
        {activeComponent === "ratings" ? <UserRatings /> : null}
        {activeComponent === "bookmarks" ? <UserList /> : null}
        {activeComponent === "settings" ? <UserSettings /> : null}
      </div>
    </div>
  );
}

export default UserProfile;
