import { useMutation, useQueryClient } from "react-query";
import toast from "react-hot-toast";

export function useUpdateMovie() {
  const queryClient = useQueryClient();

  const { mutate: updateMovie } = useMutation({
    mutationFn: ({ data, movieId }) => {
      return fetch(`http://localhost:3000/movies/${movieId}`, {
        method: "PUT",
        credentials: "include",
        body: data,
      }).then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      });
    },
    onSuccess: () => {
      toast.success("Movie successfully updated");
      queryClient.invalidateQueries(["movies"]);
    },
    onError: (err) => {
      console.error("Error updating movie:", err);
      toast.error(err.message);
    },
  });

  return { updateMovie };
}
