import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import { clerkMiddleware } from "@clerk/express";
import userRouter from "./routes/userRoutes.js";
import hotelRouter from "./routes/hotelRoutes.js";
import roomRouter from "./routes/roomRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import clerkWebhooks from "./controllers/clerkWebhooks.js";
import connectCloudinary from "./configs/cloudinary.js";

connectDB();
connectCloudinary();

const app = express();

const allowedOrigin = process.env.CLIENT_URL || "http://localhost:5173";

/* ✅ CORS CONFIG */
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || origin === allowedOrigin) {
        return callback(null, true);
      }
      callback(new Error(`CORS origin not allowed: ${origin}`));
    },
    credentials: true,
  })
);

/* ❌ REMOVED THIS (CAUSE OF YOUR ERROR) */
// Express/path-to-regexp on newer versions rejects bare "*".
app.options(/.*/, cors());

/* ✅ BODY PARSER */
app.use(express.json());

/* ✅ FIXED CLERK MIDDLEWARE */
app.use(
  clerkMiddleware({
    secretKey: process.env.CLERK_SECRET_KEY,
    // 🔥 prevents path-to-regexp crash
    organizationSyncOptions: null,
  })
);

console.log("[server] CLIENT_URL", allowedOrigin);
console.log("[server] CLERK_SECRET_KEY set", !!process.env.CLERK_SECRET_KEY);

/* ✅ ROUTES */
app.use("/api/clerk", clerkWebhooks);

app.get("/", (req, res) => res.send("API is working"));

app.use("/api/user", userRouter);
app.use("/api/hotels", hotelRouter);
app.use("/api/rooms", roomRouter);
app.use("/api/bookings", bookingRouter);

/* ✅ GLOBAL ERROR HANDLER */
app.use((err, req, res, next) => {
  console.error("[server] error", err);

  if (
    err?.message?.includes("Invalid personal account pattern") ||
    err?.message?.includes("Invalid organization pattern") ||
    err?.message?.includes("Missing parameter name")
  ) {
    return res.status(500).json({
      success: false,
      message: "Configuration error fixed. Restart server.",
    });
  }

  if (res.headersSent) {
    return next(err);
  }

  res.status(err?.status || 500).json({
    success: false,
    message: err?.message || "Internal Server Error",
  });
});

/* ✅ SERVER START */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});