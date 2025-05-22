import "reflect-metadata";
import { DataSource } from "typeorm";
// import { User } from "../../unused/User";
import { Admin } from "./entity/Admin";  // Import Admin entity
import { Lecturer } from "./entity/Lecturer";
import { Course } from "./entity/Course";
import { TaughtCourse } from "./entity/TaughtCourse";
import { Candidate } from "./entity/Candidate";
import { AppliedForm } from "./entity/appliedForm";
import { Preference } from "./entity/Preference";



export const AppDataSource = new DataSource({
  type: "mysql",
  host: "209.38.26.237",
  port: 3306,
  username: "S4115561",
  password: "AndreanKeren23",
  database: "S4115561",
  synchronize: true,  
  logging: true,
  entities: [Admin, Lecturer, Course, TaughtCourse, Candidate, AppliedForm, Preference],  
  migrations: [],
  subscribers: [],
});
