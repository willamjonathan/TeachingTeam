//app.ts
import express from "express";
import cors from "cors";
import { AppDataSource } from "./data-source";
import userRoutes from "./routes/userRoutes";

const app = express();

// Enable CORS
app.use(cors());

// Middleware to parse incoming JSON requests
app.use(express.json());

// Use the routes for user-related requests
app.use("/api", userRoutes);

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
    app.listen(5001, () => {
      console.log("Server running on http://localhost:5001");
    });
  })
  .catch((error) => {
    console.log("Error during Data Source initialization", error);
  });
