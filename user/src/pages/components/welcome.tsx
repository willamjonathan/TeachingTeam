import styles from "../../styles/components/welcome.module.css"; // Import CSS file for styling
import React from 'react';
import Image from "next/image"; 


interface WelcomeProps {
  username: string | null;
}
const Welcome= () => {
  return (
    <section className={styles.welcome}>
      <div className={styles.container}>
        {/* <div className={styles.title}>TeachingTeam</div> */}

        <div className={styles.subtitle}>Welcome to <a className={styles.title}>TeachingTeam</a>!</div>
        {/* {username ? `, ${username}` : ""} */}
        <div className={styles.welcomecontainer}>Choose your course!</div>

        <div className={styles.explore}>Explore Courses</div>
      </div></section>
  );
};

export default Welcome;
