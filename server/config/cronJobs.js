import cron from "node-cron";
import User from "./../models/User.js";
import Movies from "./../models/movies.js";

const checkForMovieReleases = async () => {
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const sevenDaysLater = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  const sevenDaysLaterStr = sevenDaysLater.toISOString().split("T")[0];

  const moviesReleasingToday = await Movies.find({ releaseDate: todayStr });
  const moviesReleasingIn7Days = await Movies.find({
    releaseDate: sevenDaysLaterStr,
  });

  if (
    moviesReleasingToday.length === 0 &&
    moviesReleasingIn7Days.length === 0
  ) {
    return;
  }

  const movieIdsToday = moviesReleasingToday.map((movie) =>
    movie._id.toString()
  );
  const movieIds7Days = moviesReleasingIn7Days.map((movie) =>
    movie._id.toString()
  );
  const usersToUpdate = await User.find({
    bookmarks: { $in: [...movieIdsToday, ...movieIds7Days] },
  });

  for (const user of usersToUpdate) {
    const notifications = user.notifications || [];

    moviesReleasingToday.forEach((movie) => {
      if (
        !notifications.some(
          (notification) =>
            notification.movieId.toString() === movie._id.toString() &&
            notification.message.includes("releasing today")
        )
      ) {
        notifications.push({
          movieId: movie._id,
          message: `Movie "${movie.title}" is releasing today on ${todayStr}!`,
          date: new Date(),
        });
      }
    });

    moviesReleasingIn7Days.forEach((movie) => {
      if (
        !notifications.some(
          (notification) =>
            notification.movieId.toString() === movie._id.toString() &&
            notification.message.includes("releasing in a week")
        )
      ) {
        notifications.push({
          movieId: movie._id,
          message: `Movie "${movie.title}" will release in a week on ${sevenDaysLaterStr}!`,
          date: new Date(),
        });
      }
    });

    user.notifications = notifications;
    await user.save();
  }
};

cron.schedule("* * * * *", checkForMovieReleases);
