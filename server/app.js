import express from "express";
import cors from "cors";
import session from "express-session";
import mongoose from "mongoose";
import passport from "passport";
import dotenv from "dotenv";
import MongoStore from "connect-mongo";
import movieRouter from "./routes/movieRoutes.js";
import showtimeRouter from "./routes/showtimeRoutes.js";
import roomRouter from "./routes/roomRoutes.js";
import userRouter from "./routes/userRoutes.js";
import nodemailer from "nodemailer";
import "./config/cronJobs.js";
import { login, logout } from "./controllers/userController.js";

dotenv.config();

mongoose.set("strictQuery", false);

mongoose
  .connect(process.env.VITE_DB_URL, {
    autoIndex: true,
  })
  .then(() => {
    console.log("mongoose connected!");
  })
  .catch((err) => console.log(err));

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

const sessionMiddleware = session({
  store: MongoStore.create({ mongoUrl: process.env.VITE_DB_URL }),
  secret: "test",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
    secure: false,
  },
});

app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

app.post("/login", login);
app.get("/success", (req, res) => {
  res.status(200).json({ message: "Login successful" });
});
app.post("/logout", logout);

app.use("/user", userRouter);
app.use("/movies", movieRouter);
app.use("/showtimes", showtimeRouter);
app.use("/rooms", roomRouter);

app.post("/send-email", async (req, res) => {
  try {
    const { sender, recipient, subject, message } = req.body;

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "avramadrian212@gmail.com",
        pass: "whwt lkvw cnnz uang",
      },
    });

    const info = await transporter.sendMail({
      from: sender,
      to: recipient,
      subject: subject,
      text: message,
    });

    console.log("Email sent:", info.response);
    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Failed to send email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
