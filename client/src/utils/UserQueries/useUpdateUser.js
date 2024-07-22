import { useMutation, useQueryClient } from "react-query";
import toast from "react-hot-toast";

export function useUpdateUser() {
  const queryClient = useQueryClient();

  const { mutate: updateUser } = useMutation(
    async ({ userId, data }) => {
      const response = await fetch(`http://localhost:3000/user/${userId}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`Error updating user: ${response.statusText}`);
      }
      return response.json();
    },
    {
      onSuccess: () => {
        toast.success("User details updated successfully");
        queryClient.invalidateQueries("user");
      },
      onError: (err) => {
        toast.error(`Error: ${err.message}`);
      },
    }
  );

  return { updateUser };
}
