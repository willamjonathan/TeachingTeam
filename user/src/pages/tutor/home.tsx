// import { useEffect, useState } from "react";
// import { useRouter } from "next/router";
// import Header from "../components/tutor-header";
// import Jumbotron from "../components/jumbotron";
// import Footer from "../components/footer";
// import Welcome from "../components/welcome";
// import styles from "../../styles/home.module.css";

// interface Course {
//     id: number;
//     title: string;
//     code: string;
// }

// const getCourses = async (): Promise<Course[]> => {
//     return [
//         { id: 1, title: "Artificial Intelligence", code: "COSC8888" },
//         { id: 2, title: "Data Structures", code: "COSC2222" },
//         { id: 3, title: "Cyber Security", code: "COSC3333" },
//         { id: 4, title: "Cloud Computing", code: "COSC4444" },
//         { id: 5, title: "Machine Learning", code: "COSC5555" },
//         { id: 6, title: "Software Engineering", code: "COSC6666" },
//     ];
// };

// const Home = () => {
//     const router = useRouter();
//     const [courses, setCourses] = useState<Course[]>([]);
//     const [isPopupOpen, setIsPopupOpen] = useState(false);
//     const [formData, setFormData] = useState({
//         previousRole: "",
//         availability: "part time",
//         skillSet: "",
//         academicCredential: "",
//     });
//     const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

//     useEffect(() => {
//         const isAuthenticated = localStorage.getItem("isAuthenticated");
//         if (!isAuthenticated) {
//             router.push("/login");
//         }

//         getCourses().then((data) => setCourses(data));
//     }, [router]);

//     //open pop up
//     const showPopup = (course: Course) => {
//         setSelectedCourse(course);
//         setIsPopupOpen(true);
//     };

//     // close
//     const closePopup = () => {
//         setIsPopupOpen(false);
//         setFormData({
//             previousRole: "",
//             availability: "part time",
//             skillSet: "",
//             academicCredential: "",
//         });
//         setSelectedCourse(null);
//     };

//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//         const { name, value } = e.target;
//         setFormData((prevData) => ({
//             ...prevData,
//             [name]: value,
//         }));
//     };

//     // for submit
//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         console.log("Saved input for course:", selectedCourse?.title, "Data:", formData);
//         closePopup();
//     };



//     return (
//         <div className={styles.body}>
//             <Header />
//             <Jumbotron />
//             <Welcome />

//             <div className={styles.courses}>Courses</div>

//             <div className={styles.homecontainer}>
//                 {courses.map((course) => (
//                     <div key={course.id} className={styles.box} onClick={() => showPopup(course)}>
//                         <div className={styles.picture}></div>
//                         <div className={styles.boxtextcontainer}>
//                             <div className={styles.coursetitle}>{course.title}</div>
//                             <div className={styles.coursecode}>{course.code}</div>
//                         </div>
//                     </div>
//                 ))}
//             </div>

//             <Footer />


//             {isPopupOpen && selectedCourse && (
//                 <div className={styles.popup}>
//                 <div className={styles.popupContent}>
//                     <div className={styles.closePopup} onClick={closePopup}>X</div>
//                     <div className={styles.popuptitle}>{selectedCourse.title}</div>
//                     <form onSubmit={handleSubmit}>
//                         <label htmlFor="previousRole">Previous Role</label>
//                         <input
//                             type="text"
//                             id="previousRole"
//                             name="previousRole"
//                             value={formData.previousRole}
//                             onChange={handleInputChange}
//                             placeholder="Enter your previous role"
//                         />
                        
//                         <label htmlFor="availability">Availability</label>
//                         <select
//                             id="availability"
//                             name="availability"
//                             value={formData.availability}
//                             onChange={handleInputChange}
//                         >
//                             <option value="part-time">Part-time</option>
//                             <option value="full-time">Full-time</option>
//                         </select>
            
//                         <label htmlFor="skills">Skills</label>
//                         <input
//                             type="text"
//                             id="skillSet"
//                             name="skillSet"
//                             value={formData.skillSet}
//                             onChange={handleInputChange}
//                             placeholder="Enter your skills"
//                         />
            
//                         <label htmlFor="academicCredential">Academic Credential</label>
//                         <input
//                             type="text"
//                             id="academicCredential"
//                             name="academicCredential"
//                             value={formData.academicCredential}
//                             onChange={handleInputChange}
//                             placeholder="Enter your academic credential"
//                         />
            
//                         <button type="submit">Submit</button>
//                     </form>
//                 </div>
//             </div>
            
//             )}
//         </div>
//     );
// };

// export default Home;
