import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../../styles/components/header.module.css"
import React from 'react';

const Header = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.setItem("isAuthenticated", "false");
    router.push("/login");
  };

  return (
    <header className={styles.header} >
      <div className={styles.container}>
        <Link href="/lecture/home" >Home</Link>
        <button onClick={handleLogout} className={styles.logoutButton}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
