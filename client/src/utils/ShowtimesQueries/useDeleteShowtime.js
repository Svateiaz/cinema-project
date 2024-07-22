import { useMutation, useQueryClient } from "react-query";
import toast from "react-hot-toast";

export function useDeleteShowtime() {
  const queryClient = useQueryClient();

  const { mutate: deleteShowtime } = useMutation({
    mutationFn: (showtimeId) => {
      return fetch(`http://localhost:3000/showtimes/${showtimeId}`, {
        method: "DELETE",
        credentials: "include",
      }).then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      });
    },
    onSuccess: () => {
      toast.success("Showtime successfully deleted");
      queryClient.invalidateQueries(["showtimes"]);
    },
    onError: (err) => {
      console.error("Error deleting showtime:", err);
      toast.error(err.message);
    },
  });

  return { deleteShowtime };
}

export default useDeleteShowtime;
