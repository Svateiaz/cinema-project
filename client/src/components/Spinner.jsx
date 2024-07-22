import styles from './Spinner.module.css';

function Spinner() {
  return (
    <div className={styles.spinnerContainer}>
      <div className={styles.spinner}>
        <div className={styles.loading}></div>
      </div>
    </div>
  );
}

export default Spinner;
