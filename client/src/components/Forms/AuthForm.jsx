/* eslint-disable react/prop-types */
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import toast from "react-hot-toast";
import styles from "./AuthForm.module.css";
import { useAuth } from "../../context/AuthContext";

const AuthForm = ({ title, apiEndpoint, successRedirect, isSignUp }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const mutation = useMutation(
    async ({ email, password, username }) => {
      const requestBody = isSignUp
        ? { email, password, username }
        : { email, password };

      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
        credentials: "include", 
      });

      if (!response.ok) {
        throw new Error(`${title} failed`);
      }

      const data = await response.json();

      console.log("User Data:", data);

      return data;
    },
    {
      onSuccess: (data) => {
        const { user } = data;
        login(user);
        toast.success("Welcome");
        navigate(successRedirect);
      },
      onError: (error) => {
        toast.error("Wrong email or password. Try again.");
        console.error(`Error during ${title.toLowerCase()}:`, error);
      },
    }
  );

  const handleAuth = (e) => {
    e.preventDefault();
    mutation.mutate({ email, password, username });
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginText}>
        <p>{title}</p>
      </div>
      <form onSubmit={handleAuth} className={styles.form}>
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {isSignUp && (
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        )}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className={styles.loginButton}>
          {isSignUp ? "Create Account" : `${title} to your account`}
        </button>
      </form>
      <div className={styles.loginDetails}>
        <p>
          {`Do not have an account? `}
          {title === "Login" ? (
            <NavLink to="/signup" className={styles.highlightButton}>
              Sign up
            </NavLink>
          ) : (
            <NavLink to="/login" className={styles.highlightButton}>
              Login
            </NavLink>
          )}
        </p>
        <p>
          Click{" "}
          <NavLink to="/forgot-password" className={styles.highlightButton}>
            here
          </NavLink>{" "}
          if you forgot your email or password!
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
