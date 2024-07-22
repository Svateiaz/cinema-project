import { useState } from "react";
import styles from "./UserNavbar.module.css";
import { useTranslation } from "react-i18next";

// eslint-disable-next-line react/prop-types
function UserNavbar({ setActiveComponent }) {
  const [activeTab, setActiveTab] = useState("history");
  const { t } = useTranslation();
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setActiveComponent(tab);
  };

  return (
    <div className={styles.navContainer}>
      <div
        className={activeTab === "history" ? styles.active : ""}
        onClick={() => handleTabClick("history")}
      >
       {t("user.myHistory")}
      </div>
      <div
        className={activeTab === "ratings" ? styles.active : ""}
        onClick={() => handleTabClick("ratings")}
      >
      {t("user.myRatings")}
      </div>
      <div
        className={activeTab === "bookmarks" ? styles.active : ""}
        onClick={() => handleTabClick("bookmarks")}
      >
       {t("user.myBookmarks")}
      </div>
      <div
        className={activeTab === "settings" ? styles.active : ""}
        onClick={() => handleTabClick("settings")}
      >
        {t("user.userSettings")}
      </div>
    </div>
  );
}

export default UserNavbar;
