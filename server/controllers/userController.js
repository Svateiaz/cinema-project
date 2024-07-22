import passport from "passport";
import passportLocal from "passport-local";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import { sendPasswordResetCode } from "../config/emailConfig.js"; 
import Movies from "../models/movies.js";

const LocalStrategy = passportLocal.Strategy;
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return done(null, false, { message: "Wrong email or password" });
        }

        const isValidPassword = await user.isValidPassword(password);
        if (!isValidPassword) {
          return done(null, false, { message: "Wrong email or password." });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export const login = async (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.log("Authentication error:", err);
      return next(err);
    }
    if (!user) {
      console.log("Authentication failed:", info.message);
      return res.status(401).json({ success: false, message: info.message });
    }

    req.logIn(user, (loginErr) => {
      if (loginErr) {
        console.log("Login error:", loginErr);
        return next(loginErr);
      }

      req.session.user = {
        id: user._id,
        email: user.email,
        username: user.username,
        admin: user.admin,
      };

      console.log("User session:", req.session.user);

      return res.status(200).json({
        success: true,
        message: "Successfully logged in",
        user: req.session.user,
      });
    });
  })(req, res, next);
};

export const logout = (req, res) => {
  req.logout();

  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
    }
  });

  res.status(200).json({ success: true, message: "Successfully logged out" });
};

export const fetchUser = async (req, res) => {
  try {
    if (req.isAuthenticated()) {
      const user = await User.findById(req.user._id).populate({
        path: "tickets.showtimeId",
        model: "Showtime",
      });

      res.json({ user });
    } else {
      res.status(401).json({ message: "Authorization required" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching user", error: err.message });
  }
};

export const fetchAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "username email admin");
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: "Error fetching users" });
  }
};

export const createUser = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      username,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(201).json({ success: true, user: newUser });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error creating user" });
  }
};

export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  console.log(`Request received to reset password for email: ${email}`);
  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`No user found with email: ${email}`);
      return res.status(404).json({ message: "User not found" });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedCode = await bcrypt.hash(code, 10);
    user.resetPasswordCode = hashedCode;
    user.resetPasswordExpires = Date.now() + 300000; 
    await user.save();

    await sendPasswordResetCode(user.email, code);

    res.status(200).json({ message: "Password reset code sent to your email" });
  } catch (error) {
    console.error("Error requesting password reset:", error);
    res.status(500).json({ message: "Error requesting password reset", error });
  }
};

