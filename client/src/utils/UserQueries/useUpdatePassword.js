import { useMutation } from "react-query";
import toast from "react-hot-toast";

export function useUpdatePassword() {
  const { mutate: updatePassword } = useMutation({
    mutationFn: ({ userId, oldPassword, newPassword }) => {
      return fetch(`http://localhost:3000/user/${userId}/change-password`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      }).then((response) => {
        if (!response.ok) {
          throw new Error("Failed to change password");
        }
        return response.json();
      });
    },
    onSuccess: () => {
      toast.success("Password changed successfully");
    },
    onError: (error) => {
      console.error("Error changing password:", error);
      toast.error(error.message);
    },
  });

  return { updatePassword };
}
