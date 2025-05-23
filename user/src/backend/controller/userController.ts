// userController.ts
import { Request, response, Response } from "express";
import { AppDataSource } from "../data-source";
import { Candidate } from "../entity/Candidate";
import { Lecturer } from "../entity/Lecturer";
import { Course } from "../entity/Course";
import { TaughtCourse } from "../entity/TaughtCourse";
import { Preference } from "../entity/Preference";
import { AppliedForm } from "../entity/appliedForm";

// Get all candidates
export const getCandidates = async (req: Request, res: Response) => {
  const candidates = await AppDataSource.getRepository(Candidate).find();
  res.json(candidates);
};

// Get candidate ID by email (username)
export const getCandidateIdByEmail = async (req: Request, res: Response) => {
  const { email } = req.params;

  try {
    const candidate = await AppDataSource.getRepository(Candidate).findOneBy({ email });

    if (!candidate) {
      res.status(404).json({ message: "Candidate not found" });
    } else {
      res.json({
        id: candidate.id,
        email: candidate.email,
        name: candidate.name,
        DOB: candidate.DOB,
        gender: candidate.gender,
        DOJ: candidate.DOJ,
        is_Active: candidate.is_Active,

      });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Create a new candidate
export const createCandidate = async (req: Request, res: Response) => {
  const { name, email, password, DOB, gender, DOJ } = req.body;

  try {
    // Check if a candidate with the same email already exists
    const existingCandidate = await AppDataSource.getRepository(Candidate).findOne({
      where: { email: email.toLowerCase() }, // Use lowercase email for case-insensitivity
    });

    // If the email already exists, return a 400 error
    if (existingCandidate) {
      res.status(400).json({ message: "Email is already" });
    } else {

      const candidate = new Candidate();
      candidate.name = name;
      candidate.email = email.toLowerCase();
      candidate.password = password;
      candidate.DOB = DOB;
      candidate.gender = gender;
      candidate.DOJ = new Date().toISOString();
      candidate.is_Active = true;

      // Save the new candidate to the database
      await AppDataSource.manager.save(candidate);

      // Respond with the created candidate (excluding password for security)
      res.status(201).json({
        id: candidate.id,
        name: candidate.name,
        email: candidate.email,
      });
    }

  } catch (error) {
    console.error("Error creating candidate:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createLecturers = async (req: Request, res: Response) => {
  const { name, email, password, department } = req.body;

  try {
    const existingCandidate = await AppDataSource.getRepository(Lecturer).findOne({
      where: { email: email.toLowerCase() }, // Case-insensitive check
    });

    if (existingCandidate) {
      return res.status(400).json({ message: "Email is already in use" });
    }

    const lecturer = new Lecturer();
    lecturer.name = name;
    lecturer.email = email.toLowerCase();
    lecturer.password = password; // Note: storing plain passwords is not recommended
    lecturer.department = department;

    await AppDataSource.getRepository(Lecturer).save(lecturer);

    return res.status(201).json({ message: "Lecturer created successfully", lecturer });
  } catch (error) {
    console.error("Error creating lecturer:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getCandidateNameById = async (req: Request, res: Response) => {
  const candidateId = parseInt(req.params.id, 10);

  if (isNaN(candidateId)) {
    res.status(400).json({ message: "Invalid candidate ID" });
    return;
  }

  try {
    const candidateRepository = AppDataSource.getRepository(Candidate);
    const candidate = await candidateRepository.findOneBy({ id: candidateId });

    if (!candidate) {
      res.status(404).json({ message: "Candidate not found" });
      return;
    }

    res.status(200).json({ id: candidate.id, name: candidate.name });
  } catch (error) {
    console.error("Error fetching candidate by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//Login api for candidate
export const loginCandidate = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Check if the candidate exists by email
    const existingCandidate = await AppDataSource.getRepository(Candidate).findOne({
      where: { email: email.toLowerCase() }, // Normalize email to lowercase
    });

    if (!existingCandidate) {
      // If no candidate with that email, return 400 error
      res.status(400).json({ message: "Email not found" });
    }

    // Check if the provided password matches the stored password (no hashing, plain text)
    if (existingCandidate) {
      if (existingCandidate.password !== password) {
        // If passwords don't match, return 400 error
        res.status(410).json({ message: "Incorrect password" });
      }else {
        if(existingCandidate.is_Active === false){
          res.status(420).json({ message: "Candidate is banned" });
        }else{
          res.status(200).json({
            message: "Login successful",
            user: {
              id: existingCandidate.id,
              name: existingCandidate.name,
              email: existingCandidate.email,
              DOB: existingCandidate.DOB,
              gender: existingCandidate.gender,
              DOJ: existingCandidate.DOJ,
              is_Active: existingCandidate.is_Active,
            },
          });
        }
        // If login is successful, you can send back a success message
        // Optionally, you could generate a token here if needed, but for simplicity, we'll just return user info
      }
    }
  } catch (error) {
    console.error("Error logging in candidate:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Get all lecturers
export const getLecturers = async (req: Request, res: Response) => {
  const lecturers = await AppDataSource.getRepository(Lecturer).find();
  res.json(lecturers);
};

export const getLecturerByUsername = async (req: Request, res: Response) => {
  const { email } = req.params;

  try {
    const lecturer = await AppDataSource.getRepository(Lecturer).findOneBy({ email });
    if (!lecturer) {
      res.status(404).json({ message: "Lecturer not found" })
      return;
    }
    res.json(lecturer);
  } catch (error) {
    console.error("Error fetching lecturer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Create a new lecturer
export const createLecturer = async (req: Request, res: Response) => {
  const { name, department, email, password } = req.body;
  const lecturer = new Lecturer();
  lecturer.name = name;
  lecturer.email = email;
  lecturer.password = password;
  lecturer.department = department;
  // lecturer.is_Active = is_Active;
  await AppDataSource.manager.save(lecturer);
  res.status(201).json(lecturer);
};


// Login API for lecturer
export const loginLecturer = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    // Normalize email to lowercase for comparison
    const existingLecturer = await AppDataSource.getRepository(Lecturer).findOne({
      where: { email: email.toLowerCase() },
    });

    if (!existingLecturer) {
      res.status(400).json({ message: "Email not found" });
      return;
    }

    // Compare passwords directly (assuming plain text for now)
    if (existingLecturer.password !== password) {
      res.status(410).json({ message: "Incorrect password" });
      return;
    }

    // Return lecturer info (excluding password)
    res.status(200).json({
      message: "Login successful",
      lecturer: {
        id: existingLecturer.id,
        name: existingLecturer.name,
        email: existingLecturer.email,
        department: existingLecturer.department,
      },
    });

  } catch (error) {
    console.error("Error logging in lecturer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getCourses = async (req: Request, res: Response) => {
  try {
    const courseRepository = AppDataSource.getRepository(Course);
    console.log(courseRepository)
    const courses = await courseRepository.find(); // You can add relations if needed
    res.status(200).json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCoursesByLecturer = async (req: Request, res: Response) => {
  const lecturerId = parseInt(req.params.lecturerId);

  if (isNaN(lecturerId)) {
    res.status(400).json({ message: "Invalid lecturer ID" });
    return;
  }

  try {
    const taughtCourseRepository = AppDataSource.getRepository(TaughtCourse);
    const taughtCourses = await taughtCourseRepository.find({
      where: { lecturerId },
      relations: ["course"],
    });

    const courses = taughtCourses.map(tc => tc.course);

    res.json(courses);
  } catch (error) {
    console.error("Error fetching courses by lecturer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const postPreference = async (req: Request, res: Response) => {
  const { lecturerId, courseId, candidateId, preferenceNumber, comment } = req.body;

  try {
    // Find related entities first
    const lecturer = await AppDataSource.getRepository(Lecturer).findOneBy({ id: lecturerId });
    if (!lecturer) {
      res.status(404).json({ message: "Lecturer not found" })
      return;
    }

    const course = await AppDataSource.getRepository(Course).findOneBy({ courseCode: courseId });
    if (!course) {
      res.status(404).json({ message: "Course not found" })
      return;
    }

    const candidate = await AppDataSource.getRepository(Candidate).findOneBy({ id: candidateId });
    if (!candidate) {
      res.status(404).json({ message: "Candidate not found" })
      return;
    }

    // Create new preference entity
    const preference = new Preference();
    preference.lecturer = lecturer;
    preference.course = course;
    preference.candidate = candidate;
    preference.preferenceNumber = preferenceNumber;
    preference.comment = comment;

    // Save to database
    await AppDataSource.manager.save(preference);

    // Return created preference
    res.status(201).json(preference);
  } catch (error) {
    console.error("Error creating preference:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const postMultiplePreferences = async (req: Request, res: Response) => {
  const { lecturerId, courseId, preferences }: {
    lecturerId: number;
    courseId: string;
    preferences: { [candidateId: string]: { preference: number; comment: string } };
  } = req.body;

  try {
    const lecturer = await AppDataSource.getRepository(Lecturer).findOneBy({ id: lecturerId });
    if (!lecturer) {
      res.status(404).json({ message: "Lecturer not found" });
      return;
    }

    const course = await AppDataSource.getRepository(Course).findOneBy({ courseCode: courseId });
    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }

    const preferenceRepo = AppDataSource.getRepository(Preference);
    const savedPreferences = [];

    for (const [candidateId, data] of Object.entries(preferences) as [string, { preference: number; comment: string }][]) {
      const candidate = await AppDataSource.getRepository(Candidate).findOneBy({ id: Number(candidateId) });
      if (!candidate) continue;

      // Check if preference already exists for this lecturer-course-candidate
      let preference = await preferenceRepo.findOne({
        where: {
          lecturer: { id: lecturerId },
          course: { courseCode: courseId },
          candidate: { id: Number(candidateId) }
        },
        relations: ["lecturer", "course", "candidate"]
      });

      if (preference) {
        // Update existing preference
        preference.preferenceNumber = data.preference;
        preference.comment = data.comment;
      } else {
        // Create new preference
        preference = new Preference();
        preference.lecturer = lecturer;
        preference.course = course;
        preference.candidate = candidate;
        preference.preferenceNumber = data.preference;
        preference.comment = data.comment;
      }

      const saved = await preferenceRepo.save(preference);
      savedPreferences.push(saved);

      console.log("Processed preference:", {
        lecturerId: lecturer.id,
        courseId: course.courseCode,
        candidateId: candidate.id,
        preferenceNumber: data.preference,
        comment: data.comment
      });
    }

    res.status(200).json(savedPreferences);
  } catch (error) {
    console.error("Error saving multiple preferences:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getApplicantsByCourseId = async (req: Request, res: Response) => {
  const courseId = req.params.courseId;

  try {
    // Make sure to also fetch the lecturer relation in your query!
    const preferences = await AppDataSource.getRepository(Preference).find({
      where: { course: { courseCode: courseId } },
      relations: ["candidate", "course", "lecturer"], // <-- add lecturer here
    });

    if (preferences.length === 0) {
      res.status(404).json({ message: "No applicants found for this course" });
      return;
    }

    // Initialize the nested grouping structure by courseCode and lecturerId
    const parsedPreferences: { [courseCode: string]: { [lecturerId: string]: any[] } } = {};

    preferences.forEach(pref => {
      const courseCode = pref.course.courseCode;
      const lecturerId = pref.lecturer.id;  // assuming 'lecturer' is available
      // const lecturerName = pref.lecturer.name; // if you want to store lecturer name instead of id

      const applicant = {
        id: pref.candidate.id,
        name: pref.candidate.name,
        email: pref.candidate.email,
        DOB: pref.candidate.DOB,
        gender: pref.candidate.gender,
        DOJ: pref.candidate.DOJ,
        is_Active: pref.candidate.is_Active,
        preferenceNumber: pref.preferenceNumber,
        comment: pref.comment,
      };

      if (!parsedPreferences[courseCode]) {
        parsedPreferences[courseCode] = {};
      }

      if (!parsedPreferences[courseCode][lecturerId]) {
        parsedPreferences[courseCode][lecturerId] = [];
      }

      parsedPreferences[courseCode][lecturerId].push(applicant);
    });
    console.log("Parsed Preferences grouped by course and lecturer:", JSON.stringify(parsedPreferences, null, 2));
    res.status(200).json(parsedPreferences);
  } catch (error) {
    console.error("Error fetching applicants by course ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// export const createOrUpdatePreferences = async (req: Request, res: Response) => {
//   const prefs = req.body.preferences as Array<{
//     candidateId: number;
//     courseCode: string;
//     lecturerId: number;
//     preferenceNumber: number;
//     comment?: string;
//   }>;

//   if (!Array.isArray(prefs)) {
//     return res.status(400).json({ message: "Preferences must be an array" });
//   }

//   try {
//     const preferenceRepo = AppDataSource.getRepository(Preference);

//     const results = [];

//     for (const prefData of prefs) {
//       const existingPref = await preferenceRepo.findOne({
//         where: {
//           candidate: { id: prefData.candidateId },
//           course: { courseCode: prefData.courseCode },
//           lecturer: { id: prefData.lecturerId },
//         },
//         relations: ["candidate", "course", "lecturer"],
//       });

//       if (existingPref) {
//         // Update existing
//         existingPref.preferenceNumber = prefData.preferenceNumber;
//         existingPref.comment = prefData.comment || existingPref.comment;
//         await preferenceRepo.save(existingPref);
//         results.push({ ...existingPref, status: "updated" });
//       } else {
//         // Create new
//         const newPref = preferenceRepo.create({
//           candidate: { id: prefData.candidateId },
//           course: { courseCode: prefData.courseCode },
//           lecturer: { id: prefData.lecturerId },
//           preferenceNumber: prefData.preferenceNumber,
//           comment: prefData.comment,
//         });
//         await preferenceRepo.save(newPref);
//         results.push({ ...newPref, status: "created" });
//       }
//     }

//     return res.status(200).json({ message: "Preferences processed", results });
//   } catch (error) {
//     console.error("Error processing preferences:", error);
//     res.status(500).json({ message: "Internal server error" })
//     ;
//   }
// };

// FILTER

export const getFilteredCandidates = async (req: Request, res: Response) => {
  try {
    let { courseId, availability, skillSet, searchName, filterCountType, position } = req.query;

    // Normalize filterCountType input
    if (typeof filterCountType === "string") {
      const normalized = filterCountType.toLowerCase();
      if (normalized === "most") filterCountType = "most";
      else if (normalized === "least") filterCountType = "least";
      else if (normalized === "not chosen") filterCountType = "not chosen";
      else filterCountType = "all";
    } else {
      filterCountType = "all";
    }

    const appliedFormRepo = AppDataSource.getRepository(AppliedForm);
    const candidateRepo = AppDataSource.getRepository(Candidate);
    const preferenceRepo = AppDataSource.getRepository(Preference);

    // Step 1: Filter AppliedForms by query params
    let query = appliedFormRepo.createQueryBuilder("appliedForm");

    if (courseId && courseId !== "All") {
      query = query.andWhere("appliedForm.courseID = :courseId", { courseId });
    }

    if (availability && availability !== "All") {
      query = query.andWhere("appliedForm.availability = :availability", { availability });
    }
    if (position && position !== "All") {
      query = query.andWhere("appliedForm.position = :position", { position });
    }
    if (skillSet && skillSet !== "All") {
      query = query.andWhere("appliedForm.skillSet LIKE :skillSet", { skillSet: `%${skillSet}%` });
    }

    const appliedForms = await query.getMany();

    if (appliedForms.length === 0) {
      res.status(200).json([]);
      return;
    }

    // Extract unique candidate IDs from applied forms
    const candidateIDs = [...new Set(appliedForms.map(af => af.candidateID))];

    // Step 2: Count how many preferences each candidate has (only for candidateIDs)
    const preferences = await preferenceRepo
      .createQueryBuilder("preference")
      .select("preference.candidateId", "candidateID")
      .addSelect("COUNT(*)", "count")
      .where("preference.candidateId IN (:...candidateIDs)", { candidateIDs })
      .groupBy("preference.candidateId")
      .getRawMany();

    // Map candidateID => preference count
    const preferenceCountMap = new Map<number, number>();
    preferences.forEach(p => {
      preferenceCountMap.set(parseInt(p.candidateID), parseInt(p.count));
    });

    // Explicitly set 0 count for candidates without preferences
    candidateIDs.forEach(id => {
      if (!preferenceCountMap.has(id)) {
        preferenceCountMap.set(id, 0);
      }
    });

    // Step 3: Filter candidate IDs based on preference count filter
    let filteredCandidateIDs = candidateIDs;
    if (filterCountType === "most") {
      const maxCount = Math.max(...preferenceCountMap.values());
      filteredCandidateIDs = candidateIDs.filter(id => preferenceCountMap.get(id) === maxCount);
    
    } else if (filterCountType === "least") {
      // Get all counts > 0
      const countsExcludingZero = Array.from(preferenceCountMap.values()).filter(c => c > 0);
      const minCount = countsExcludingZero.length > 0 ? Math.min(...countsExcludingZero) : 0;
      filteredCandidateIDs = candidateIDs.filter(id => preferenceCountMap.get(id) === minCount);
    
    } else if (filterCountType === "not chosen") {
      // Check if any candidate has 0 preferences
      const zeroPrefCandidates = candidateIDs.filter(id => {
        const count = preferenceCountMap.get(id);
        console.log('CEKKK',count)
        return count === undefined || count === 0;
      });
      filteredCandidateIDs = zeroPrefCandidates.length > 0 ? zeroPrefCandidates : [];
    
    } else {
      filteredCandidateIDs = candidateIDs; // all
    }
    console.log("After normalization, filterCountType:", filterCountType); 
    console.log("After normalization, value:", filteredCandidateIDs); 

    // Step 4: Get candidate details with filtered candidate IDs
    let candidateQuery = candidateRepo.createQueryBuilder("candidate")
      .where("candidate.id IN (:...filteredCandidateIDs)", { filteredCandidateIDs });

    if (searchName && String(searchName).trim() !== "") {
      candidateQuery = candidateQuery.andWhere("candidate.name LIKE :searchName", { searchName: `%${searchName}%` });
    }

    const candidates = await candidateQuery.getMany();

    // Add appliedForms and preferenceCount info to each candidate
    const result = candidates.map(candidate => ({
      ...candidate,
      appliedForms: appliedForms.filter(af => af.candidateID === candidate.id),
      preferenceCount: preferenceCountMap.get(candidate.id) || 0
    }));

    res.status(200).json(result);

  } catch (error) {
    console.error("Error fetching filtered candidates:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};