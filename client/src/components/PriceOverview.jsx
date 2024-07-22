/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import styles from "./PriceOverview.module.css";
import PurchaseTickets from "./PurchaseTickets";

function PriceOverview({ selectedSeats, showtime, movie, handleBuyNow }) {
  const [purchasingTickets, setPurchasingTickets] = useState(false);
  const pricePerTicket = showtime?.ticketPrice || 0;
  const { i18n, t } = useTranslation(); 

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: "2-digit", month: "long", year: "numeric" };
    return date.toLocaleDateString(i18n.language, options); 
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const options = { hour: "2-digit", minute: "2-digit" };
    return date.toLocaleTimeString(i18n.language, options); 
  };

  const calculateDiscountedPrice = (price) => {
    return price * 0.75;
  };

  const [ticketTypes, setTicketTypes] = useState({});

  const handleTicketTypeChange = (seatIndex, ticketType) => {
    setTicketTypes((prevTypes) => ({
      ...prevTypes,
      [seatIndex]: ticketType,
    }));
  };

  useEffect(() => {
    // eslint-disable-next-line no-unused-vars
    const totalPrice = selectedSeats.reduce((total, [_, __], index) => {
      const ticketType = ticketTypes[index] || "basic";
      const ticketPrice =
        ticketType === "basic"
          ? pricePerTicket
          : calculateDiscountedPrice(pricePerTicket);
      return total + ticketPrice;
    }, 0);

    setTotalPrice(totalPrice);
  }, [selectedSeats, ticketTypes, pricePerTicket]);

  const [totalPrice, setTotalPrice] = useState(0);

  const getTitle = (movie) => {
    return i18n.language === "en" ? movie.enTitle : movie.roTitle;
  };

  return (
    <div className={styles.container}>
      <div className={styles.ticketDetails}>
        <div className={styles.movieDetailsContainer}>
          <img
            src={movie.poster}
            className={styles.movieImage}
            alt={getTitle(movie)}
          />
          <div className={styles.movieDetails}>
            <h5>{t("booking.showtimeDetails")}:</h5>
            <h3 className={styles.movieTitle}>{getTitle(movie)}</h3>
            <div>{formatDate(showtime.showtime)}</div>
            <div>{formatTime(showtime.showtime)}</div>
            <div>{showtime.room.name}</div>
          </div>
        </div>

        <hr />

        <div className={styles.ticketsContainer}>
          <p className={styles.title}>Tickets: {selectedSeats.length}</p>
          {selectedSeats.map(([row, column], index) => (
            <div key={index}>
              <p>
              {t("booking.seat")}: {t("booking.row")} {row}, {t("booking.column")} {column}
              </p>
              <select
                className={styles.selectTickets}
                value={ticketTypes[index] || "basic"}
                onChange={(e) => handleTicketTypeChange(index, e.target.value)}
              >
                <option value="basic">Basic ({pricePerTicket} RON)</option>
                <option value="student">
                  Student ({calculateDiscountedPrice(pricePerTicket)} RON)
                </option>
                <option value="senior">
                  Senior ({calculateDiscountedPrice(pricePerTicket)} RON)
                </option>
              </select>
            </div>
          ))}
        </div>

        <div>
          <p className={styles.title}>{t("booking.totalPrice")}</p>
          <p className={styles.value}>{totalPrice} RON</p>
        </div>

        {!purchasingTickets && (
          <button onClick={() => setPurchasingTickets(true)} className={styles.proceedButton}>
            {t("booking.proceedToPayout")}
          </button>
        )}
        {purchasingTickets && <PurchaseTickets handleBuyNow={handleBuyNow} />}
      </div>
    </div>
  );
}

export default PriceOverview;
