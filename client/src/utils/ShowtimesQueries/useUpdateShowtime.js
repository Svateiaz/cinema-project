import { useMutation, useQueryClient } from "react-query";
import toast from "react-hot-toast";

export function useUpdateShowtime() {
  const queryClient = useQueryClient();

  const { mutate: updateShowtime } = useMutation({
    mutationFn: ({ data, showtimeId }) => {
      return fetch(`http://localhost:3000/showtimes/${showtimeId}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }).then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      });
    },
    onSuccess: () => {
      toast.success("Showtime successfully updated");
      queryClient.invalidateQueries(["showtimes"]);
    },
    onError: (err) => {
      console.error("Error updating showtime:", err);
      toast.error(err.message);
    },
  });

  return { updateShowtime };
}

export default useUpdateShowtime;
