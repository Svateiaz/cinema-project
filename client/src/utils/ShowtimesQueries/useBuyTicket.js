import { useMutation } from "react-query";

function useBuyTicket(userData, showtimeId) {
  const buyTickets = useMutation(async ({ selectedSeats, ...paymentInfo }) => {
    if (!showtimeId) {
      throw new Error("showtimeId is not defined");
    }

    if (!Array.isArray(selectedSeats)) {
      throw new Error("selectedSeats must be an array");
    }

    const payload = {
      showtimeId,
      selectedSeats: selectedSeats.map(([row, column]) => ({
        row,
        column,
      })),
      ...paymentInfo,
    };

    console.log("Request Payload:", payload);

    const res = await fetch(
      `http://localhost:3000/user/buy-tickets/${userData.id}`,
      {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Failed to buy tickets:", errorText);
      throw new Error("Failed to buy tickets.");
    }

    return res.json();
  });

  return { mutate: buyTickets.mutate };
}

export default useBuyTicket;
