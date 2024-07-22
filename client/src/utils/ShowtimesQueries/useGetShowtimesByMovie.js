import { useQuery } from "react-query";

export function useGetShowtimesByMovie(movieId) {
  return useQuery(["showtimesByMovie", movieId], async () => {
    const res = await fetch(`http://localhost:3000/showtimes?movie=${movieId}`);
    if (!res.ok) {
      throw new Error("Could not fetch showtimes by movie");
    }
    return res.json();
  });
}
