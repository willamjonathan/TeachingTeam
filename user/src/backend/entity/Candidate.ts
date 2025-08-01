import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Preference } from "./Preference";

@Entity()
export class Candidate {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true }) // only email is unique
  email!: string;

  @Column()
  name!: string;

  @Column()
  password!: string;

  @Column()
  DOB!: string;

  @Column()
  gender!: string;

  @Column()
  DOJ!: string; // date of joining

  @Column({ default: true })
  is_Active!: boolean;

  @OneToMany(() => Preference, (preference) => preference.candidate)
  preferences!: Preference[];
  
}

