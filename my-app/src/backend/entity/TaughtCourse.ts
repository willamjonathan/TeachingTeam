import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm";
import { Lecturer } from "./Lecturer";
import { Course } from "./Course";

@Entity()
export class TaughtCourse {
  // Composite primary key: lecturerId + courseCode
  @PrimaryColumn()
  lecturerId!: number;

  @PrimaryColumn()
  courseCode!: string;

  // Many-to-One relationship with Lecturer
  @ManyToOne(() => Lecturer, lecturer => lecturer.id)
  @JoinColumn({ name: "lecturerId" }) // Explicitly define the foreign key column name
  lecturer!: Lecturer;

  // Many-to-One relationship with Course
  @ManyToOne(() => Course, course => course.courseCode)
  @JoinColumn({ name: "courseCode" }) // Explicitly define the foreign key column name
  course!: Course;
}
