import { useMutation, useQueryClient } from "react-query";
import toast from "react-hot-toast";

export function useDeleteRoom() {
  const queryClient = useQueryClient();

  const { mutate: deleteRoom } = useMutation({
    mutationFn: (roomId) => {
      return fetch(`http://localhost:3000/rooms/${roomId}`, {
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
      toast.success("Room successfully deleted");
      queryClient.invalidateQueries(["rooms"]);
    },
    onError: (err) => {
      console.error("Error deleting room:", err);
      toast.error(err.message);
    },
  });

  return { deleteRoom };
}

export default useDeleteRoom;
