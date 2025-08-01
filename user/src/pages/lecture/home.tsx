import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Header from "../components/lecture-header";
import Jumbotron from "../components/jumbotron";
import Footer from "../components/footer";
import Welcome from "../components/welcome";
import styles from "../../styles/home.module.css";
import styles1 from "../../styles/home.lecture.module.css";
// import { Course, getCourses } from "../courses/course";
import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from 'recharts';



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
    const [activeTab, setActiveTab] = useState<"courses" | "applicants">("courses");
    const [applicants, setApplicants] = useState<Applicant[]>([]);
    const [filteredApplicants, setFilteredApplicants] = useState<Applicant[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<string>("All");
    const [selectedAvailability, setSelectedAvailability] = useState<string>("All");
    const [selectedPosition, setSelectedPosition] = useState<string>("All");

    const [searchName, setSearchName] = useState<string>("");
    const [chosenCount, setChosenCount] = useState<string>("All");
    const router = useRouter();
    const [comments, setComments] = useState<{ [username: string]: string }>({});
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
    }, [selectedCourse, selectedAvailability, selectedPosition, selectedSkillSet, searchName, chosenCount, lecturerID]);



    useEffect(() => {
        console.log("Fetched courses:", courses);
    }, [courses]);

    // useEffect(() => {
    //     console.log("document.cookie", document.cookie);
    //     const id = getLecturerIDFromCookie();
    //     console.log("kukihyes", id);
    //     setLecturerID(id);
    // }, []);
    // console.log("test kkukis", lecturerID)

    // Fetch all applicants when the tab is switched to applicants
    // Validate that savedData is not null
    const fetchFilteredCandidates = async () => {
        try {
            const params = new URLSearchParams();
            if (selectedCourse !== "All") params.append("courseId", selectedCourse);
            if (selectedAvailability !== "All") params.append("availability", selectedAvailability);
            if (selectedPosition !== "All") params.append("position", selectedPosition);
            if (selectedSkillSet !== "All") params.append("skillSet", selectedSkillSet);
            if (searchName.trim() !== "") params.append("searchName", searchName.trim());
            if (chosenCount !== "All") {
                if (chosenCount === "Most") params.append("filterCountType", "most");
                else if (chosenCount === "Least") params.append("filterCountType", "least");
                else if (chosenCount === "Not Chosen") params.append("filterCountType", "not chosen");
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

            console.log(filteredApplicants)
        } catch (error) {
            console.error("Error fetching filtered candidates:", error);
        }
    };


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


    // // Ensure all usernames in registeredApplicants are non-empty strings
    // const updateUserCountWithRegisteredApplicants = (
    //     userCount: { [key: string]: number },
    //     registeredApplicants: string[]
    // ): { [key: string]: number } => {
    //     // Iterate through each registered applicant
    //     registeredApplicants.forEach((username) => {
    //         // If the user doesn't exist in userCount, add them with a count of 0
    //         if (!(username in userCount)) {
    //             userCount[username] = 0;
    //         }
    //     });

    //     return userCount; // Return the updated userCount
    // };

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

    useEffect(() => {
        if (activeTab === "applicants") {
            fetchFilteredCandidates();
        }
    }, [activeTab, courses]);  // Trigger getAllApplicants when activeTab or courses changes

    const chartData = filteredApplicants.map(applicant => ({
        name: applicant.name,
        Chosen: applicant.preferenceCount || 0,
    }));


    return (
        <div className={styles1.body}>
            <Header />
            <Jumbotron />
            <Welcome />

            {/* Buttons for applicants or course */}
            {/* Input: choosing courses to see courses that is available or applicants that show all of the applicant that already send an applicant form */}
            <div className={styles1.choice}>
                {/* This one is default page when you are logged in as lecturer */}
                <div
                    className={`${styles1.courses} ${activeTab === "courses" ? styles1.active : ""}`}
                    onClick={() => setActiveTab("courses")}
                >
                    Courses
                </div>
                <div
                    className={`${styles1.applicants} ${activeTab === "applicants" ? styles1.active : ""}`}
                    onClick={() => setActiveTab("applicants")}
                >
                    Applicants
                </div>
            </div>

            {/* Course selection */}
            {/* Input by choosing one of the courses box to go to course page */}
            {activeTab === "courses" ? (
                <div className={styles.homecontainer}>
                    {courses.length > 0 ? (
                        courses.map((course) => (
                            <div
                                key={course.id}
                                className={styles.box}
                                onClick={() => {
                                    localStorage.setItem("lecturerChoose", course.title);
                                    setSelectedCourse(course.title);
                                    console.log("Selected Course:", course.title);
                                    router.push("/lecture/course");
                                }}
                            >
                                <div className={styles.picture}>
                                    <div className={styles.coursetitleBIG}>{course.title}</div>
                                    <div className={styles.boxtextcontainer}>
                                        <div className={styles.coursetitle}>{course.courseCode}</div>
                                        <div className={styles.coursecode}>{course.description}</div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>Loading courses...</p>
                    )}
                </div>

            ) : (
                <div className={styles1.homecontainer}>
                    {/* Filter container */}
                    <div className={styles1.filtercontainer}>
                        {/* Input course name in dragged down choice */}
                        {/* Filter by course name */}
                        <div className={styles1.filter}>
                            <label>Filter by Course:</label>
                            <select value={selectedCourse}
                                className={styles1.dropdown}
                                onChange={e => setSelectedCourse(e.target.value)}>
                                {uniqueCourseNames.map(name => (
                                    <option key={name} value={name}>{name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Availability filter */}
                        {/* Input Full-time/Part-time in dragged down choice */}
                        <div className={styles1.filter}>
                            <label>Filter by Availability:</label>
                            <select value={selectedAvailability}
                                onChange={e => setSelectedAvailability(e.target.value)}
                                className={styles1.dropdown}>
                                <option value="All">All Availability</option>
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                            </select>
                        </div>
                        {/* Count filter */}
                        {/* Input All/Most/Least/Not Chosen in dragged down choice */}
                        <div className={styles1.filter}>
                            <label>Filter by Count:</label>
                            <select
                                value={chosenCount}
                                onChange={(e) => setChosenCount(e.target.value)}
                                className={styles1.dropdown}
                            >
                                <option value="All">All</option>
                                <option value="Most">Most</option>
                                <option value="Least">Least</option>
                                <option value="Not Chosen">Not Chosen</option>
                            </select>
                        </div>

                        {/* Input All/Python/SQL/Javascript/Java/C++ in dragged down choice */}
                        <div className={styles1.filter}>
                            <label>Filter by Skill Set:</label>
                            <select value={selectedSkillSet}
                                className={styles1.dropdown}
                                onChange={e => setSelectedSkillSet(e.target.value)}>
                                {uniqueSkillSets.map((skill) => (
                                    <option key={skill} value={skill}>{skill}</option>
                                ))}
                            </select>
                        </div>

                        <div className={styles1.filter}>
                            <label>Filter by Position:</label>
                            <select value={selectedPosition}
                                onChange={e => setSelectedPosition(e.target.value)}
                                className={styles1.dropdown}>
                                <option value="All">All</option>
                                <option value="TA">TA</option>
                                <option value="Lab-assistant">Lab-assistant</option>
                            </select>
                        </div>


                        {/* Search filter */}
                        {/* Inputting text in string form */}
                        <div className={styles1.search}>
                            <label>Search by Name:</label>
                            <input
                                type="text"
                                placeholder="Enter username"
                                value={searchName}
                                onChange={(e) => setSearchName(e.target.value)}
                                className={styles1.searchInput}
                            />
                        </div>


                    </div>

                    {/* Display applicants */}
                    {chartData.length > 0 && (
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="Chosen" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}

                    {filteredApplicants.length > 0 ? (
                        filteredApplicants.map((applicant, index) => (
                            <div key={index} className={styles1.applicantBox}>
                                <div className={styles1.applicantDetails}>
                                    <div className={styles1.applicantInfo}>
                                        <h4>{applicant.name} (Chosen: {applicant.preferenceCount})</h4>

                                        {applicant.appliedForms.map((form, idx) => (
                                            <div key={idx} className={styles1.applicantInfo1}>
                                                <div>
                                                    {courses.find(c => c.courseCode === form.courseID)?.title || form.courseID}
                                                </div>
                                                <div className={styles1.applicantInfo2}>
                                                    <p><strong>Previous Role:</strong> {form.previousRole}</p>
                                                    <p><strong>Availability:</strong> {form.availability}</p>
                                                    <p><strong>Skill Set:</strong> {form.skillSet || "N/A"}</p>
                                                    <p><strong>Academic Credential:</strong> {form.academicCredential || "N/A"}</p>
                                                    <p><strong>Position:</strong> {form.position}</p>

                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No applicants found matching the criteria.</p>
                    )}

                </div>
            )}

            <Footer />
        </div>
    );
};

export default Home;
