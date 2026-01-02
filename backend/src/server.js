import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";

const app = express();

app.use(cors());
app.use(express.json()); // to access req.body

app.use(clerkMiddleware()); //handle authentication
//connectDB();

app.get("/", (req, res) => res.send("Hello from server!!!"));

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

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
