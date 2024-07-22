import { useLocation } from "react-router";
import styles from "./Footer.module.css";

function Footer() {
  const location = useLocation();
  const hiddenPaths = ["/home", "/signup", "/login", "/forgot-password", "/reset-password"];

  if (hiddenPaths.includes(location.pathname)) {
    return null;
  }

  return (
    <footer className={styles.footer}>
      <ul className={styles.footerText}>
        <h3>About us</h3>
        <li>Oras, strada, numar</li>
        <li>FAQ</li>
      </ul>

      <ul className={styles.footerText}>
        <h3>Contact</h3>
        <li>cinemedia-contact@gmail.com</li>
        <li>+74 235 9912</li>
      </ul>

      <ul className={styles.footerText}>
        <h3>Social Media</h3>
        <li>GITHUB</li>
      </ul>

      <p>&copy; 2024 Cinemedia. All Rights Reserved.</p>
    </footer>
  );
}

export default Footer;
