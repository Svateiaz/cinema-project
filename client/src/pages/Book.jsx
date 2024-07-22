import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useParams } from "react-router";
import { useGetShowtime } from "../utils/ShowtimesQueries/useGetShowtimes";
import useBuyTicket from "../utils/ShowtimesQueries/useBuyTicket";
import useReserveSeat from "../utils/ShowtimesQueries/useReserveSeat";
import PriceOverview from "../components/PriceOverview";
import { MdEventSeat } from "react-icons/md";
import { useTranslation } from "react-i18next"; 
import styles from "./Book.module.css";

function Legend() {
  const { t } = useTranslation();

  return (
    <div className={styles.legend}>
      <div className={styles.legendItem}>
        <MdEventSeat className={styles.availableSeatIcon} />
        <span>{t("booking.available")}</span>
      </div>
      <div className={styles.legendItem}>
        <MdEventSeat className={styles.reservedSeatIcon} />
        <span>{t("booking.reserved")}</span>
      </div>
      <div className={styles.legendItem}>
        <MdEventSeat className={styles.selectedSeatIcon} />
        <span>{t("booking.selected")}</span>
      </div>
    </div>
  );
}

function Book() {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [hasScrolled, setHasScrolled] = useState(false); 
  const priceOverviewRef = useRef(null); 

  const { showtimeId } = useParams();
  const { data: showtime, isLoading, error } = useGetShowtime(showtimeId);
  const { userData } = useAuth();
  const { mutate: buyTicketsMutation } = useBuyTicket(userData, showtimeId);
  const { mutate: reserveSeatMutation } = useReserveSeat(showtimeId);
  const isAuthenticated = !!userData;

  const handleSeatClick = (row, column) => {
    const updatedSeats = [...selectedSeats];
    const seatIndex = updatedSeats.findIndex(
      (seat) => seat[0] === row && seat[1] === column
    );

    if (seatIndex !== -1) {
      updatedSeats.splice(seatIndex, 1);
    } else {
      updatedSeats.push([row, column]);
    }

    setSelectedSeats(updatedSeats);
  };

  const handleBuyNow = async (e, paymentInfo) => {
    e.preventDefault();
    console.log("Reserving and purchasing tickets");
    try {
      if (!Array.isArray(selectedSeats) || selectedSeats.length === 0) {
        throw new Error("No seats selected");
      }
      await reserveSeatMutation(selectedSeats);
      await buyTicketsMutation({ selectedSeats, ...paymentInfo });
      console.log("Successfully bought");
    } catch (error) {
      console.error("Failed to reserve and buy tickets:", error);
    }
  };

  useEffect(() => {
    if (selectedSeats.length > 0 && priceOverviewRef.current && !hasScrolled) {
      priceOverviewRef.current.scrollIntoView({ behavior: "smooth" });
      setHasScrolled(true); 
    }
  }, [selectedSeats, hasScrolled]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !showtime) {
    return <div>Error: {error ? error.message : "Showtime not found"}</div>;
  }

  const generateSeatingMatrix = (rows, columns) => {
    const matrix = [];

    for (let i = 0; i < rows; i++) {
      const row = Array.from({ length: columns }, (_, index) => index + 1);
      matrix.push(row);
    }

    return matrix;
  };

  const seatingMatrix = generateSeatingMatrix(
    showtime.room.seats.rows,
    showtime.room.seats.columns
  );

  return (
    <div>
      <div className={styles.seatsContainer}>
        <div className={styles.seats}>
          <div className={styles.screenIndicator}></div>
          {seatingMatrix.map((row, rowIndex) => (
            <div key={rowIndex} className={styles.seatsRow}>
              {row.map((seatNumber) => {
                const isReserved = showtime.reservedSeats.some(
                  (seat) => seat[0] === rowIndex + 1 && seat[1] === seatNumber
                );
                const isReservingNow = selectedSeats.some(
                  (seat) => seat[0] === rowIndex + 1 && seat[1] === seatNumber
                );

                return (
                  <button
                    className={`${styles.seat} ${
                      isReserved ? styles.seatIsReserved : ""
                    } ${isReservingNow ? styles.seatReservingNow : ""}`}
                    key={seatNumber}
                    onClick={() => handleSeatClick(rowIndex + 1, seatNumber)}
                    disabled={!isAuthenticated}
                  >
                    <MdEventSeat className={styles.seatIcon} />
                  </button>
                );
              })}
            </div>
          ))}
          <Legend />
        </div>
      </div>

      {selectedSeats.length > 0 && (
        <div ref={priceOverviewRef}>
          <PriceOverview
            selectedSeats={selectedSeats}
            showtime={showtime}
            movie={showtime.movie}
            handleBuyNow={handleBuyNow}
          />
        </div>
      )}
    </div>
  );
}

export default Book;
