import { useState, useEffect } from "react";
import PasswordForm from "../components/Forms/PasswordForm";
import styles from "./ResetPassword.module.css";

function ResetPassword() {
  const [timeLeft, setTimeLeft] = useState(300); 

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <div className={styles.container}>
      <PasswordForm
        title="Reset Password"
        apiEndpoint="http://localhost:3000/user/reset-password"
        successMessage="Password changed successfully."
        inputLabel="Code"
        inputType="password"
        redirectPath="/login"
      />
      <div className={styles.timer}>
        <p>
          Time left until expiration: <span className={styles.counter}>{formatTime(timeLeft)}</span>{" "}
        </p>
      </div>
    </div>
  );
}

export default ResetPassword;
