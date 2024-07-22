import { useMutation, useQueryClient } from "react-query";

function useReserveSeat(showtimeId) {
  const queryClient = useQueryClient();

  const reserveSeatMutation = useMutation(
    async (selectedSeats) => {
      const res = await fetch(`http://localhost:3000/showtimes/${showtimeId}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reservedSeats: selectedSeats }),
      });

      if (!res.ok) {
        throw new Error("Failed to reserve seats.");
      }

      return res.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["showtime", showtimeId]);
        queryClient.invalidateQueries(["showtimes"]);
      },
    }
  );

  return {
    mutate: reserveSeatMutation.mutate,
    isLoading: reserveSeatMutation.isLoading,
    isError: reserveSeatMutation.isError,
  };
}

export default useReserveSeat;
