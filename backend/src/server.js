import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import commentRoutes from "./routes/comment.route.js";
import notificationRoutes from "./routes/notification.route.js";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { arcjetMiddleware } from "./middleware/arcjet.middleware.js";

const app = express();

app.use(cors());
app.use(express.json()); // to access req.body

app.use(clerkMiddleware()); //handle authentication
app.use(arcjetMiddleware);
//connectDB();

app.get("/", (req, res) => res.send("Hello from server!!!"));

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/notifications", notificationRoutes);

// error handling middleware
app.use((err, req, res) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: err.message || "Internal server error" });
});

// app.listen(ENV.PORT, () =>
//   console.log("Server is up and running on PORT:", ENV.PORT)
// );

const startServer = async () => {
  try {
    await connectDB();

    app.listen(ENV.PORT, () =>
      console.log("Server running on port:", ENV.PORT)
    );
  } catch (err) {
    console.error("DB connection failed:", err.message);
    process.exit(1);
  }
};

startServer();
