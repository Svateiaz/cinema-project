import { useMutation, useQueryClient } from "react-query";
import toast from "react-hot-toast";

export function useUpdateRoom() {
  const queryClient = useQueryClient();

  const { mutate: updateRoom } = useMutation({
    mutationFn: ({ data, roomId }) => {
      return fetch(`http://localhost:3000/rooms/${roomId}`, {
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
      toast.success("Room successfully updated");
      queryClient.invalidateQueries(["rooms"]);
    },
    onError: (err) => {
      console.error("Error updating room:", err);
      toast.error(err.message);
    },
  });

  return { updateRoom };
}
