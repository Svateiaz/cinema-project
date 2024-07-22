import { useQuery } from "react-query";

export function useGetRooms() {
  return useQuery("rooms", async () => {
    const res = await fetch(`http://localhost:3000/rooms`, {
      credentials: 'include' 
    });
    if (!res.ok) {
      throw new Error("Could not fetch room details");
    }
    return res.json();
  });
}

export function useGetRoom(roomId) {
  return useQuery(["roomDetails", roomId], async () => {
    const res = await fetch(`http://localhost:3000/rooms/${roomId}`, {
      credentials: 'include' 
    });
    if (!res.ok) {
      throw new Error("Could not fetch room details");
    }
    return res.json();
  });
}
