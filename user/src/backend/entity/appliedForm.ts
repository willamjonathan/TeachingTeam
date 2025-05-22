import { Entity, PrimaryColumn, Column } from "typeorm";
import { Candidate } from "./Candidate"

@Entity()
export class AppliedForm {
  @PrimaryColumn()
  courseID!: string;

  @PrimaryColumn()
  candidateID!: number;

  @Column()
  position!: string;

  @Column()
  previousRole!: string;

  @Column()
  availability!: string;

  @Column("simple-array")
  skillSet!: string[];

  @Column()
  academicCredential!: string;
}
