import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Preference } from "./Preference";
import { AppliedForm } from "./appliedForm";

@Entity()
export class Candidate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column()
  DOB!: string;

  @Column()
  gender!: string;

  @Column()
  DOJ!: string;

  @Column({ default: true })
  is_Active: boolean;

  @OneToMany(() => Preference, (preference) => preference.candidate)
  preferences: Preference[];

  @OneToMany(() => AppliedForm, appliedForm => appliedForm.candidate)
  appliedForms: AppliedForm[];

}
