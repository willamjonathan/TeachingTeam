import styles from "../../styles/components/welcome.module.css"; // Import CSS file for styling
import React from 'react';
import welcomPict from '../../images/profile.png'
import Image from "next/image"; 




interface WelcomeProps {
  username: string | null;
}
const Welcome: React.FC<WelcomeProps>= ({ username }) => {
  return (
    <section className={styles.welcome}>
      <div className={styles.container}>
        {/* <div className={styles.title}>TeachingTeam</div> */}

        <div className={styles.subtitle}><a className={styles.title}>TeachingTeam</a></div>

        <div className={styles.welcometext}>Welcome {username ? ` ${username}` : ""} !</div>
        
        {/* <div className={styles.welcomecontainer2}>
          <div className={styles.welcomepicture}><Image
          src={welcomPict} 
          alt="Jumbotron Background"
          width={50}  
          height={30}  
          // className={styles.}
        /></div>
        <div className={styles.welcomeuser}>{username ? ` ${username}` : ""}</div>
        
        
        </div> */}

        <div className={styles.explore}>Explore Courses</div>
      </div></section>
  );
};

export default Welcome;
