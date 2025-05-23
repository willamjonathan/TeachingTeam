import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Header from "./components/tutor-header";
import Jumbotron from "./components/jumbotron";
import Footer from "./components/footer";
import Welcome from "./components/welcomeCandidate";
import styles from "../styles/home.module.css";
import React from "react";

interface Course {
  courseCode: string;
  title: string;
  description: string;
}

const Home = () => {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [candidateForms, setCandidateForms] = useState<any[]>([]);

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState({
    previousRole: "",
    availability: "part-time",
    skillSet: "",
    academicCredential: "",
    courseCode: "",
    position: "",
  });

  const [username, setUsername] = useState<string | null>(null);

  const getCandidateIDFromCookie = () => {
    const name = "candidateID=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookies = decodedCookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim();
      if (cookie.startsWith(name)) {
        return cookie.substring(name.length);
      }
    }

    return null; // If not found
  };

  useEffect(() => {
    // Authentication check
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    const savedUsername = localStorage.getItem("Username");

    if (isAuthenticated !== "true" && isAuthenticated !== "lecturer") {
      router.push("/login");
    } else if (isAuthenticated === "lecturer") {
      router.push("/lecture/home");
    } else {
      setUsername(savedUsername);
    }

    // Fetch courses from backend API
    const fetchCourses = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/courses");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Course[] = await response.json();
        setCourses(data);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      }
    };

    fetchCourses();
  }, [router]);

  // Fetch candidate forms when username or candidateId changes
  useEffect(() => {
    const rawCandidateId = getCandidateIDFromCookie();
    if (rawCandidateId) {
      const candidateId = parseInt(rawCandidateId, 10);
      fetchCandidateForms(candidateId);
    }
  }, [username]);

  const fetchCandidateForms = async (candidateId: number) => {
    try {
      const response = await fetch(`http://localhost:5001/api/forms/${candidateId}`);
      if (!response.ok) throw new Error('Failed to fetch candidate forms');
      const data = await response.json();
      setCandidateForms(data);
    } catch (err) {
      console.error(err);
    }
  };

  const showPopup = (course: Course) => {
    setSelectedCourse(course);

    if (username) {
      const rawCandidateId = getCandidateIDFromCookie();
      if (!rawCandidateId) return; // CandidateId missing

      const candidateId = parseInt(rawCandidateId, 10);

      const existingForm = candidateForms.find(
        (form) =>
          form.courseID === course.courseCode &&
          form.candidateID === candidateId
      );
      console.log(candidateForms)

      console.log("TEST", existingForm)
      if (existingForm) {
        console.log('true')
        setFormData({
          previousRole: existingForm.previousRole,
          availability: existingForm.availability,
          skillSet: existingForm.skillSet,
          academicCredential: existingForm.academicCredential,
          courseCode: course.courseCode,
          position: existingForm.position || "",
        });
      } else {
        setFormData({
          previousRole: "",
          availability: "part-time",
          skillSet: "",
          academicCredential: "",
          courseCode: course.courseCode,
          position: "",
        });
      }
    }

    setIsPopupOpen(true);
  };
  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedCourse(null);
    setFormData({
      previousRole: "",
      availability: "part-time",
      skillSet: "",
      academicCredential: "",
      courseCode: "",
      position: "",
    });
  };


  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Function to add applicant's name to registered applicants list in localStorage
  const addApplicantToStorage = (applicantName: string) => {
    const registeredApplicants = JSON.parse(
      localStorage.getItem("registeredapplicant") || "[]"
    );
    if (!registeredApplicants.includes(applicantName)) {
      registeredApplicants.push(applicantName);
      localStorage.setItem(
        "registeredapplicant",
        JSON.stringify(registeredApplicants)
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedCourse && username) {
      const rawCandidateId = getCandidateIDFromCookie();
      if (!rawCandidateId) {
        console.error("Candidate ID cookie not found.");
        return;
      }

      const CandidateId = parseInt(rawCandidateId, 10);

      const formDatas = {
        CandidateID: CandidateId,
        CourseCode: formData.courseCode,
        Position: formData.position,
        PreviousRole: formData.previousRole,
        Availability: formData.availability,
        Skills: formData.skillSet,
        AcademicCredentials: formData.academicCredential,
      };


      // Check if form exists for this candidate and course
      const existingForm = candidateForms.find(
        (form) =>
          form.courseID === formData.courseCode &&
          form.candidateID === CandidateId
      );

      try {
        let response;
        console.log(formDatas)
        if (existingForm) {
          // Update existing form with PUT
          response = await fetch(
            `http://localhost:5001/api/form/${CandidateId}/${formData.courseCode}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(formDatas),
            }
          );
        } else {
          // Create new form with POST
          response = await fetch("http://localhost:5001/api/form", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formDatas),
          });
        }

        if (!response.ok) {
          const errorData = await response.json();
          alert(`Failed: ${errorData.message || response.statusText}`);
          return;
        }
        console.log("TESTINGGGG", existingForm)
        alert(existingForm ? "Form updated successfully!" : "Form submitted successfully!");

        // Refresh forms to keep state in sync
        const updatedFormsResponse = await fetch(`http://localhost:5001/api/forms/${CandidateId}`);
        const updatedForms = await updatedFormsResponse.json();
        setCandidateForms(updatedForms);

        addApplicantToStorage(username);
        closePopup();
      } catch (error) {
        console.error("Error submitting/updating form:", error);
        alert("An error occurred while submitting the form.");
      }
    } else {
      alert("Missing selected course or username.");
    }
  };

  return (
    <div className={styles.body}>
      <Header />
      <Jumbotron />
      <Welcome username={username} />

      <div className={styles.courses}>Courses</div>

      <div className={styles.homecontainer}>
        {courses.map((course) => (
          <div
            key={course.courseCode}
            className={styles.box}
            onClick={() => showPopup(course)}
          >
            <div className={styles.picture}>
              <div className={styles.coursetitleBIG}>{course.title}</div>
              <div className={styles.boxtextcontainer}>
                <div className={styles.coursetitle}>{course.courseCode}</div>
                <div className={styles.coursecode}>{course.description}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Footer />

      {isPopupOpen && selectedCourse && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <div className={styles.closePopup} onClick={closePopup}>
              X
            </div>
            <div className={styles.popuptitle}>{selectedCourse.title}</div>
            <p>{selectedCourse.description}</p>
            <form onSubmit={handleSubmit}>
              <label htmlFor="previousRole">Previous Role</label>
              <input
                type="text"
                id="previousRole"
                name="previousRole"
                value={formData.previousRole}
                onChange={handleInputChange}
                placeholder="Enter your previous role"
                required
              />

              <label htmlFor="availability">Availability</label>
              <select
                id="availability"
                name="availability"
                value={formData.availability}
                onChange={handleInputChange}
                required
              >
                <option value="part-time">Part-time</option>
                <option value="full-time">Full-time</option>
              </select>

              <label htmlFor="skillSet">Skills</label>
              <input
                type="text"
                id="skillSet"
                name="skillSet"
                value={formData.skillSet}
                onChange={handleInputChange}
                placeholder="Enter your skills"
                required
              />

              <label htmlFor="academicCredential">Academic Credential</label>
              <input
                type="text"
                id="academicCredential"
                name="academicCredential"
                value={formData.academicCredential}
                onChange={handleInputChange}
                placeholder="Enter your academic credential"
                required
              />
              {/* <label htmlFor="position">Position</label>
              <input
                type="text"
                id="position"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                placeholder="Enter your desired position"
                required
              /> */}
             <select
                id="position"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                required
              >
                <option value="TA">TA</option>
                <option value="Lab-assistant">Lab-assistant</option>
              </select>

              {/* Hidden courseCode field */}
              <input
                type="hidden"
                name="courseCode"
                value={formData.courseCode}
              />

              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
