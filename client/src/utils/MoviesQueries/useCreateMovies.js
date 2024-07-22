import { useMutation, useQueryClient } from "react-query";
import toast from "react-hot-toast";

export function useCreateMovie() {
  const queryClient = useQueryClient();

  const { mutate: createMovie } = useMutation({
    mutationFn: (formData) => {
      return fetch("http://localhost:3000/movies", {
        method: "POST",
        credentials: "include",
        body: formData,
      }).then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      });
    },
    onSuccess: () => {
      toast.success("Movie successfully created");
      queryClient.invalidateQueries(["movies"]);
    },
    onError: (err) => {
      console.error("Error creating movie:", err);
      toast.error(err.message);
    },
  });

  return { createMovie };
}
