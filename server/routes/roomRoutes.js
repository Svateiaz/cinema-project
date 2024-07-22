import express from "express";
import { createRoom, deleteRoom, getRoom, getRooms, updateRoom } from "../controllers/roomsController.js";
import { isAdmin, isAuthenticated } from "../middleware/authMiddleware.js";
const router = express.Router();

router.route("/")
  .get(isAuthenticated, getRooms)
  .post(isAdmin, createRoom);

router.route("/:id")
  .get(isAuthenticated, getRoom)
  .put(isAdmin, updateRoom)
  .delete(isAdmin, deleteRoom);

export default router;
