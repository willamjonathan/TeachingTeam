// import { Request, Response } from "express";
// import { AppDataSource } from "../data-source";
// import { Lecturer } from "../entity/Lecturer";

// export class LecturerController {
//   private lecturerRepository = AppDataSource.getRepository(Lecturer);

//   // GET all lecturers
//   async getAllLecturers(req: Request, res: Response) {
//     try {
//       const lecturers = await this.lecturerRepository.find();
//       return res.json(lecturers);
//     } catch (error) {
//       console.error("Error fetching lecturers:", error);
//       return res.status(500).json({ message: "Server error" });
//     }
//   }

//   // GET lecturer by ID
//   async getLecturerById(req: Request, res: Response) {
//     try {
//       const id = parseInt(req.params.id);
//       const lecturer = await this.lecturerRepository.findOneBy({ id });

//       if (!lecturer) {
//         return res.status(404).json({ message: "Lecturer not found" });
//       }

//       return res.json(lecturer);
//     } catch (error) {
//       console.error("Error fetching lecturer by ID:", error);
//       return res.status(500).json({ message: "Server error" });
//     }
//   }
// }
