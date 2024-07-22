import { useMutation, useQueryClient } from "react-query";
import toast from "react-hot-toast";

export function useCreateShowtime() {
  const queryClient = useQueryClient();

  const { mutate: createShowtime } = useMutation({
    mutationFn: (formData) => {
      console.log("Data received in createShowtime:", formData);

      return fetch("http://localhost:3000/showtimes", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }).then(async (response) => {
        console.log("Response from server:", response);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
        }
        return response.json();
      });
    },
    onSuccess: () => {
      toast.success("Showtime successfully created");
      queryClient.invalidateQueries(["showtimes"]);
    },
    onError: (err) => {
      console.error("Error creating showtime:", err);
      toast.error(err.message);
    },
  });

  return { createShowtime };
}
