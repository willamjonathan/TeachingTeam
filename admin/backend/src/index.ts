import "reflect-metadata";
import express, { Express, Application } from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import { AppDataSource } from "./data-source";
import { Admin } from "./entity/Admin";
import { ApolloServer } from "apollo-server-express";
import { typeDefs } from "./schema/UserSchema"; 
import { adminResolvers } from "./resolvers/AdminResolver"; 
import { lecturerResolvers } from "./resolvers/LecturerResolver";
import { courseResolvers } from "./resolvers/CourseResolver";
import { taughtCourseResolvers } from "./resolvers/TaughtCourseResolver";
import { mergeResolvers } from "@graphql-tools/merge";
import { candidateResolvers } from "./resolvers/CandidateResolver";
import { preferenceResolvers } from "./resolvers/PreferenceResolver";


const mergedResolvers = mergeResolvers([adminResolvers, lecturerResolvers, courseResolvers, taughtCourseResolvers,candidateResolvers, preferenceResolvers]);



const app: Express = express();
const PORT = process.env.PORT || 3006;

app.use(cors());
app.use(express.json());

// Initialize TypeORM
AppDataSource.initialize()
  .then(async () => {
    console.log("Data Source has been initialized!");

    const adminRepository = AppDataSource.getRepository(Admin);
    const existingAdmin = await adminRepository.findOneBy({ username: "admin" });

    if (!existingAdmin) {
      // If no admin exists, create one
      const admin = new Admin();
      admin.username = "admin"; // Set username to "admin"
      const saltRounds = 10;
      admin.password = await bcrypt.hash("admin", saltRounds); // Hash password using bcrypt

      await adminRepository.save(admin);
      console.log("Default admin user created");
    } else {
      console.log("Admin already exists");
    }

    // Set up Apollo Server for GraphQL
    const server = new ApolloServer({
      typeDefs,
      resolvers: mergedResolvers,
    });

    // Start Apollo Server before applying middleware
    await server.start();

    // Apply Apollo middleware to Express app with explicit casting to Application type
    (server as any).applyMiddleware({ app: app as Application });

    // Start the server after applying Apollo middleware
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}${server.graphqlPath}`);
    });
  })
  .catch((error) =>
    console.log("Error during Data Source initialization:", error)
  );
