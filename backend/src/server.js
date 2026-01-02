import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";

const app = express();

app.use(cors());
app.use(express.json()); // to access req.body

app.use(clerkMiddleware()); //handle authentication
//connectDB();

app.get("/", (req, res) => res.send("Hello from server!!!"));

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
