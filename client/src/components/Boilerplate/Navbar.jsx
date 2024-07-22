import { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./Navbar.module.css";
import { useAuth } from "../../context/AuthContext";
import { IoIosNotifications } from "react-icons/io";
import { FaUser } from "react-icons/fa";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userData, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const [showPopup, setShowPopup] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [adminDropdown, setAdminDropdown] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (userData) {
      fetch(`http://localhost:3000/user/${userData.id}/notifications`, {
        credentials: "include",
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setNotifications(data.notifications);
          } else {
            console.error("Error fetching notifications");
          }
        })
        .catch((error) => {
          console.error("Error fetching notifications", error);
        });
    }
  }, [userData]);

  const handleNotificationClick = () => {
    setShowPopup(!showPopup);
  };

  const handleDismissAll = () => {
    fetch(
      `http://localhost:3000/user/${userData.id}/notifications/dismissAll`,
      {
        method: "PUT",
        credentials: "include",
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error dismissing all notifications");
        }
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          setNotifications([]);
        } else {
          console.error("Error dismissing all notifications");
        }
      })
      .catch((error) => {
        console.error("Error dismissing all notifications", error);
      });
  };

  if (location.pathname === "/home") {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/movies");
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const toggleAdminDropdown = () => {
    setAdminDropdown(!adminDropdown);
  };

  return (
    <div className={styles.navbar}>
      <div className={styles.nav}>
        <NavLink to={"/home"}>
          <img className={styles.logo} src="/Logo.png" alt="Logo" />
        </NavLink>
        <NavLink
          to={"/movies"}
          className={({ isActive }) => (isActive ? styles.activeLink : "")}
        >
          {t("navbar.movies")}
        </NavLink>
        <NavLink
          to={"/showtimes"}
          className={({ isActive }) => (isActive ? styles.activeLink : "")}
        >
          {t("navbar.showtimes")}
        </NavLink>
        {userData && userData.admin && (
          <div className={styles.adminDropdown} onClick={toggleAdminDropdown}>
            Admin
            {adminDropdown && (
              <div className={styles.dropdownMenu}>
                <NavLink
                  to={"/users"}
                  className={({ isActive }) =>
                    isActive ? styles.activeLink : ""
                  }
                >
                  User Management
                </NavLink>
                <NavLink
                  to={"/rooms"}
                  className={({ isActive }) =>
                    isActive ? styles.activeLink : ""
                  }
                >
                  Rooms Management
                </NavLink>
              </div>
            )}
          </div>
        )}
      </div>
      <div className={styles.account}>
        <div
          onClick={handleNotificationClick}
          className={styles.notificationIcon}
        >
          <IoIosNotifications />
          {notifications.length > 0 && (
            <span className={styles.notificationBadge}>
              {notifications.length}
            </span>
          )}
          {showPopup && (
            <div className={styles.popup}>
              {notifications.length > 0 ? (
                <>
                  {notifications.map((notification) => (
                    <div key={notification._id} className={styles.notification}>
                      <p>{notification.message}</p>
                    </div>
                  ))}
                  <button
                    onClick={handleDismissAll}
                    className={styles.dismissAllButton}
                  >
                    Dismiss All
                  </button>
                </>
              ) : (
                <p>{t("navbar.noNotifications")}</p>
              )}
            </div>
          )}
        </div>
        <div className={styles.languageContainer}>
          <span
            className={i18n.language === "ro" ? styles.activeLanguage : ""}
            onClick={() => changeLanguage("ro")}
          >
            RO
          </span>
          <span>/</span>
          <span
            className={i18n.language === "en" ? styles.activeLanguage : ""}
            onClick={() => changeLanguage("en")}
          >
            EN
          </span>
        </div>
        {userData ? (
          <div className={styles.userIcon} onClick={toggleDropdown}>
            <FaUser />
            {showDropdown && (
              <div className={styles.dropdown}>
                <p>{userData.username}</p>
                <NavLink
                  to={`/profile/${userData.id}/history`}
                  className={({ isActive }) =>
                    isActive ? styles.activeLink : ""
                  }
                >
                  {t("navbar.profile")}
                </NavLink>
                <button onClick={handleLogout}>{t("navbar.logout")}</button>
              </div>
            )}
          </div>
        ) : (
          <>
            <NavLink
              to={"/signup"}
              className={({ isActive }) => (isActive ? styles.activeLink : "")}
            >
              {t("navbar.signup")}
            </NavLink>
            <NavLink
              to={"/login"}
              className={({ isActive }) => (isActive ? styles.activeLink : "")}
            >
              {t("navbar.login")}
            </NavLink>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;
