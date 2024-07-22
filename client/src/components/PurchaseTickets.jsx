import { useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./PurchaseTickets.module.css";
import PurchaseConfirmation from "./PurchaseConfirmation"; 

// eslint-disable-next-line react/prop-types, no-unused-vars
function PurchaseTickets({ handleBuyNow, selectedSeats }) {
  const [cardNumber, setCardNumber] = useState("");
  const [ccv, setCcv] = useState("");
  const [expiration, setExpiration] = useState("");
  const [name, setName] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const { t } = useTranslation();

  const handleCardNumberChange = (e) => {
    const input = e.target.value.replace(/\D/g, "");
    const formattedInput = input.replace(/(\d{4})/g, "$1 ").trim();
    setCardNumber(formattedInput);
  };

  const handleExpirationChange = (e) => {
    const input = e.target.value.replace(/\D/g, "");
    if (input.length <= 4) {
      setExpiration(input.replace(/(\d{2})(\d{0,2})/, "$1/$2"));
    }
  };

  const handleCcvChange = (e) => {
    const input = e.target.value.replace(/\D/g, "");
    if (input.length <= 4) {
      setCcv(input);
    }
  };

  const isCcvValid = () => {
    return ccv.length === 3 || ccv.length === 4;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const paymentInfo = { name, cardNumber, expiration, ccv };
    await handleBuyNow(e, paymentInfo);
    setIsConfirmed(true); 
  };

  return (
    <div className={styles.cardContainer}>
      {isConfirmed ? (
        <PurchaseConfirmation />
      ) : (
        <div className={styles.paymentDetails}>
          <h1>{t("booking.paymentDetails")}</h1>

          <form className={styles.cardDetails} onSubmit={handleSubmit}>
            {" "}
            <label htmlFor="name">{t("booking.cardName")}</label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <label htmlFor="number">{t("booking.cardNumber")}</label>
            <input
              type="text"
              name="number"
              value={cardNumber}
              maxLength={19}
              onChange={handleCardNumberChange}
              required
            />
            <div className={styles.expirationCCV}>
              <div className={styles.expCCVInput}>
                <label htmlFor="expiration">
                  {t("booking.expirationDate")}
                </label>
                <input
                  type="text"
                  name="expiration"
                  value={expiration}
                  placeholder="MM/YY"
                  onChange={handleExpirationChange}
                  required
                />
              </div>
              <div className={styles.expCCVInput}>
                <label htmlFor="ccv">CCV</label>
                <input
                  type="password"
                  name="ccv"
                  value={ccv}
                  placeholder="123"
                  maxLength={4}
                  onChange={handleCcvChange}
                  required
                />
              </div>
            </div>
            <div className={styles.checkoutButton}></div>
            <button className={styles.proceed} disabled={!isCcvValid()}>
              {t("booking.purchaseTickets")}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default PurchaseTickets;
