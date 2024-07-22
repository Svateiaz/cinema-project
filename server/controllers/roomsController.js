import Rooms from "../models/Rooms.js";

export const getRooms = async (req, res) => {
  try {
    const rooms = await Rooms.find({ isDeleted: false });
    res.status(200).json({ success: true, data: rooms });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getRoom = async (req, res) => {
  try {
    const room = await Rooms.findOne({ _id: req.params.id, isDeleted: false });
    if (!room) {
      return res.status(400).json({
        success: false,
        message: `Room with id ${req.params.id} not found`,
      });
    }
    res.status(200).json({ success: true, data: room });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const createRoom = async (req, res) => {
  try {
    const room = await Rooms.create(req.body);
    res.status(201).json({ success: true, data: room });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const updateRoom = async (req, res) => {
  try {
    const room = await Rooms.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!room) {
      return res.status(400).json({
        success: false,
        message: `Room with id ${req.params.id} not found`,
      });
    }
    res.status(200).json({ success: true, data: room });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const deleteRoom = async (req, res) => {
  try {
    const room = await Rooms.findById(req.params.id);
    if (!room) {
      return res.status(400).json({
        success: false,
        message: `Room with id ${req.params.id} not found`,
      });
    }
    room.isDeleted = true;
    await room.save();
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, message: err });
  }
};
