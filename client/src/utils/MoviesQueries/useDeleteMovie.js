import { useMutation, useQueryClient } from "react-query";
import toast from "react-hot-toast";

export function useDeleteMovie() {
  const queryClient = useQueryClient();

  const { mutate: deleteMovie } = useMutation({
    mutationFn: (movieId) => {
      return fetch(`http://localhost:3000/movies/${movieId}`, {
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
      toast.success("Movie successfully deleted");
      queryClient.invalidateQueries(["movies"]);
    },
    onError: (err) => {
      console.error("Error deleting movie:", err);
      toast.error(err.message);
    },
  });

  return { deleteMovie };
}

export default useDeleteMovie;
