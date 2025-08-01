import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type Admin {
    username: String!
    password: String!
  }

  type TaughtCourse {
    lecturer: Lecturer!      
    course: Course!          
  }

  type Lecturer {
    id: ID!
    name: String!
    department: String!
    email: String!
    password: String!
    preferences: [Preference!]!
  }

  type Course {
    courseCode: String!
    title: String!
    description: String!
    preferences: [Preference!]!
    appliedForms: [AppliedForm!]!
  }

  type Candidate {
    id: ID!
    email: String!
    name: String!
    password: String!
    is_Active: Boolean!
    preferences: [Preference!]!
    appliedForms: [AppliedForm!]!
  }

  type Preference {
    preferenceID: ID!
    lecturer: Lecturer!
    course: Course!
    candidate: Candidate!
    preferenceNumber: Int!
    comment: String
  }

  type AppliedForm {
    courseID: String!
    candidateID: ID!
    course: Course!
    candidate: Candidate!
    position: String!
    previousRole: String!
    availability: String!
    skillSet: [String!]!
    academicCredential: String!
  }

  type CandidatePerCourse {
    courseCode: String!
    candidates: [CandidateInfo!]!
  }

  type CandidateInfo {
    id: ID!
    name: String!
    count: Int!
  }

  type Query {
    getAdmin: Admin
    getLecturers: [Lecturer]
    getLecturerById(id: Int!): Lecturer
    getCourses: [Course!]!
    getCourse(courseCode: String!): Course
    getTaughtCourses: [TaughtCourse]
    getCandidates: [Candidate!]!
    getCandidate(id: Int!): Candidate
    getPreferences: [Preference!]!
    getCandidatesPerCourse: [CandidatePerCourse!]!
    getCandidatesMoreThan3Courses: [Candidate!]!
    getCandidatesNotChosen: [Candidate!]!
  }

  type Mutation {
    login(username: String!, password: String!): String
    addCourse(courseCode: String!, title: String!, description: String!): Course!
    editCourse(courseCode: String!, title: String, description: String): Course!
    deleteCourse(courseCode: String!): String
    addTaughtCourse(lecturerId: Int!, courseCode: String!): TaughtCourse
    deleteTaughtCourse(lecturerId: Int!, courseCode: String!): MessageResponse   
    updateCandidateStatus(id: Int!, is_Active: Boolean!): Candidate
  }

  type MessageResponse {
    message: String
  }
`;
