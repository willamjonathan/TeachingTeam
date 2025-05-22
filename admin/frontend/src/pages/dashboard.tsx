import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Header from "./components/header";
import Footer from "./components/footer";
import styles from "../styles/dashboard.module.css";  // Assuming you want to style it separately
import Image from "next/image";
import CandidatePict from "../images/candidate.jpg";
import LecturerPict from "../images/lecturer.jpg";
import CoursePict from "../images/course.jpg";
import ReportPict from "../images/report.jpg"



const Dashboard = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/");
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) return <p>Loading...</p>;

  const handleLecturerClick = () => {
    router.push('/lecturer');
  };
  const handleCourseClick = () => {
    router.push('/courses');
  };
  const handleCandidateClick = () => {
    router.push('/candidate');
  };
  const handleReportClick = () => {
    router.push('/report');
  };


  return (
    <div className={styles.body}>
      <Header />

      <div className={styles.content}>
        <div className={styles.welcome}>
          <h1>Welcome Admin!</h1>
          <p> You are logged in.</p>
        </div>

        <div className={styles.dashboardcontainer}>
          <div className={styles.dashboardcontainer1}>
            <div className={styles.dashboardcontainer2}>
              <div className={styles.dashboardpicture}>
                <Image
                  src={LecturerPict}
                  alt="Dashboard images"
                  className={styles.dashboardImage}
                />
              </div>
              <div className={styles.dashboardtext}>Explore the list of lecturer and assign them to the corrseponding course(s)!</div>
            </div>
            <div className={styles.dashboardbutton} onClick={handleLecturerClick}>
              ASSIGN LECTURER</div>
          </div>

          <div className={styles.dashboardcontainer1}>
            <div className={styles.dashboardcontainer2}>
              <div className={styles.dashboardpicture}>
                <Image
                  src={CoursePict}
                  alt="Dashboard images"
                  className={styles.dashboardImage}
                />
              </div>
              <div className={styles.dashboardtext}>Add/ Edit/ Delete course(s) according to your preference!</div>
            </div>
            <div className={styles.dashboardbutton} onClick={handleCourseClick}>
              EXPLORE COURSES</div>
          </div>

          <div className={styles.dashboardcontainer1}>
            <div className={styles.dashboardcontainer2}>
              <div className={styles.dashboardpicture}>
                <Image
                  src={CandidatePict}
                  alt="Dashboard images"
                  className={styles.dashboardImage}
                />
              </div>
              <div className={styles.dashboardtext}>Block or unblock potential candidates for tutor!</div>
            </div>
            <div className={styles.dashboardbutton} onClick={handleCandidateClick}>
              BLOCK/ UNBLOCK APPLICANTS</div>
          </div>

          <div className={styles.dashboardcontainer1}>
            <div className={styles.dashboardcontainer2}>
              <div className={styles.dashboardpicture}>
                <Image
                  src={ReportPict}
                  alt="Dashboard images"
                  className={styles.dashboardImage}
                />
              </div>
              <div className={styles.dashboardtext}>
                Generate summary reports for all activities within the system.
              </div>
            </div>
            <div className={styles.dashboardbutton} onClick={handleReportClick}>
              GENERATE REPORT
            </div>
          </div>

          {/* <button onClick={() => router.push("/lecturer")}>Go to Lecturer Page</button>
          <button onClick={() => router.push("/course")}>Go to Course Page</button>
          <button onClick={() => router.push("/applicant")}>Go to Applicant Page</button> */}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
