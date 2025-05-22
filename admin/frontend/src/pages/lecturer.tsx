import React, { useEffect, useState } from "react";
import axios from "axios";
import style from "../styles/lecturer.module.css";
import Header from "./components/header";
import Footer from "./components/footer";

interface Lecturer {
    id: number;
    name: string;
    department: string;
    email: string;
}

interface Course {
    courseCode: string;
    title: string;
    description: string;
}

interface TaughtCourse {
    lecturer: Lecturer;
    course: Course;
}

// Define the GraphQL response interfaces
interface GetLecturersResponse {
    data: any;
    getLecturers: Lecturer[];
}

interface GetCoursesResponse {
    data: any;
    getCourses: Course[];
}

interface GetTaughtCoursesResponse {
    data: any;
    getTaughtCourses: TaughtCourse[];
}

interface DeleteTaughtCourseResponse {
    data: {
        deleteTaughtCourse: {
            message: string;
        };
    };
}

const LecturerList: React.FC = () => {
    const [lecturers, setLecturers] = useState<Lecturer[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [taughtCourses, setTaughtCourses] = useState<TaughtCourse[]>([]);
    const [error, setError] = useState("");
    const [lecturerSearchQuery, setLecturerSearchQuery] = useState<string>("");
    const [courseSearchQuery, setCourseSearchQuery] = useState<string>("");
    const [taughtCourseSearchQuery, setTaughtCourseSearchQuery] = useState<string>(""); // New state for taught course search
    const [selectedLecturerId, setSelectedLecturerId] = useState<number | null>(null);
    const [selectedCourseCode, setSelectedCourseCode] = useState<string | null>(null);

    useEffect(() => {
        const fetchLecturersAndCourses = async () => {
            try {
                // Fetch lecturers
                const lecturerResponse = await axios.post<GetLecturersResponse>(
                    "http://localhost:3006/graphql",
                    {
                        query: `
              query {
                getLecturers {
                  id
                  name
                  department
                  email
                }
              }
            `,
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                setLecturers(lecturerResponse.data.data.getLecturers || []); // Ensure it's always an array

                // Fetch courses
                const courseResponse = await axios.post<GetCoursesResponse>(
                    "http://localhost:3006/graphql",
                    {
                        query: `
              query {
                getCourses {
                  courseCode
                  title
                  description
                }
              }
            `,
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                setCourses(courseResponse.data.data.getCourses || []); // Ensure it's always an array

                // Fetch taught courses
                const taughtCourseResponse = await axios.post<GetTaughtCoursesResponse>(
                    "http://localhost:3006/graphql",
                    {
                        query: `
              query {
                getTaughtCourses {
                  lecturer {
                    id
                    name
                  }
                  course {
                    courseCode
                    title
                  }
                }
              }
            `,
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                setTaughtCourses(taughtCourseResponse.data.data.getTaughtCourses || []); // Ensure it's always an array

            } catch (err) {
                console.error(err);
                setError("Failed to fetch lecturers, courses, and taught courses");
            }
        };

        fetchLecturersAndCourses();
    }, []);

    // Function to filter lecturers based on search query
    const filterLecturers = () => {
        return lecturers.filter(
            (lecturer) =>
                lecturer.id.toString().includes(lecturerSearchQuery) ||
                lecturer.name.toLowerCase().includes(lecturerSearchQuery.toLowerCase())
        );
    };

    // Function to filter courses based on search query
    const filterCourses = () => {
        return courses.filter(
            (course) =>
                course.courseCode.toLowerCase().includes(courseSearchQuery.toLowerCase()) ||
                course.title.toLowerCase().includes(courseSearchQuery.toLowerCase())
        );
    };

    // Function to filter taught courses based on search query
    const filterTaughtCourses = () => {
        return taughtCourses.filter(
            (taughtCourse) =>
                taughtCourse.lecturer.name.toLowerCase().includes(taughtCourseSearchQuery.toLowerCase()) ||
                taughtCourse.course.title.toLowerCase().includes(taughtCourseSearchQuery.toLowerCase())
        );
    };

    const handleAssignTaughtCourse = async () => {
        // validation to check if the lecture and coursecode is selected first
        if (selectedLecturerId && selectedCourseCode) {
            // validation to check if the lecturer is already assigned to the course
            
            const isAlreadyAssigned = taughtCourses.some(
                (taughtCourse) =>
                    String(taughtCourse.lecturer.id) === String(selectedLecturerId) &&
                    taughtCourse.course.courseCode === selectedCourseCode        
            );
            console.log(taughtCourses)
            console.log('lect',selectedLecturerId)
            console.log('course',selectedCourseCode)
            console.log("TEST",isAlreadyAssigned)
            // return none the function if already assigned
            if (isAlreadyAssigned) {
                setError("Error: This lecturer is already assigned to this course.");
                return; 
            }
    
            try {
                const response = await axios.post("http://localhost:3006/graphql", {
                    query: `
                    mutation {
                      addTaughtCourse(lecturerId: ${selectedLecturerId}, courseCode: "${selectedCourseCode}") {
                        lecturer {
                          id
                          name
                        }
                        course {
                          courseCode
                          title
                        }
                      }
                    }
                  `,
                }, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
    
                console.log(response.data); 
                // Fetch updated taught courses
                const taughtCourseResponse = await axios.post<GetTaughtCoursesResponse>(
                    "http://localhost:3006/graphql",
                    {
                        query: `
                      query {
                        getTaughtCourses {
                          lecturer {
                            id
                            name
                          }
                          course {
                            courseCode
                            title
                          }
                        }
                      }
                    `,
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
    
                setTaughtCourses(taughtCourseResponse.data.data.getTaughtCourses || []); // Update taught courses
                setError(""); // Clear any previous error message
                alert("Lecturer assigned to course successfully!");

            } catch (err) {
                console.error(err);
                setError("Failed to assign taught course");
            }
        }
    };
    

    const handleDeleteTaughtCourse = async (lecturerId: number, courseCode: string) => {
        try {
            // Perform the delete mutation
            const deleteResponse = await axios.post<DeleteTaughtCourseResponse>(
                "http://localhost:3006/graphql",
                {
                    query: `
                        mutation {
                            deleteTaughtCourse(lecturerId: ${lecturerId}, courseCode: "${courseCode}") {
                                message
                            }
                        }
                    `,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
    
            console.log(deleteResponse.data); // Log the response to check if the mutation was successful
            
            // Check if the response contains a success message
            if (deleteResponse.data.data.deleteTaughtCourse.message === 'Taught course deleted successfully') {
                // Fetch updated taught courses after successful deletion
                const taughtCourseResponse = await axios.post<GetTaughtCoursesResponse>(
                    "http://localhost:3006/graphql",
                    {
                        query: `
                            query {
                                getTaughtCourses {
                                    lecturer {
                                        id
                                        name
                                    }
                                    course {
                                        courseCode
                                        title
                                    }
                                }
                            }
                        `,
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
    
                // Update the state with the new list of taught courses
                setError("");
                setTaughtCourses(taughtCourseResponse.data.data.getTaughtCourses || []);
            }
        } catch (err) {
            console.error(err);
            setError("Failed to delete taught course");
        }
    };
    

    return (
        <div className={style.body}>
            <Header></Header>
            <div className={style.containerLecturerPage}>
                <div className={style.title}>Lecturers, Courses, and Taught Courses</div>
                {error && <p style={{ color: "red" }}>{error}</p>}

                {/* Assign Taught Course */}
                <div className={style.containerAssign}>
                    <div className={style.containerAssignTitle}>Assign Lecturer to Course</div>
                    <div className={style.containerAssign2}>
                        <select
                            value={selectedLecturerId || ""}
                            onChange={(e) => setSelectedLecturerId(Number(e.target.value))}
                        >
                            <option value="">Select Lecturer</option>
                            {lecturers.map((lecturer) => (
                                <option key={lecturer.id} value={lecturer.id}>
                                    {lecturer.name}
                                </option>
                            ))}
                        </select>

                        <select
                            value={selectedCourseCode || ""}
                            onChange={(e) => setSelectedCourseCode(e.target.value)}
                        >
                            <option value="">Select Course</option>
                            {courses.map((course) => (
                                <option key={course.courseCode} value={course.courseCode}>
                                    {course.title}
                                </option>
                            ))}
                        </select>

                        <button onClick={handleAssignTaughtCourse}>Assign</button>
                    </div>
                </div>

                <div className={style.containerInfo}>
                    {/* Taught Courses List */}
                    <div className={style.containerTaughtCourse}>
                        <h2>Taught Courses</h2>
                        <div>
                            {/* Taught Course Search Bar */}
                            <input
                                type="text"
                                placeholder="Search Taught Courses by Lecturer or Course Title"
                                value={taughtCourseSearchQuery}
                                onChange={(e) => setTaughtCourseSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className={style.taughtCourseList}>
                            {filterTaughtCourses().map((taughtCourse) => (
                                <div key={`${taughtCourse.lecturer.id}-${taughtCourse.course.courseCode}`} className={style.taughtCourseBox}>
                                    <p>Lecturer: {taughtCourse.lecturer.name}</p>
                                    <p>Course: {taughtCourse.course.title}</p>
                                    <button
                                        onClick={() => handleDeleteTaughtCourse(taughtCourse.lecturer.id, taughtCourse.course.courseCode)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={style.containerInfo2}>
                    {/* Lecturer Search Bar */}
                    <div className={style.containerLecturerList}>
                        <div>
                            <input
                                type="text"
                                placeholder="Search Lecturers by ID or Name"
                                value={lecturerSearchQuery}
                                onChange={(e) => setLecturerSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Lecturer List */}
                        <h2>Lecturers</h2>
                        <div className={style.lecturerCourseList}>
                            {filterLecturers().map((lecturer) => (
                                <div key={lecturer.id} className={style.lecturerCourseBox}>
                                    <p>Name: {lecturer.name}</p>
                                    <p>Department: {lecturer.department}</p>
                                    <p>Email: {lecturer.email}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Course Search Bar */}
                    <div className={style.containerCourseList}>
                        <div>
                            <input
                                type="text"
                                placeholder="Search Courses by Code or Title"
                                value={courseSearchQuery}
                                onChange={(e) => setCourseSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Course List */}
                        <h2>Courses</h2>
                        <div className={style.lecturerCourseList}>
                            {filterCourses().map((course) => (
                                <div key={course.courseCode} className={style.lecturerCourseBox}>
                                    <p>Course Code: {course.courseCode}</p>
                                    <p>Title: {course.title}</p>
                                    <p>Description: {course.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div></div>

            </div>
            <Footer></Footer>
        </div>
    );
};

export default LecturerList;
