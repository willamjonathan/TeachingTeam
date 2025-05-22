import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Admin } from "../entity/Admin"; 
import { AppDataSource } from "../data-source";

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

export const adminResolvers = {
  Mutation: {
    login: async (_: any, { username, password }: { username: string, password: string }) => {
      const adminRepository = AppDataSource.getRepository(Admin);

      // Fetch the admin with the specific username
      const admin = await adminRepository.findOne({ where: { username } });

      if (!admin) {
        throw new Error("Admin not found");
      }

      // Compare password
      const passwordMatch = await bcrypt.compare(password, admin.password);

      if (!passwordMatch) {
        throw new Error("Invalid password");
      }

      // Generate a JWT token
      const token = jwt.sign({ username: admin.username }, JWT_SECRET, {
        expiresIn: "1h", 
      });

      return token; 
    },
  },

  Query: {
    getAdmin: async () => {
      const adminRepository = AppDataSource.getRepository(Admin);
      const admin = await adminRepository.findOne({ where: { username: 'admin' } });

      if (!admin) {
        throw new Error("Admin not found");
      }

      // Return the admin with only the fields present in your Admin entity
      return {
        username: admin.username,
        password: admin.password, 
      };
    },
  },
};
