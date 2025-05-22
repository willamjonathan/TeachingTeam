import { Course } from "../entity/Course";  
import { AppDataSource } from "../data-source";  

export const courseResolvers = {
  Query: {
    // Get all courses
    getCourses: async () => {
      const courseRepo = AppDataSource.getRepository(Course); 
      return await courseRepo.find(); 
    },
    // Get a specific course by its course code
    getCourse: async (_: any, { courseCode }: { courseCode: string }) => {
      const courseRepo = AppDataSource.getRepository(Course);  
      return await courseRepo.findOne({ where: { courseCode } }); 
    },
  },
  Mutation: {
    // Add a new course
    addCourse: async (
        _: any,
        { courseCode, title, description }: { courseCode: string; title: string; description: string }
      ) => {
        const courseRepo = AppDataSource.getRepository(Course);
      
        // check if the courseCode already exists
        const existingCourse = await courseRepo.findOne({ where: { courseCode } });
        if (existingCourse) {
          throw new Error("Course code already exists.");
        }
      
        const newCourse = courseRepo.create({
          courseCode, 
          title,
          description,
        });
      
        await courseRepo.save(newCourse);
        return newCourse;
      },
      
// Edit an existing course
editCourse: async (_: any, { courseCode, title, description }: { courseCode: string; title?: string; description?: string }) => {
    const courseRepo = AppDataSource.getRepository(Course); 
    const course = await courseRepo.findOne({ where: { courseCode } });  
  
    if (!course) {
      throw new Error("Course not found");
    }
  
    // Ensure courseCode remains the same (no changes allowed)
    course.title = title || course.title;  
    course.description = description || course.description; 
  
    await courseRepo.save(course);  
    return course; 
  },
  
    // Delete a course
    deleteCourse: async (_: any, { courseCode }: { courseCode: string }) => {
      const courseRepo = AppDataSource.getRepository(Course);  
      const course = await courseRepo.findOne({ where: { courseCode } }); 

      if (!course) {
        throw new Error("Course not found");
      }

      await courseRepo.remove(course);  // Remove the course from the database
      return `Course with code ${courseCode} has been deleted`; 
    },
  },
};
