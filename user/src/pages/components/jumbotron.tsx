import Image from "next/image"; 
import jumbotron from "../../images/jumbotron.avif";
import styles from "../../styles/components/jumbotron.module.css";
import React from 'react';

const Jumbotron = () => {
  return (
    <header className={styles.jumbotron}>
      <div className={styles.jumbotronContainer}>
        <Image
          src={jumbotron} 
          alt="Jumbotron Background"
          width={1200}  
          height={500}  
          className={styles.jumbotronImage}
        />
      </div>
    </header>
  );
};

export default Jumbotron;
