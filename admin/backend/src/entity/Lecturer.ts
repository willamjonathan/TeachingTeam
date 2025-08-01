import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Preference } from "./Preference";

@Entity()
export class Lecturer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  department: string;

  @Column()
  email: string;

  @Column()
  password: string; 

  @OneToMany(() => Preference, (preference) => preference.lecturer)
  preferences: Preference[];
}
