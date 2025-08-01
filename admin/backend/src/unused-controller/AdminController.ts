// import { Request, Response } from "express";
// import bcrypt from "bcrypt"; // To hash the password
// import jwt from "jsonwebtoken"; // For generating the JWT
// import { AppDataSource } from "../data-source";
// import { Admin } from "../entity/Admin";
// import dotenv from 'dotenv';
// dotenv.config(); // Load environment variables

// const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret'; // Fallback in case the environment variable is missing

// // Now you can use JWT_SECRET for signing/verifying JWTs


// export class AdminController {
//   private adminRepository = AppDataSource.getRepository(Admin);

//   // Login route for Admin
//   async login(request: Request, response: Response) {
//     const { username, password } = request.body;

//     // Check if the admin exists in the database
//     const admin = await this.adminRepository.findOneBy({ username });

//     if (!admin) {
//       return response.status(404).json({ message: "Admin not found" });
//     }

//     // Compare the entered password with the stored hashed password
//     const passwordMatch = await bcrypt.compare(password, admin.password);

//     if (!passwordMatch) {
//       return response.status(401).json({ message: "Invalid password" });
//     }

//     // Generate a JWT token
//     const token = jwt.sign({ username: admin.username }, JWT_SECRET, {
//       expiresIn: "1h", // Token expires in 1 hour
//     });

//     return response.json({ message: "Login successful", token });
//   }
// }
