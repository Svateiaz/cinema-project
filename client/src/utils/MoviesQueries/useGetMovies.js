import { useQuery } from "react-query";

export function useGetMovies(selectedGenre, selectedRating) {
  return useQuery(["movies", selectedGenre, selectedRating], async () => {
    let url = "http://localhost:3000/movies";
    if (selectedGenre || selectedRating) {
      url += "?";
      if (selectedGenre) {
        url += `genre=${selectedGenre}`;
      }
      if (selectedRating) {
        url += `${selectedGenre ? "&" : ""}rating=${selectedRating}`;
      }
    }

    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("Could not fetch movies");
    }
    const movies = await res.json();
    return movies.data;
  });
}

export function useGetUpcomingMovies() {
  return useQuery("upcomingMovies", async () => {
    const res = await fetch("http://localhost:3000/movies/upcoming");
    if (!res.ok) {
      throw new Error("Could not fetch upcoming movies");
    }
    const movies = await res.json();
    return movies.data;
  });
}

export function useGetMovieById(movieId) {
  return useQuery(["movie", movieId], async () => {
    const res = await fetch(`http://localhost:3000/movies/${movieId}`);
    if (!res.ok) {
      throw new Error(`Could not fetch movie with id: ${movieId}`);
    }
    const movie = await res.json();
    return movie.data;
  });
}
export function useGetRecommendations(userId) {
  return useQuery(["recommendations", userId], async () => {
    const res = await fetch(
      `http://localhost:3000/movies/recommendations/${userId}`,
      {
        credentials: "include",
      }
    );
    if (!res.ok) {
      throw new Error(
        `Could not fetch recommendations for user with id: ${userId}`
      );
    }
    const data = await res.json();
    return data.data;
  });
}

export function useGetBookmarkedMovies(userId) {
  return useQuery(["bookmarkedMovies", userId], async () => {
    const res = await fetch(`http://localhost:3000/user/${userId}/bookmarks`, {
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error(
        `Could not fetch bookmarked movies for user with id: ${userId}`
      );
    }
    const data = await res.json();
    return data.bookmarks;
  });
}

export function useGetUserReviews(userId) {
  return useQuery(["userReviews", userId], async () => {
    const res = await fetch(`http://localhost:3000/user/${userId}/reviews`, {
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error("Could not fetch user reviews");
    }
    return res.json();
  });
}
