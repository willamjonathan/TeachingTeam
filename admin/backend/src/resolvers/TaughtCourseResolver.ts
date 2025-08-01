import { TaughtCourse } from "../entity/TaughtCourse";
import { Lecturer } from "../entity/Lecturer";
import { Course } from "../entity/Course";
import { AppDataSource } from "../data-source";

export const taughtCourseResolvers = {
  Query: {
    // Get all taught courses with lecturerId and courseCode
    getTaughtCourses: async () => {
      const taughtCourseRepo = AppDataSource.getRepository(TaughtCourse);
      const taughtCourses = await taughtCourseRepo.find({ 
        relations: ["lecturer", "course"] 
      });

      return taughtCourses;
    },
  },

  Mutation: {
    // Add a new taught course (with lecturerId and courseCode)
    addTaughtCourse: async (_: any, { lecturerId, courseCode }: { lecturerId: number, courseCode: string }) => {
      const taughtCourseRepo = AppDataSource.getRepository(TaughtCourse);
      const lecturerRepo = AppDataSource.getRepository(Lecturer);
      const courseRepo = AppDataSource.getRepository(Course);

      try {
        // Fetch the lecturer by ID
        const lecturer = await lecturerRepo.findOne({ where: { id: lecturerId } });
        if (!lecturer) {
          throw new Error("Lecturer not found");
        }

        // Fetch the course by courseCode
        const course = await courseRepo.findOne({ where: { courseCode } });
        if (!course) {
          throw new Error("Course not found");
        }

        // Create a new TaughtCourse entity
        const newTaughtCourse = new TaughtCourse();
        newTaughtCourse.lecturer = lecturer;  
        newTaughtCourse.course = course;  

        // Save the new TaughtCourse to the database
        await taughtCourseRepo.save(newTaughtCourse);
        return newTaughtCourse;
      } catch (err) {
        console.error(err);
        throw new Error("Failed to add taught course");
      }
    },

    // Delete a taught course by lecturerId and courseCode
    deleteTaughtCourse: async (_: any, { lecturerId, courseCode }: { lecturerId: number, courseCode: string }) => {
      const taughtCourseRepo = AppDataSource.getRepository(TaughtCourse);
      const lecturerRepo = AppDataSource.getRepository(Lecturer);
      const courseRepo = AppDataSource.getRepository(Course);

      try {
        // Fetch the lecturer by ID
        const lecturer = await lecturerRepo.findOne({ where: { id: lecturerId } });
        if (!lecturer) {
          throw new Error("Lecturer not found");
        }

        // Fetch the course by courseCode
        const course = await courseRepo.findOne({ where: { courseCode } });
        if (!course) {
          throw new Error("Course not found");
        }

        // Find the TaughtCourse to delete
        const taughtCourse = await taughtCourseRepo.findOne({
          where: {
            lecturer: { id: lecturerId },
            course: { courseCode }
          }
        });

        if (!taughtCourse) {
          throw new Error("Taught course not found");
        }

        // Delete the TaughtCourse
        await taughtCourseRepo.remove(taughtCourse);
        return { message: "Taught course deleted successfully" };
      } catch (err) {
        console.error(err);
        throw new Error("Failed to delete taught course");
      }
    }
  }
};
