import { useTranslation } from "react-i18next";
import styles from "./PurchaseConfirmation.module.css";

function PurchaseConfirmation() {
  const { t } = useTranslation();
  return (
    <div className={styles.confirmationContainer}>
      <h2 className={styles.title}>{t("booking.purchaseTitle")}</h2>
      <p className={styles.message}>{t("booking.confirmationFirst")} </p>
      <p className={styles.message}>{t("booking.confirmationSecond")}</p>
      <p className={styles.message}>{t("booking.confirmationThird")}</p>
    </div>
  );
}

export default PurchaseConfirmation;