export const resetPassword = async (req, res) => {
  const { code, newPassword } = req.body;
  console.log(`Received code: ${code}, newPassword: ${newPassword}`); 

  try {
    const user = await User.findOne({
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      console.log(`User not found or code expired`);
      return res.status(400).json({ message: "Invalid or expired code" });
    }

    const isCodeValid = await bcrypt.compare(code, user.resetPasswordCode);
    if (!isCodeValid) {
      return res.status(400).json({ message: "Invalid code" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordCode = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    console.log("Password reset successful");
    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Error resetting password", error });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { username, email, password } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 10);

    await user.save();

    res
      .status(200)
      .json({ success: true, message: "User updated successfully", user });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const changePassword = async (req, res) => {
  const { userId } = req.params;
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Old password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error changing password",
        error: err.message,
      });
  }
};

export const changeUserStatus = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    user.admin = !user.admin;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Admin status updated", user });
  } catch (error) {
    console.error("Error updating admin status:", error);
    res
      .status(500)
      .json({ success: false, message: "Error updating admin status" });
  }
};

export const buyTickets = async (req, res) => {
  try {
    const { showtimeId, selectedSeats, name, cardNumber, expiration, ccv } = req.body;
    const userId = req.params.userId;

    if (!showtimeId || !selectedSeats || !name || !cardNumber || !expiration || !ccv) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const hashedCcv = await bcrypt.hash(ccv, 10);
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const existingTickets = user.tickets.filter(ticket => ticket.showtimeId.toString() === showtimeId);

    const newSeats = selectedSeats.filter(seat => 
      !existingTickets.some(ticket => 
        ticket.seats.some(existingSeat => existingSeat.row === seat.row && existingSeat.column === seat.column)
      )
    );

    if (newSeats.length === 0) {
      return res.status(400).json({ success: false, message: "Seats already booked" });
    }

    const ticketCode = generateTicketCode();

    const boughtDate = new Date();

    user.tickets.push({
      showtimeId,
      seats: newSeats,
      ticketCode,
      boughtDate,
      paymentInfo: { name, cardNumber, expiration, ccv: hashedCcv },
    });

    await user.save();

    res.status(200).json({ success: true, message: "Tickets bought successfully", user, ticketCode });
  } catch (err) {
    console.error("Error buying tickets:", err);
    res.status(500).json({
      success: false,
      message: "Error buying tickets",
      error: err.message,
    });
  }
};


function generateTicketCode() {
  let ticketCode = "";
  for (let i = 0; i < 8; i++) {
    ticketCode += Math.floor(Math.random() * 10);
  }
  return ticketCode;
}

export const getShowtimesByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).populate({
      path: "tickets.showtimeId",
      populate: {
        path: "movie",
        model: "Movies", 
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const validTickets = user.tickets.filter((ticket) => ticket.showtimeId && ticket.showtimeId.movie);

    const showtimes = validTickets.map((ticket) => ({
      movie: ticket.showtimeId.movie,
      showtime: ticket.showtimeId,
      seats: ticket.seats,
      boughtDate: ticket.boughtDate,
      ticketCode: ticket.ticketCode,
    }));

    res.status(200).json({ success: true, data: showtimes });
  } catch (err) {
    console.error("Error fetching showtimes", err);
    res.status(500).json({
      success: false,
      message: "Error fetching showtimes",
      error: err.message,
    });
  }
};

export const addToBookmarks = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { movieId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isBookmarked = user.bookmarks.includes(movieId);
    if (isBookmarked) {
      user.bookmarks.pull(movieId);
      await user.save();
      return res.status(200).json({
        success: true,
        message: "Movie removed from bookmarks successfully",
      });
    } else {
      user.bookmarks.push(movieId);
      await user.save();
      return res.status(200).json({
        success: true,
        message: "Movie added to bookmarks successfully",
      });
    }
  } catch (err) {
    console.error("Error adding/removing movie to/from bookmarks:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getBookmarksByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).populate("bookmarks");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, bookmarks: user.bookmarks });
  } catch (err) {
    console.error("Error fetching bookmarks:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getUserReviews = async (req, res) => {
  try {
    const userId = req.params.userId;
    const movies = await Movies.find({
      'scores.userId': userId,
      isDeleted: false,
    });

    const reviews = movies.map((movie) => {
      const userReview = movie.scores.find((score) => score.userId.equals(userId));
      return {
        movie: {
          _id: movie._id,
          enTitle: movie.enTitle,
          poster: movie.poster,
        },
        score: userReview.score,
      };
    });

    res.status(200).json({ success: true, data: reviews });
  } catch (err) {
    console.error('Error fetching user reviews:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};



export const removeFromBookmarks = async (req, res) => {
  try {
    const userId = req.params.userId;
    const movieId = req.params.movieId;

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isBookmarked = user.bookmarks.includes(movieId);
    if (!isBookmarked) {
      return res
        .status(404)
        .json({ success: false, message: "Movie not found in bookmarks" });
    }

    user.bookmarks.pull(movieId);
    await user.save();
    res.status(200).json({
      success: true,
      message: "Movie removed from bookmarks successfully",
    });
  } catch (err) {
    console.error("Error removing movie from bookmarks:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getNotificationsByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).populate("notifications.movieId");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const notifications = user.notifications.filter(
      (notification) => !notification.dismissed
    );
    res.status(200).json({ success: true, notifications });
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const dismissNotifications = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    user.notifications.forEach((notification) => {
      notification.dismissed = true;
    });

    await user.save();

    res
      .status(200)
      .json({ success: true, message: "All notifications dismissed" });
  } catch (err) {
    console.error("Error dismissing notifications:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


