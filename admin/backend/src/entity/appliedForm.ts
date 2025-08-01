import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Candidate } from "./Candidate";
import { Course } from "./Course";

@Entity()
export class AppliedForm {
  @PrimaryColumn()
  courseID: string;

  @PrimaryColumn()
  candidateID: number;

  @ManyToOne(() => Course, course => course.appliedForms)
  @JoinColumn({ name: "courseID" })
  course: Course;

  @ManyToOne(() => Candidate, candidate => candidate.appliedForms)
  @JoinColumn({ name: "candidateID" })
  candidate: Candidate;

  @Column()
  position: string;

  @Column()
  previousRole: string;

  @Column()
  availability: string;

  @Column("simple-array")
  skillSet: string[];

  @Column()
  academicCredential: string;
}
