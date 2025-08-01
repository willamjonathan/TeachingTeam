import { Preference } from "../entity/Preference";
import { AppDataSource } from "../data-source";
import { AppliedForm } from "../entity/appliedForm";  

export const preferenceResolvers = {
  Query: {
    // get preferences
    getPreferences: async () => {
      const prefRepo = AppDataSource.getRepository(Preference);
      return await prefRepo.find({
        relations: ["lecturer", "course", "candidate"],
      });
    },
    // get candidate per course
    getCandidatesPerCourse: async () => {
        const prefRepo = AppDataSource.getRepository(Preference);
      
        const preferences = await prefRepo
          .createQueryBuilder("preference")
          .leftJoinAndSelect("preference.course", "course")
          .leftJoinAndSelect("preference.candidate", "candidate")
          .select("course.courseCode", "courseCode")  // Ensure courseCode is selected
          .addSelect("candidate.id", "candidateId")
          .addSelect("candidate.name", "candidateName")
          .addSelect("COUNT(preference.preferenceID)", "candidateCount")
          .groupBy("course.courseCode")  // Group by courseCode
          .addGroupBy("candidate.id")
          .addGroupBy("candidate.name")
          .getRawMany();
      
        // Organize the results by courseCode
        const result: Record<string, any[]> = {};
      
        preferences.forEach(p => {
          const courseCode = p.courseCode;  
          const candidateData = {
            id: p.candidateId,
            name: p.candidateName,
            count: p.candidateCount,
          };
      
          if (!result[courseCode]) {
            result[courseCode] = [];
          }
          result[courseCode].push(candidateData);
        });
      
        // Return the result in the desired format
        return Object.entries(result).map(([courseCode, candidates]) => ({
          courseCode,
          candidates,
        }));
      },
      
      
    // Get candidates who have been chosen for more than 3 for any course
    getCandidatesMoreThan3Courses: async () => {
        const prefRepo = AppDataSource.getRepository(Preference);
      
        const candidates = await prefRepo
          .createQueryBuilder("preference")
          .select("candidate.id", "id")
          .addSelect("candidate.name", "name")
          .addSelect("COUNT(preference.preferenceID)", "courseCount")
          .leftJoin("preference.candidate", "candidate")
          .groupBy("candidate.id")
          .addGroupBy("candidate.name")
          .having("COUNT(preference.preferenceID) > 3")
          .getRawMany();
      
        return candidates.map(candidate => ({
          id: candidate.id,
          name: candidate.name,
        }));
      },


    // Get candidates who have not been chosen for any course
    getCandidatesNotChosen: async () => {
      const appliedRepo = AppDataSource.getRepository(AppliedForm);

      const result = await appliedRepo
        .createQueryBuilder("applied")
        .leftJoin("preference", "preference", "preference.candidateId = applied.candidateId")
        .leftJoinAndSelect("applied.candidate", "candidate")
        .where("preference.preferenceID IS NULL")
        .getMany();

      // Return just the candidate information
      return result.map(a => a.candidate);
    },
  },
};
