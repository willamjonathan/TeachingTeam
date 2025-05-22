// export interface Course {
//     id: number;
//     title: string;
//     code: string;
// }

// const defaultCourses: Course[] = [
//     { id: 1, title: "Artificial Intelligence", code: "COSC8888" },
//     { id: 2, title: "Data Structures", code: "COSC2222" },
//     { id: 3, title: "Cyber Security", code: "COSC3333" },
//     { id: 4, title: "Cloud Computing", code: "COSC4444" },
//     { id: 5, title: "Machine Learning", code: "COSC5555" },
//     { id: 6, title: "Software Engineering", code: "COSC6666" }
// ];

// export const getCourses = async (): Promise<Course[]> => {
//     const storedCourses = localStorage.getItem("courses");
//     if (storedCourses) {
//         return JSON.parse(storedCourses);
//     } else {
//         localStorage.setItem("courses", JSON.stringify(defaultCourses));
//         return defaultCourses;
//     }
// };
