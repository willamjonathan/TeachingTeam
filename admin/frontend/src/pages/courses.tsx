import React, { useEffect, useState } from "react";
import axios from "axios";
import style from '../styles/courses.module.css';
import Header from "./components/header";
import Footer from "./components/footer";

interface Course {
  courseCode: string;
  title: string;
  description: string;
}

interface GetCoursesResponse {
  data: any;
  getCourses: Course[];
}

interface CourseMutationResponse {
  addCourse: Course;
  editCourse: Course;
}

interface AddCourseData {
  data: {
    addCourse: Course;
  };
}

interface EditCourseResponse {
  data: {
    editCourse: Course;
  };
}




const CoursePage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState("");
  const [newCourse, setNewCourse] = useState({
    courseCode: "",
    title: "",
    description: "",
  });

  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
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

        setCourses(courseResponse.data.data.getCourses || []);
      } catch (err: any) {
        console.error(err);
        const message = err?.response?.data?.errors?.[0]?.message || "Failed to fetch courses";
        setError(message);
      }
    };

    fetchCourses();
  }, []);

  const handleSubmit = async () => {
    // validation, all field must be filled first before submitting 
    if (!newCourse.courseCode || !newCourse.title || !newCourse.description) {
      setError("All fields are required.");
      return;
    }

    if (editingCourse) {
      await editCourse();
    } else {
      await addCourse();
    }
  };

  const addCourse = async () => {
    const existing = courses.find(
      (course) => course.courseCode.toLowerCase() === newCourse.courseCode.toLowerCase()
    );

    if (existing) {
      setError("Course code must be unique.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3006/graphql", {
        query: `
          mutation AddCourse($title: String!, $description: String!, $courseCode: String!) {
            addCourse(title: $title, description: $description, courseCode: $courseCode) {
              courseCode
              title
              description
            }
          }
        `,
        variables: {
          title: newCourse.title,
          description: newCourse.description,
          courseCode: newCourse.courseCode,
        },
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      // console.log('cek',response)
      // console.log(response.data)
      // const addedCourse = response.data.data.addCourse;
      // setCourses([...courses, addedCourse]);
      // setNewCourse({ courseCode: "", title: "", description: "" });
      // setError("");
      // window.alert("Course added successfully!");
      const typedResponse = response as { data: AddCourseData };

      const addedCourse = typedResponse.data.data.addCourse;
      setCourses([...courses, addedCourse]);
      setNewCourse({ courseCode: "", title: "", description: "" });
      setError("");
      window.alert("Course added successfully!");

    } catch (err: any) {
      console.error(err);
      const message = err?.response?.data?.errors?.[0]?.message || "Failed to add course";
      setError(message);
    }
  };
  const editCourse = async () => {
    if (editingCourse) {
      try {
        // Ensure you use newCourse (from input) values in mutation
        const response = await axios.post("http://localhost:3006/graphql", {
          query: `
            mutation EditCourse($courseCode: String!, $title: String!, $description: String!) {
              editCourse(courseCode: $courseCode, title: $title, description: $description) {
                courseCode
                title
                description
              }
            }
          `,
          variables: {
            courseCode: newCourse.courseCode, // use newCourse state
            title: newCourse.title,
            description: newCourse.description,
          },
        }, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        // console.log("TESTT")
        // const updatedCourse = response.data.data.editCourse;
        // console.log(updatedCourse)
        // // Update courses state with the edited course
        // setCourses(courses.map(course =>
        //   course.courseCode === updatedCourse.courseCode ? updatedCourse : course
        // ));

        // // Clear the form after update
        // setEditingCourse(null);
        // setNewCourse({ courseCode: "", title: "", description: "" });
        // setError("");
        // window.alert("Course updated successfully!");
        console.log("TESTT");

        // Safely cast the response to the expected structure
        const typedResponse = response as { data: EditCourseResponse };

        const updatedCourse = typedResponse.data.data.editCourse;
        console.log(updatedCourse);

        // Update courses state with the edited course
        setCourses(courses.map(course =>
          course.courseCode === updatedCourse.courseCode ? updatedCourse : course
        ));

        // Clear the form after update
        setEditingCourse(null);
        setNewCourse({ courseCode: "", title: "", description: "" });
        setError("");
        window.alert("Course updated successfully!");


      } catch (err: any) {
        console.error(err);
        const message = err?.response?.data?.errors?.[0]?.message || "Failed to edit course";
        setError(message);
      }
    }
  };

  const deleteCourse = async (courseCode: string) => {
    try {
      await axios.post("http://localhost:3006/graphql", {
        query: `
          mutation {
            deleteCourse(courseCode: "${courseCode}")
          }
        `,
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      setCourses(courses.filter(course => course.courseCode !== courseCode));
      setError("");
      window.alert("Course deleted successfully!");

    } catch (err: any) {
      console.error(err);
      const message = err?.response?.data?.errors?.[0]?.message || "Failed to delete course";
      setError(message);
    }
  };

  const cancelEdit = () => {
    setEditingCourse(null);
    setNewCourse({ courseCode: "", title: "", description: "" });
    setError("");
  };

  return (
    <div className={style.body}>
      <Header />
      <div className={style.container}>
        <div className={style.title}>Courses</div>

        <div className={style.courseForm}>
          {/* Show courseCode input only when not editing */}
          {!editingCourse && (
            <input
              type="text"
              placeholder="Course Code"
              value={newCourse.courseCode}
              onChange={(e) => setNewCourse({ ...newCourse, courseCode: e.target.value })}
            />
          )}
          <input
            type="text"
            placeholder="Title"
            value={newCourse.title}
            onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
          />
          <input
            type="text"
            placeholder="Description"
            value={newCourse.description}
            onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
          />

          <button onClick={handleSubmit}>
            {editingCourse ? "Save Changes" : "New Course"}
          </button>

          {editingCourse && (
            <button onClick={cancelEdit} className={style.cancelButton}>
              Cancel
            </button>
          )}

          {error && <div className={style.error}>{error}</div>}
        </div>

        <div className={style.courseList}>
          {(courses || []).map((course) => (
            <div key={course.courseCode} className={style.courseBox}>
              <p>Course Code: {course.courseCode}</p>
              <p>Title: {course.title}</p>
              <p>Description: {course.description}</p>

              <div className={style.courseEditDelete}>
                <button onClick={() => {
                  setEditingCourse(course);
                  setNewCourse(course);
                }}>
                  Edit
                </button>

                <button onClick={() => deleteCourse(course.courseCode)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CoursePage;
