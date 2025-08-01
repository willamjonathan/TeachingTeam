import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Lecturer } from "./Lecturer";
import { Course } from "./Course";
import { Candidate } from "./Candidate";

@Entity()
export class Preference {
  @PrimaryGeneratedColumn("uuid")
  preferenceID: string;

  @ManyToOne(() => Lecturer, (lecturer) => lecturer.preferences)
  lecturer: Lecturer;

  @ManyToOne(() => Course, (course) => course.preferences)
  course: Course;

  @ManyToOne(() => Candidate, (candidate) => candidate.preferences)
  candidate: Candidate;

  @Column()
  preferenceNumber: number;

  @Column({ nullable: true })
  comment: string;
}
