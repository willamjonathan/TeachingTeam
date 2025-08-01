import { Lecturer } from "../entity/Lecturer";
import { AppDataSource } from "../data-source";

export const lecturerResolvers = {
  Query: {
    getLecturers: async () => {
      const lecturerRepo = AppDataSource.getRepository(Lecturer);
      const lecturers = await lecturerRepo.find();
  
      // Remove the password before returning data
      return lecturers.map(({ password, ...rest }) => rest); 
    },
    getLecturerById: async (_: any, { id }: { id: number }) => {
      const lecturerRepo = AppDataSource.getRepository(Lecturer);
      const lecturer = await lecturerRepo.findOne({ where: { id } });

      if (!lecturer) {
        throw new Error("Lecturer not found");
      }

      // Remove the password before returning data
      const { password, ...rest } = lecturer;
      return rest;
    },
  },
};
