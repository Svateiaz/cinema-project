import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useUpdateUser } from "../../utils/UserQueries/useUpdateUser";
import styles from "./UserSettings.module.css";
import { useUpdatePassword } from "../../utils/UserQueries/useUpdatePassword";
import { useTranslation } from "react-i18next";

function UserSettings() {
  const { userData } = useAuth();
  const { updateUser } = useUpdateUser();
  const { updatePassword } = useUpdatePassword();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    if (userData) {
      setFormData({
        username: userData.username,
        email: userData.email,
        password: "",
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser({ userId: userData.id, data: formData });
    } catch (error) {
      console.error("Error updating user details:", error);
    }
  };

  const handleUpdatePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      await updatePassword({
        userId: userData.id,
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordData({ oldPassword: "", newPassword: "" });
    } catch (error) {
      console.error("Error changing password:", error);
    }
  };

  return (
    <>
      <h2 className={styles.sectionTitle}>Settings</h2>
      <div className={styles.container}>
        <div className={styles.settingsContainer}>
          <div>
            <form onSubmit={handleUpdatePasswordSubmit} className={styles.form}>
              <label className={styles.label}>
              {t("user.oldPassword")}
                <input
                  type="password"
                  name="oldPassword"
                  value={passwordData.oldPassword}
                  onChange={handlePasswordChange}
                  className={styles.input}
                />
              </label>
              <label className={styles.label}>
              {t("user.newPassword")}
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className={styles.input}
                />
              </label>
              <button type="submit" className={styles.button}>
                Change Password
              </button>
            </form>
          </div>
          
          <div>
            <form onSubmit={handleSubmit} className={styles.form}>
              <label className={styles.label}>
                Username:
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={styles.input}
                />
              </label>
              <label className={styles.label}>
                Email:
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={styles.input}
                />
              </label>
              <button type="submit" className={styles.button}>
                Update
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserSettings;
