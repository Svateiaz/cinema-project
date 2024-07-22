import { useMutation, useQueryClient } from "react-query";
import toast from "react-hot-toast";

export function useCreateRoom() {
  const queryClient = useQueryClient();

  const { mutate: createRoom } = useMutation({
    mutationFn: (newData) => {
      return fetch("http://localhost:3000/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(newData),
      }).then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      });
    },
    onSuccess: () => {
      toast.success("Room successfully created");
      queryClient.invalidateQueries(["rooms"]);
    },
    onError: (err) => {
      console.error("Error creating room:", err);
      toast.error(err.message);
    },
  });

  return { createRoom };
}
