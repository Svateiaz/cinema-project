import { useMutation, useQuery, useQueryClient } from "react-query";

export function useGetUsers() {
  return useQuery("users", async () => {
    const res = await fetch(`http://localhost:3000/user/all-users`, {
      credentials: 'include'
    });
    if (!res.ok) {
      throw new Error("Could not fetch users");
    }
    const data = await res.json();
    const transformedData = data.users.map((user, index) => ({
      ...user,
      id: user._id || index,
    }));
    return transformedData;
  });
}

export function useToggleAdminStatus() {
  const queryClient = useQueryClient();

  return useMutation(
    async (userId) => {
      const res = await fetch(
        `http://localhost:3000/user/${userId}/toggle-admin`,
        {
          method: "PUT",
          credentials: 'include'
        }
      );
      if (!res.ok) {
        throw new Error("Failed to toggle admin status");
      }
      return res.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("users");
      },
    }
  );
}
