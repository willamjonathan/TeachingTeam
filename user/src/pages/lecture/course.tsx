import { useEffect, useState } from "react";
import Header from "../components/lecture-header";
import Jumbotron from "../components/jumbotron";
import Footer from "../components/footer";
import Welcome from "../components/welcome";
import styles1 from "../../styles/course.lecture.module.css";
// import { Course, getCourses } from "../courses/course";
import { useRouter } from "next/router";
import React from 'react';
import { Candidate } from "@/backend/entity/Candidate";



export interface Course {
    id: number;
    title: string;
    courseCode: string;
    description: string;
}
interface Applicant {
    id: number;
    name: string;
    [key: string]: any; // optional for any other props
}


const Home = () => {
    const router = useRouter();
    const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
    const [courseData, setCourseData] = useState<Course | null>(null);
    const [applicants, setApplicants] = useState<any[]>([]);
    // const [selectedApplicants, setSelectedApplicants] = useState<Set<string>>(new Set());
    // const [preferences, setPreferences] = useState<{ [username: string]: number }>({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    // const [comments, setComments] = useState<{ [username: string]: string }>({});
    const [preferences, setPreferences] = useState<{ [candidateId: string]: number }>({});
    const [comments, setComments] = useState<{ [candidateId: string]: string }>({});
    const [selectedApplicants, setSelectedApplicants] = useState<Set<string>>(new Set());
    const [newIndex, setNewIndex] = React.useState<{ [key: number]: number }>({});

    useEffect(() => {
        const storedCourse = localStorage.getItem("lecturerChoose");
        setSelectedCourse(storedCourse);
        console.log(storedCourse)
    }, []);

    useEffect(() => {

        async function fetchCourseData() {
            console.log("CEK SELECTED COURSE", selectedCourse)
            if (!selectedCourse) {
                setCourseData(null);
                return;
            }

            try {
                // Fetch all courses from your backend API
                const response = await fetch("http://localhost:5001/api/courses"); // adjust URL as needed
                // console.log("CEKKKKKK", response)
                if (!response.ok) {
                    throw new Error("Failed to fetch courses");
                }

                const courses = await response.json();

                // Find the course matching the selectedCourse (by title or code)
                const course = courses.find(
                    (course: any) => course.title === selectedCourse || course.code === selectedCourse
                );

                setCourseData(course || null);
            } catch (error) {
                console.error("Error fetching courses:", error);
                setCourseData(null);
            }
        }

        fetchCourseData();
    }, [selectedCourse]);

    useEffect(() => {
        const fetchApplicants = async () => {
            if (!courseData) return;

            try {
                const response = await fetch(
                    `http://localhost:5001/api/forms/course/${courseData.courseCode}`,
                    { method: "GET", headers: { "Content-Type": "application/json" } }
                );
                if (!response.ok) throw new Error("Fetch failed");
                const data = await response.json();
                setApplicants(data);
                console.log('Fetched data:', data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchApplicants();
    }, [courseData]);
    useEffect(() => {
        const fetchPreferences = async () => {
            console.log("FETCH PREFERENCES")
            if (!courseData) return;

            try {
                const response = await fetch(`http://localhost:5001/api/applicants/course/${courseData.courseCode}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" }
                });
                if (!response.ok) throw new Error("Failed to fetch preferences");

                const parsedPreferences = await response.json();
                console.log("WOI APANANNN", parsedPreferences)
                console.log(parsedPreferences[courseData.courseCode])
                console.log("CEK COURSEDATA", courseData.courseCode)
                console.log("ANJAY", parsedPreferences[courseData.courseCode])
                const lecturersInCourse = parsedPreferences[courseData.courseCode];  // this is an object: {16: [...], 17: [...]}
                const lecturerIds = Object.keys(lecturersInCourse);  // ["16", "17"]
                console.log("lecturerIds:", lecturerIds);

                const newIndices: { [key: number]: number } = {};

                for (const lecturerId in lecturersInCourse) {
                    if (lecturersInCourse.hasOwnProperty(lecturerId)) {
                        const candidates = lecturersInCourse[lecturerId];
                        for (let i = 0; i < candidates.length; i++) {
                            const candidate = candidates[i];
                            newIndices[i] = candidate.id;
                        }
                    }
                }

                // Now update state once
                setNewIndex(newIndices);

                console.log("CEKKKKKKKINDEX", newIndices);

                // const firstLecturerId = lecturerIds[0];              // "16"
                // const candidatesForFirstLecturer = lecturersInCourse[firstLecturerId];
                // console.log("Candidates for lecturer 16:", candidatesForFirstLecturer);

                parsedPreferences[courseData.courseCode]
                // const applicants = parsedPreferences[courseData.courseCode] as Array<{ id: number;[key: string]: any }>;

                console.log("Full parsedPreferences:", parsedPreferences);
                console.log("courseData.courseCode:", courseData.courseCode);
                console.log("parsedPreferences[courseData.courseCode]:", parsedPreferences[courseData.courseCode]);

                const rawApplicants = parsedPreferences[courseData.courseCode] as Record<string, Applicant>;

                const applicants = Object.values(rawApplicants);

                const candidateIds = applicants.map(applicant => applicant.id); // No error now

                console.log("Candidate IDs:", candidateIds);


                if (parsedPreferences[courseData.courseCode]) {
                    const coursePrefs = parsedPreferences[courseData.courseCode].applicants || {};
                    console.log('cek number pref', coursePrefs)
                    setPreferences(coursePrefs);  // This assumes coursePrefs is keyed by candidateId
                    console.log('coursePrefs:', coursePrefs);
                    console.log('keys:', Object.keys(coursePrefs));

                    setSelectedApplicants(new Set(Object.keys(coursePrefs)));

                    console.log("cekCOIII", selectedApplicants)


                    const applicantComments: Record<string, string> = {};

                    Object.keys(parsedPreferences[courseData.courseCode]).forEach((lecturer) => {
                        const lecturerPreferences = parsedPreferences[courseData.courseCode][lecturer];
                        Object.keys(lecturerPreferences).forEach((candidateId) => {
                            if (lecturerPreferences[candidateId].comment) {
                                if (!applicantComments[candidateId]) {
                                    applicantComments[candidateId] = `LecID ${lecturer}: ${lecturerPreferences[candidateId].comment}`;
                                } else {
                                    applicantComments[candidateId] += ` | LecID: ${lecturer}: ${lecturerPreferences[candidateId].comment}`;
                                }
                            }
                        });
                    });
                    console.log(Array.isArray(parsedPreferences[courseData.courseCode]));  // true means array
                    console.log(parsedPreferences[courseData.courseCode]);
                    console.log("AOYOK", applicantComments)
                    setComments(applicantComments);
                }


            } catch (error) {
                console.error(error);
            }
        };

        fetchPreferences();
        console.log("GOBLOG", fetchPreferences());
    }, [courseData]);


    useEffect(() => {
        console.log('KOMENNYA DICEK', comments)
        console.log('Applicants state updated:', applicants);
        console.log(applicants)
    }, [applicants]);


    const fetchCandidateName = async (candidateID: string) => {
        try {
            const res = await fetch(`http://localhost:5001/api/candidate/${candidateID}`);
            if (!res.ok) throw new Error("Failed to fetch candidate");
            const data = await res.json();
            return data.name; // or data.username if preferred
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    const fetchApplicants = async () => {
        if (!courseData) return;

        try {
            const response = await fetch(
                `http://localhost:5001/api/forms/course/${courseData.courseCode}`,
                { method: "GET", headers: { "Content-Type": "application/json" } }
            );

            if (!response.ok) throw new Error("Fetch failed");
            const data = await response.json();

            // Fetch and attach candidate names
            const applicantsWithNames = await Promise.all(
                data.map(async (applicant: any) => {
                    const name = await fetchCandidateName(applicant.candidateID);
                    return { ...applicant, candidateName: name };
                })
            );

            setApplicants(applicantsWithNames);
            console.log("Applicants with candidate names:", applicantsWithNames);
        } catch (error) {
            console.error(error);
        }
    };

    const [candidateNames, setCandidateNames] = useState<{ [id: string]: string }>({});

    useEffect(() => {
        const fetchAllCandidateNames = async () => {
            const newNames: { [id: string]: string } = {};

            const uniqueIds = Array.from(new Set(applicants.map(app => app.candidateID)));

            await Promise.all(
                uniqueIds.map(async (id) => {
                    try {
                        const res = await fetch(`http://localhost:5001/api/candidate/${id}`);
                        if (!res.ok) throw new Error("Failed to fetch");
                        const data = await res.json();
                        newNames[id] = data.name; // or data.username
                    } catch (err) {
                        console.error("Error fetching candidate", id, err);
                        newNames[id] = "Unknown";
                    }
                })
            );

            setCandidateNames(newNames);
        };

        if (applicants.length > 0) {
            fetchAllCandidateNames();
        }
    }, [applicants]);
    // Validation Rule: Only selected applicants are saved and validated
    const handleCheckboxChange = (candidateId: string) => {
        setSelectedApplicants(prev => {
            const newSet = new Set(prev);
            if (newSet.has(candidateId)) {
                newSet.delete(candidateId);
            } else {
                newSet.add(candidateId);
            }
            return newSet;
        });
    };
    const usedPreferences = new Set(Object.values(preferences));

    const handlePreferenceChange = (candidateId: string, preference: number) => {
        setPreferences(prev => ({
            ...prev,
            [candidateId]: preference,
        }));
    };

    const handleCommentChange = (candidateId: string, comment: string) => {
        setComments(prev => ({
            ...prev,
            [candidateId]: comment,
        }));
    };

    const handleModalOpen = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    // Validation Rule: Form can only be submitted when all selected applicants have both a preference and a comment
    // Validation Rule: Ensure usedPreferences is updated when a preference is reassigned
    const handleSubmitPreferences = async () => {
        // comments[String(applicant.candidateId)]

        if (!courseData) return;

        const courseId = courseData.courseCode;
        const username = localStorage.getItem("Username"); // get username/email from localStorage

        console.log("SUNMIT USER", username)

        if (!username) {
            console.error("Username not found in localStorage!");
            return;
        }

        // Get lecturerId from server by username
        const lecturerResponse = await fetch(`http://localhost:5001/api/lecturers/email/${username}`);
        if (!lecturerResponse.ok) {
            console.error("Failed to fetch lecturer ID");
            return;
        }
        const lecturerData = await lecturerResponse.json();
        const lecturerId = lecturerData.id;


        const selectedPreferences = Array.from(selectedApplicants).reduce((acc, candidateId) => {
            if (preferences[candidateId]) {
                acc[candidateId] = {
                    preference: preferences[candidateId],
                    comment: comments[candidateId] || "",
                };
            }
            return acc;
        }, {} as { [candidateId: string]: { preference: number; comment: string } });

        console.log("testing selected", selectedPreferences)

        console.log(JSON.stringify({
            lecturerId,
            courseId,
            preferences: selectedPreferences,
        }));



        // Send preferences with lecturerId
        try {
            const res = await fetch("http://localhost:5001/api/preferences/multiple", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    lecturerId,
                    courseId,
                    preferences: selectedPreferences,
                }),
            });

            if (!res.ok) {
                const error = await res.text();
                console.error("Error submitting preferences:", error);
                alert("Failed to save preferences.");
                return;
            }

            alert("Preferences and comments saved successfully!");
            setIsModalOpen(false);
            window.location.reload();
        } catch (error) {
            console.error("Submission error:", error);
            alert("An error occurred while saving preferences.");
        }
    };
    function getIndexFromCandidateId(candidateId: number): number | null {
        for (const [index, id] of Object.entries(newIndex)) {
            if (id === candidateId) {
                return Number(index);
            }
        }
        return null;
    }



    return (
        <div className={styles1.body}>
            <Header />
            {/* <Jumbotron />
            <Welcome /> */}

            {selectedCourse && courseData && (
                <div className={styles1.courseInfo}>
                    <div className={styles1.courseName}>{courseData.title}</div>
                    <div className={styles1.courseName}>{courseData.courseCode}</div>
                </div>
            )}
            {/* 
            {applicants.length > 0 ? (
                <div className={styles1.applicantList}>
                    {applicants.map((applicant, index) => (
                        <div key={index} className={styles1.applicantBox}>
                            <div className={styles1.applicantDetails}>
                                <div className={styles1.applicantContainer}>
                                    <div className={styles1.biggerfont}>{candidateNames[applicant.candidateID] || "Loading..."}</div>
                                </div>
                                <div className={styles1.applicantInfo}>
                                    <p><strong>Previous Role:</strong> {applicant.previousRole}</p>
                                    <p><strong>Availability:</strong> {applicant.availability}</p>
                                    <p><strong>Skill Set:</strong> {applicant.skillSet}</p>
                                    <p><strong>Academic Credential:</strong> {applicant.academicCredential}</p>
                                </div>
                                <div>
                                    <label>
                                        <div className={styles1.selectedPreferences}>
                                            <input
                                                type="checkbox"
                                                onChange={() => handleCheckboxChange(applicant.candidateID)}
                                                checked={selectedApplicants.has(applicant.candidateID)}
                                            />Select
                                        </div>
                                    </label>
                                    {comments[index] && (
                                        <div className={styles1.comment}>
                                            <strong>Comment: </strong>
                                            <p>{comments[index]}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) :
                <p className={styles1.noApplicants}>No applicants found for this course.</p>
            } */}

            {applicants.length > 0 ? (
                <div className={styles1.applicantList}>
                    {applicants.map((applicant) => (
                        <div key={applicant.candidateID} className={styles1.applicantBox}>
                            <div className={styles1.applicantDetails}>
                                <div className={styles1.applicantContainer}>
                                    <div className={styles1.biggerfont}>
                                        {candidateNames[applicant.candidateID] || "Loading..."}
                                    </div>
                                </div>
                                <div className={styles1.applicantInfo}>
                                    <p><strong>Previous Role:</strong> {applicant.previousRole}</p>
                                    <p><strong>Availability:</strong> {applicant.availability}</p>
                                    <p><strong>Skill Set:</strong> {applicant.skillSet}</p>
                                    <p><strong>Academic Credential:</strong> {applicant.academicCredential}</p>
                                </div>
                                <div>
                                    <label className={styles1.selectedPreferences}>
                                        <input
                                            type="checkbox"
                                            onChange={() => handleCheckboxChange(applicant.candidateID)}
                                            checked={selectedApplicants.has(applicant.candidateID)}
                                        />
                                        Select
                                    </label>
                                    {(() => {
                                        const idx = getIndexFromCandidateId(applicant.candidateID);
                                        return idx !== null && comments[idx] ? (
                                            <div className={styles1.comment}>
                                                <strong>Comment: </strong>
                                                <p>{comments[idx]}</p>
                                            </div>
                                        ) : null;
                                    })()}

                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No applicants found.</p>
            )}

            <div className={styles1.buttonContainer}>
                {/* <button className={styles1.enterButton} onClick={() => router.back()}>
                    Back
                </button> */}
                <button className={styles1.enterButton} onClick={() => setIsModalOpen(true)}>
                    Enter
                </button>
            </div>

            {isModalOpen && (
                <div className={styles1.modal}>
                    <div className={styles1.modalContent}>

                        {Array.from(selectedApplicants).length > 0 ? (
                            <form onSubmit={(e) => { e.preventDefault(); handleSubmitPreferences(); }}>
                                <ul>
                                    {Array.from(selectedApplicants).map((username) => (

                                        <li key={username}>
                                            <div className={styles1.username}> Selected applicant: {candidateNames[username]}</div>

                                            {/* Preference Dropdown */}
                                            <label>
                                                Select Preference:
                                                <select
                                                    value={preferences[username] || ""}
                                                    onChange={(e) => handlePreferenceChange(username, parseInt(e.target.value))}
                                                >
                                                    {/* Validation rules: Each lecturer only can choose 1-10 applicants */}
                                                    {/* Inputting preference number for each applicants */}
                                                    <option value="">Select Preference</option>
                                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                                        <option key={num} value={num} disabled={usedPreferences.has(num)}>
                                                            {num}
                                                        </option>
                                                    ))}
                                                </select>
                                            </label>

                                            {/* Comment Text Area */}
                                            {/* Inputting text as comment for selected applicant*/}
                                            <label>
                                                Add Comment:
                                                <textarea
                                                    value={comments[username] || ""}
                                                    onFocus={() => {

                                                        setComments((prevComments) => ({
                                                            ...prevComments,
                                                            [username]: "",
                                                        }));
                                                    }}
                                                    onChange={(e) => handleCommentChange(username, e.target.value)}  // handle comment change
                                                    placeholder="Write your comment..."
                                                />
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                                <button type="submit">Submit Preferences</button>
                                <button onClick={handleModalClose}>Close</button>
                            </form>
                        ) : (
                            <div>
                                <p>No applicants selected.</p>
                                <button onClick={handleModalClose}>Close</button></div>

                        )}
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default Home;
