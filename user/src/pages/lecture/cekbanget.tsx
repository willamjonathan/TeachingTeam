import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Header from "../components/lecture-header";
import Jumbotron from "../components/jumbotron";
import Footer from "../components/footer";
import Welcome from "../components/welcome";
import styles from "../../styles/home.module.css";
import styles1 from "../../styles/home.lecture.module.css";
import React from 'react';

interface AppliedForm {
  courseID: string;
  candidateID: number;
  position: string;
  previousRole: string;
  availability: string;
  skillSet: string;
  academicCredential: string;
}

interface Applicant {
  id: number;
  name: string;
  email: string;
  DOB: string;
  DOJ: string;
  gender: string;
  is_Active: boolean;
  password: string;
  appliedForms: AppliedForm[];
  preferenceCount: number;
}

export interface Course {
  id: number;
  title: string;
  courseCode: string;
  description: string;
}

export const getCoursesByLecturer = async (lecturerId: string): Promise<Course[]> => {
  try {
    const response = await fetch(`http://localhost:5001/api/lecturers/${lecturerId}/courses`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch courses by lecturer');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching courses by lecturer:', error);
    throw error;
  }
};

const Home = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [filteredApplicants, setFilteredApplicants] = useState<Applicant[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("All");
  const [selectedAvailability, setSelectedAvailability] = useState<string>("All");
  const [searchName, setSearchName] = useState<string>("");
  const [chosenCount, setChosenCount] = useState<string>("All");
  const [selectedSkillSet, setSelectedSkillSet] = useState<string>("All");
  const [lecturerID, setLecturerID] = useState<string | null>(null);

  useEffect(() => {
    const id = getLecturerIDFromCookie();
    if (id) {
      setLecturerID(id);
      getCoursesByLecturer(id).then(setCourses).catch(console.error);
    }
  }, []);

  useEffect(() => {
    if (lecturerID) {
      fetchFilteredCandidates();
    }
  }, [selectedCourse, selectedAvailability, selectedSkillSet, searchName, chosenCount, lecturerID]);

  const getLecturerIDFromCookie = (): string | null => {
    const name = "lecturerID=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookies = decodedCookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim();
      if (cookie.startsWith(name)) {
        return cookie.substring(name.length);
      }
    }
    return null;
  };

  const fetchFilteredCandidates = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedCourse !== "All") params.append("courseId", selectedCourse);
      if (selectedAvailability !== "All") params.append("availability", selectedAvailability);
      if (selectedSkillSet !== "All") params.append("skillSet", selectedSkillSet);
      if (searchName.trim() !== "") params.append("searchName", searchName.trim());
      if (chosenCount !== "All") {
        if (chosenCount === "Most") params.append("filterCountType", "most");
        else if (chosenCount === "Least") params.append("filterCountType", "least");
        else if (chosenCount === "Not Chosen") params.append("filterCountType", "none");
      }

      const url = `http://localhost:5001/api/candidates/filter?${params.toString()}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error("Failed to fetch candidates");

      const data: Applicant[] = await response.json();
      setApplicants(data);
      setFilteredApplicants(data);
    } catch (error) {
      console.error("Error fetching filtered candidates:", error);
    }
  };

  const uniqueCourseNames = ["All", ...new Set(courses.map(course => course.courseCode))];
  const uniqueSkillSets = [
    "All",
    ...Array.from(
      new Set(
        applicants.flatMap((applicant) =>
          applicant.appliedForms.map((form) => form.skillSet).filter(Boolean)
        )
      )
    ),
  ];
  

  return (
    <div className={styles.container}>
      <Header />
      <Jumbotron />
      <Welcome />

      <div>
        <select value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)}>
          {uniqueCourseNames.map(name => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>

        <select value={selectedAvailability} onChange={e => setSelectedAvailability(e.target.value)}>
          <option value="All">All Availability</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
        </select>

        <select value={selectedSkillSet} onChange={e => setSelectedSkillSet(e.target.value)}>
  {uniqueSkillSets.map((skill) => (
    <option key={skill} value={skill}>{skill}</option>
  ))}
</select>


        <input
          type="text"
          placeholder="Search by name"
          value={searchName}
          onChange={e => setSearchName(e.target.value)}
        />

        <select value={chosenCount} onChange={e => setChosenCount(e.target.value)}>
          <option value="All">All Counts</option>
          <option value="Most">Most</option>
          <option value="Least">Least</option>
          <option value="Not Chosen">Not Chosen</option>
        </select>
      </div>

      <div>
        {filteredApplicants.length === 0 && <p>No applicants found.</p>}
        {filteredApplicants.map(applicant => (
          <div key={applicant.id} className={styles1.applicantInfo}>
            <h4>{applicant.name} (Chosen: {applicant.preferenceCount})</h4>
            {applicant.appliedForms.map((form, idx) => (
              <div key={idx} className={styles1.applicantInfo1}>
                <div>{courses.find(c => c.courseCode === form.courseID)?.title || form.courseID}</div>
                <div className={styles1.applicantInfo2}>
                  <p><strong>Previous Role:</strong> {form.previousRole}</p>
                  <p><strong>Availability:</strong> {form.availability}</p>
                  <p><strong>Skill Set:</strong> {form.skillSet || "N/A"}</p>
                  <p><strong>Academic Credential:</strong> {form.academicCredential || "N/A"}</p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
};

export default Home;