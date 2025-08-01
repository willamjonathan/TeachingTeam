import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Preference } from "./Preference";

@Entity()  // Marks the class as an entity corresponding to a table
export class Lecturer {
  @PrimaryGeneratedColumn()  // Auto-generated primary key
  id!: number;  // No need to specify `undefined`, just add `!`

  @Column()  // Column for lecturer's name
  name!: string; 

  @Column()
  department!: string;

  @Column()  // Column for lecturer's email
  email!: string;  

  @Column()  // Column for lecturer's password
  password!: string;  

  @OneToMany(() => Preference, (preference) => preference.lecturer)
  preferences!: Preference[];

  // @Column()  // Column for lecturer's active status
  // is_Active!: string;  

  // Add other columns as needed
}
