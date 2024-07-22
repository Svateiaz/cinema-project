import { useQuery } from "react-query";

export function useGetShowtimes(date) {
  return useQuery(["showtimes", date], async () => {
    const res = await fetch(`http://localhost:3000/showtimes?date=${date}`);
    if (!res.ok) {
      throw new Error("Could not fetch showtimes");
    }
    return res.json();
  });
}

export function useGetShowtime(showtimeId) {
  return useQuery(["showtime", showtimeId], async () => {
    const res = await fetch(`http://localhost:3000/showtimes/${showtimeId}`);
    if (!res.ok) {
      throw new Error(
        `Could not fetch showtime with showtimeId: ${showtimeId}`
      );
    }
    const showtime = await res.json();
    console.log(showtime);
    return showtime.data;
  });
}

export function useGetShowtimesByMovie(movieId) {
  return useQuery(["showtime", movieId], async () => {
    const res = await fetch(`http://localhost:3000/showtimes/movie/${movieId}`);
    if (!res.ok) {
      throw new Error(`Could not fetch showtimes for movie: ${movieId}`);
    }
    const showtime = await res.json();
    console.log(showtime);
    return showtime.data;
  });
}

export function useGetShowtimesByUser(userId) {
  return useQuery(["showtimes", userId], async () => {
    const res = await fetch(`http://localhost:3000/user/${userId}/showtimes`, {
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error("Could not fetch user showtimes");
    }
    return res.json();
  });
}
