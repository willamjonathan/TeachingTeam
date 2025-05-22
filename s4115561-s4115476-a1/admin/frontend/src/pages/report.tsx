import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/report.module.css";
import Header from "./components/header";
import Footer from "./components/footer";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';


interface Candidate {
  id: string;
  name: string;
  count?: number;
}

interface GraphQLResponse {
  data: {
    getCandidatesPerCourse?: {
      courseCode: string;
      candidates: Candidate[];
    }[];
    getCandidatesMoreThan3Courses?: Candidate[];
    getCandidatesNotChosen?: Candidate[];
  };
  errors?: { message: string }[];
}

const ReportPage: React.FC = () => {
  const [candidatesPerCourse, setCandidatesPerCourse] = useState<
    { courseCode: string; candidates: Candidate[] }[]
  >([]);
  const [candidatesMoreThan3Courses, setCandidatesMoreThan3Courses] = useState<Candidate[]>([]);
  const [candidatesNotChosen, setCandidatesNotChosen] = useState<Candidate[]>([]);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post<GraphQLResponse>(
          "http://localhost:3006/graphql",
          {
            query: `
              query {
                getCandidatesPerCourse {
                  courseCode
                  candidates {
                    id
                    name
                    count
                  }
                }
                getCandidatesMoreThan3Courses {
                  id
                  name
                }
                getCandidatesNotChosen {
                  id
                  name
                }
              }
            `,
            variables: {},
          },
          { headers: { "Content-Type": "application/json" } }
        );

        if (response.data.errors) {
          setError(response.data.errors[0].message || "Failed to load data");
          return;
        }

        setCandidatesPerCourse(response.data.data.getCandidatesPerCourse || []);
        setCandidatesMoreThan3Courses(response.data.data.getCandidatesMoreThan3Courses || []);
        setCandidatesNotChosen(response.data.data.getCandidatesNotChosen || []);
      } catch (err: any) {
        console.error("Error fetching data", err);
        setError("Network or server error");
      }
    };

    fetchData();
  }, []);

  const courseDistributionData = candidatesPerCourse.map(course => ({
    name: course.courseCode,
    value: course.candidates.length,
  }));

  const moreThan3Count = candidatesMoreThan3Courses.length;
  const notChosenCount = candidatesNotChosen.length;

  const statusData = [
    { name: 'More Than 3 Courses', value: moreThan3Count },
    { name: 'Not Chosen', value: notChosenCount },
  ];

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#0088FE'];


  return (
    <div className={styles.body}>
      <Header />

      <div className={styles.container}>
        <h1 className={styles.title}>Report: Candidate Overview</h1>
        <div className={styles.section}>
          {/* BAR */}
          <div className={styles.visualizationContainer}>
          <h2 className={styles.sectionTitle}>REPORT VISUALIZATION</h2>

          <div className={styles.section}>
  <h2 className={styles.sectionTitle}>Distribution of Candidates per Course</h2>
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie
        data={courseDistributionData}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={100}
        label
      >
        {courseDistributionData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  </ResponsiveContainer>
  </div>

  <div className={styles.section}>
    <h2 className={styles.sectionTitle}>Candidate Preferences per Course</h2>
    {candidatesPerCourse.map((course, i) => {
      const data = course.candidates.map(c => ({
        name: c.name,
        Preferences: c.count || 0,
      }));
      return (
        <div key={course.courseCode} style={{ marginBottom: 40 }}>
          <h3>{course.courseCode}</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Preferences" fill={COLORS[i % COLORS.length]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      );
    })}
  </div>

  <div className={styles.section}>
    <h2 className={styles.sectionTitle}>Candidate Status Overview</h2>
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={statusData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label
        >
          {statusData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </div>
</div>


        </div>

        <input
          type="text"
          placeholder="Search by candidate name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
          className={styles.searchInput}
        />

        {error && <p className={styles.error}>{error}</p>}



        {/* Candidates per Course */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Candidates per Course</h2>

          <div className={styles.section2}>
            {candidatesPerCourse.length ? (
              candidatesPerCourse.map(({ courseCode, candidates }) => {
                const filteredCandidates = candidates.filter((c) =>
                  c.name.toLowerCase().includes(searchTerm)
                );
                return (
                  <div key={courseCode} className={styles.courseSection}>
                    <h3>{courseCode}</h3>
                    {filteredCandidates.length ? (
                      <ul>
                        {filteredCandidates.map(({ id, name, count }) => (
                          <li key={id}>
                            {name} - {count} preferences
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No matching candidates</p>
                    )}
                  </div>
                );
              })
            ) : (
              <p>No data available</p>
            )}
          </div>
        </div>

        {/* Candidates with More Than 3 Courses */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Candidates with More Than 3 Courses</h2>
          <div className={styles.courseSection}>
            {candidatesMoreThan3Courses.length ? (
              <ul>
                {candidatesMoreThan3Courses
                  .filter(({ name }) => name.toLowerCase().includes(searchTerm))
                  .map(({ id, name }) => (
                    <li key={id}>{name}</li>
                  ))}
              </ul>
            ) : (
              <p>No candidates with more than 3 courses</p>
            )}
          </div>
        </div>

        {/* Candidates Not Chosen */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Candidates Not Chosen</h2>
          <div className={styles.courseSection}>
            {candidatesNotChosen.length ? (
              <ul>
                {candidatesNotChosen
                  .filter(({ name }) => name.toLowerCase().includes(searchTerm))
                  .map(({ id, name }) => (
                    <li key={id}>{name}</li>
                  ))}
              </ul>
            ) : (
              <p>No candidates found who haven't been chosen</p>
            )}
          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
};

export default ReportPage;
