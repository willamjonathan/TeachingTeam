import React, { useEffect, useState } from 'react';
import styles from '../../styles/profile.module.css';
import Footer from "../components/footer";
import Header from "../components/tutor-header";

interface Candidate {
  id: number;
  name: string;
  email: string;
  DOB: string;
  gender: string;
  DOJ: string;
  is_Active: boolean;
  // skillset?: string[]; // add if your backend includes this later
}

const Profile = () => {
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCandidate = async () => {
      const email = localStorage.getItem('Username');
      if (!email) {
        alert('No user logged in');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5001/api/candidate-id/${encodeURIComponent(email)}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch candidate details: ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Candidate data:", data);
        setCandidate(data);
      } catch (err) {
        alert('Error loading candidate profile');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidate();
  }, []);

  if (loading) return <div className={styles.body}><p className={styles.welcome}>Loading profile...</p></div>;

  if (!candidate) return <div className={styles.body}><p className={styles.welcome}>No candidate data found.</p></div>;

  return (
    <div className={styles.body}>
        <Header></Header>
      <div className={styles.content}>
        <div className={styles.welcome}>
         {candidate.name}</div>
        <div className={styles.profileContainer}>
          <div className={styles.details}>Details</div>
          <p><strong>Email:</strong> {candidate.email}</p>
          <p><strong>Date of Birth:</strong> {candidate.DOB}</p>
          <p><strong>Gender:</strong> {candidate.gender}</p>
          <p><strong>Date of Joining:</strong> {candidate.DOJ}</p>
          <p><strong>Status:</strong> {candidate.is_Active ? 'Active' : 'Inactive'}</p>
          {/* Uncomment if skillset added later */}
          {/* <p><strong>Skillset:</strong></p>
          {candidate.skillset && candidate.skillset.length > 0 ? (
            <ul>
              {candidate.skillset.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          ) : (
            <p>No skills listed.</p>
          )} */}
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default Profile;
