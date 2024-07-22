import express from "express";
import {
  fetchUser,
  createUser,
  buyTickets,
  getShowtimesByUser,
  addToBookmarks,
  getBookmarksByUser,
  getNotificationsByUser,
  removeFromBookmarks,
  fetchAllUsers,
  changeUserStatus,
  requestPasswordReset,
  resetPassword,
  dismissNotifications,
  updateUser,
  changePassword,
  getUserReviews,
} from "../controllers/userController.js";
import { isAdmin, isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(isAuthenticated, fetchUser).post(createUser);
router.route("/all-users").get(isAdmin, fetchAllUsers);
router.route("/buy-tickets/:userId").put(isAuthenticated, buyTickets);
router.route("/:userId").put(isAuthenticated, updateUser);
router.route("/:userId/showtimes").get(isAuthenticated, getShowtimesByUser);
router.route("/:userId/change-password").put(isAuthenticated, changePassword);
router.route("/:userId/bookmarks").get(isAuthenticated, getBookmarksByUser).post(isAuthenticated, addToBookmarks);
router.route("/:userId/reviews").get(isAuthenticated, getUserReviews);
router.route("/:userId/bookmarks/:movieId").delete(isAuthenticated, removeFromBookmarks);
router.route("/:userId/notifications").get(isAuthenticated, getNotificationsByUser);
router.route("/:userId/notifications/dismissAll").put(isAuthenticated, dismissNotifications);
router.route("/:userId/toggle-admin").put(isAdmin, changeUserStatus);
router.route("/forgot-password").post(requestPasswordReset);
router.route("/reset-password").post(resetPassword);

export default router;
