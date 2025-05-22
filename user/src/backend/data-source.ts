import { DataSource } from "typeorm";
import { Candidate } from "./entity/Candidate";  // Example entity, you can replace this with your own
import { Lecturer } from "./entity/Lecturer";  // Example entity, you can replace this with your own
import { AppliedForm } from "./entity/appliedForm"
import { Course } from "./entity/Course";
import { TaughtCourse } from "./entity/TaughtCourse";
import { Preference } from "./entity/Preference";
export const AppDataSource = new DataSource({
  type: "mysql",
  host: "209.38.26.237",  // Replace with your MySQL host (use the one provided by your course)
  port: 3306,
  username: "S4115561",    // Replace with your student number
  password: "AndreanKeren23",    // Replace with your student number with capital S
  database: "S4115561",    // Same as your student number
  synchronize: true,      // Automatically create database schema if it doesn't exist
  logging: true,          // Optional: Logs the SQL queries
  entities: [Candidate, Lecturer, AppliedForm, Course, TaughtCourse, Preference],       // Add your entities here (you will create them next)
  migrations: [],
  subscribers: [],
});
