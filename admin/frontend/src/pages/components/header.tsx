// components/Header.tsx
import { useRouter } from "next/router";
import Link from "next/link";
import styles from "../../styles/components/header.module.css";
import React from "react";

const Header: React.FC = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/dashboard">Dashboard</Link>
        <span className={styles.logoutButton} onClick={handleLogout}>
          Logout
        </span>
      </div>
    </header>
  );
};

export default Header;
