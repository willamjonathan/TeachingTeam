import styles from "../../styles/components/footer.module.css";
import React from 'react';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <p>&copy; 2025 TeachingTeam. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
