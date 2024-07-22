/* eslint-disable react/prop-types */
import { useState } from "react";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import styles from "./AuthForm.module.css";

const PasswordForm = ({ title, apiEndpoint, successMessage, inputLabel, inputType = "text", redirectPath, formType }) => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleCodeChange = (index, value) => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
  };

  const handleKeyUp = (e, index) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      document.getElementById(`code-input-${index - 1}`).focus();
    } else if (e.key !== "Backspace" && index < 5) {
      document.getElementById(`code-input-${index + 1}`).focus();
    }
  };

  const mutation = useMutation(
    async ({ code, newPassword, email }) => {
      const body = formType === "forgot" ? { email } : { code: code.join(""), newPassword };
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error response from server: ${errorText}`);
        throw new Error(`${title} failed`);
      }

      const data = await response.json();
      return data;
    },
    {
      onSuccess: (data) => {
        console.log(`${title} successful:`, data);
        alert(successMessage);
        if (redirectPath) {
          navigate(redirectPath);
        }
      },
      onError: (error) => {
        console.error(`Error during ${title.toLowerCase()}:`, error);
      },
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ code, newPassword, email });
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginText}>
        <p>{title}</p>
      </div>
      <form onSubmit={handleSubmit} className={styles.form}>
        {formType === "forgot" ? (
          <input
            type={inputType}
            placeholder={inputLabel}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        ) : (
          <>
            <div className={styles.codeInputContainer}>
              {code.map((digit, index) => (
                <input
                  key={index}
                  id={`code-input-${index}`}
                  type="text"
                  className={styles.codeInput}
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyUp={(e) => handleKeyUp(e, index)}
                />
              ))}
            </div>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </>
        )}
        <button type="submit" className={styles.submitButton}>
          {title}
        </button>
      </form>
    </div>
  );
};

export default PasswordForm;
