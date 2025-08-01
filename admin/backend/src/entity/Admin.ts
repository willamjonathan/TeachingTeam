import {
    Entity,
    Column,
    PrimaryColumn, 
  } from "typeorm";
  
  @Entity()
  export class Admin {
    @PrimaryColumn() 
    username: string;
  
    @Column()
    password: string;
  
  }
  