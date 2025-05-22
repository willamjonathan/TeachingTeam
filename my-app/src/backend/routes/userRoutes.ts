// userRoutes.ts
import { Router } from "express";
import { getCandidates,getCandidateNameById ,createCandidate, loginCandidate, getLecturers, createLecturer, getCandidateIdByEmail} from "../controller/userController";
import { createForm, getForm, updateForm, getFormsByCandidateId, getApplicantsByCourseCodeFromAppliedForm } from "../controller/candidate"; 
import { getCourses, postMultiplePreferences } from "../controller/userController"; // or courseController
// taughtcourse
import { getCoursesByLecturer,postPreference, getApplicantsByCourseId, getLecturerByUsername  } from "../controller/userController";
import { loginLecturer, getFilteredCandidates } from "../controller/userController";
// import {}


const router = Router();

// Routes for Candidates
router.get("/candidates", getCandidates);
router.post("/candidates", createCandidate);
router.post("/candidates/login", loginCandidate)
router.get('/candidate-id/:email', getCandidateIdByEmail);
router.get("/candidate/:id", getCandidateNameById);


//Routes for candidates form
router.get("/forms", getForm)
router.post("/form", createForm)
router.put("/form/:candidateId/:courseCode", updateForm);
router.get("/forms/:candidateId", getFormsByCandidateId);


// Routes for Lecturers
router.get("/lecturers", getLecturers);
router.post("/lecturers", createLecturer);
router.post("/lecturers/login", loginLecturer);
router.get("/lecturers/email/:email", getLecturerByUsername);


// COURSES
router.get("/courses", getCourses);
router.get("/lecturers/:lecturerId/courses", getCoursesByLecturer);
router.get("/applicants/course/:courseId", getApplicantsByCourseId);
router.get("/forms/course/:courseCode", getApplicantsByCourseCodeFromAppliedForm);



// preferences
router.post("/preferences", postPreference);
router.post("/preferences/multiple", postMultiplePreferences);
// router.post("/preferences", createOrUpdatePreference);



// FILTER
// router.get('/lecturers/:lecturerId/applicants', getApplicantsByLecturer);
router.get("/candidates/filter", getFilteredCandidates);




export default router;
