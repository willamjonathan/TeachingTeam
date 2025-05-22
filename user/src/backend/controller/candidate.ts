import { Request, response, Response, RequestHandler } from "express";
import { AppDataSource } from "../data-source";
import { AppliedForm } from "../entity/appliedForm";
import { availableMemory } from "process";

// Get all candidates
export const getForm = async (req: Request, res: Response) => {
  try {
    const forms = await AppDataSource.getRepository(AppliedForm).find();
    res.json(forms);
  } catch (error) {
    console.error('Error fetching forms:', error);
    res.status(500).json({ error: 'Failed to fetch forms' });
  }
};

// CreateForm
export const createForm = async (req: Request, res: Response) => {
  try {
    const { CandidateID, CourseCode, Position, PreviousRole, Availability, Skills, AcademicCredentials } = req.body;

    if (!CandidateID || !CourseCode) {
      res.status(400).json({ error: 'CandidateID and CourseCode are required' });
    }else{
      const form = new AppliedForm();
      form.candidateID = CandidateID;
      form.courseID = CourseCode;
      form.position = Position;
      form.previousRole = PreviousRole;
      form.availability = Availability;
      form.skillSet = Skills;
      form.academicCredential = AcademicCredentials;

      await AppDataSource.manager.save(form);
      res.status(201).json(form);
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create form' });
  }
};

export const updateForm = async (req: Request, res: Response) => {
  const { candidateId, courseCode } = req.params;
  const { Position,PreviousRole, Availability, Skills, AcademicCredentials } = req.body;

  try {
    const formRepository = AppDataSource.getRepository(AppliedForm);

    const form = await formRepository.findOne({
      where: {
        candidateID: parseInt(candidateId),
        courseID: courseCode,
      },
    });

    if (!form) {
      res.status(404).json({ message: "Form not found" });
      return;
    }

    form.previousRole = PreviousRole ?? form.previousRole;
    form.position = Position ?? form.position;

    form.availability = Availability ?? form.availability;
    form.skillSet = Skills ?? form.skillSet;
    form.academicCredential= AcademicCredentials ?? form.academicCredential;

    await formRepository.save(form);

    res.status(200).json(form);
  } catch (error) {
    console.error("Error updating form:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};


export const getFormsByCandidateId = async (req: Request, res: Response) => {
  const { candidateId } = req.params;

  try {
    const formRepository = AppDataSource.getRepository(AppliedForm);

    const forms = await formRepository.find({
      where: { candidateID: parseInt(candidateId) },
    });

    if (!forms || forms.length === 0) {
      res.status(404).json({ message: "No forms found for this candidate" });
      return 
    }

    res.status(200).json(forms);
  } catch (error) {
    console.error("Error fetching forms by candidateId:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const getApplicantsByCourseCodeFromAppliedForm = async (req: Request, res: Response) => {
  const { courseCode } = req.params;

  try {
    const formRepository = AppDataSource.getRepository(AppliedForm);

    const applicants = await formRepository.find({
      where: { courseID: courseCode },
    });

    if (!applicants || applicants.length === 0) {
       res.status(404).json({ message: "No applicants found for this course code" })
       return;
    }

    res.status(200).json(applicants);
  } catch (error) {
    console.error("Error fetching applicants by course code:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};
