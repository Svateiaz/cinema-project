import { useGetShowtimesByUser } from "../../utils/ShowtimesQueries/useGetShowtimes";
import styles from "./UserHistory.module.css";
import { useAuth } from "../../context/AuthContext";
import Spinner from "../Spinner";
import { useTranslation } from "react-i18next";

function UserHistory() {
  const { t, i18n } = useTranslation();
  const { userData } = useAuth();
  const { data: userShowtimes, isLoading, isError } = useGetShowtimesByUser(userData.id);
  console.log(userShowtimes);

  if (isLoading) {
    return <Spinner />;
  }

  if (isError || !userShowtimes?.data) {
    return <div>{t("errorFetchingData")}</div>;
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleString(i18n.language, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  return (
    <div className={styles.historyContainer}>
      <h2>{t("user.myHistory")}</h2>
      <table className={styles.historyTable}>
        <thead>
          <tr>
            <th>{t("user.title")}</th>
            <th>{t("user.showtime")}</th>
            <th>{t("user.seats")}</th>
            <th>{t("user.purchaseDate")}</th>
            <th>{t("user.ticketPrice")}</th>
            <th>{t("user.amountPaid")}</th>
            <th>{t("user.ticketCode")}</th>
          </tr>
        </thead>
        <tbody>
          {userShowtimes?.data.map((showtime, index) => {
            const seatCount = showtime.seats ? showtime.seats.length : 0;
            const amountPaid = seatCount * showtime.showtime.ticketPrice;

            return (
              <tr key={index}>
                <td>{i18n.language === "en" ? showtime.movie.enTitle : showtime.movie.roTitle}</td>
                <td>{formatDate(showtime.showtime.showtime)}</td>
                <td>
                  {showtime.seats && showtime.seats.length > 0
                    ? showtime.seats.map((seat) => `${seat.row}${seat.column}`).join(", ")
                    : t("user.noSeatsSelected")}
                </td>
                <td>{formatDate(showtime.boughtDate)}</td>
                <td>{showtime.showtime.ticketPrice}</td>
                <td>{amountPaid}</td>
                <td>{showtime.ticketCode}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default UserHistory;
