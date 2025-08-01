import { Entity, PrimaryColumn, Column, OneToMany } from "typeorm";
import { Preference } from "./Preference";
import { AppliedForm } from "./appliedForm";

@Entity()
export class Course {
  @PrimaryColumn()
  courseCode: string;

  @Column()
  title: string;

  @Column()
  description: string;
  @OneToMany(() => Preference, (preference) => preference.course)
  preferences: Preference[];
  @OneToMany(() => AppliedForm, appliedForm => appliedForm.course)
  appliedForms: AppliedForm[];

}
