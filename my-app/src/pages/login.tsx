import { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import styles from "../styles/Login.module.css";
import React from 'react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<'lecturer' | 'candidate'>('candidate'); // user type selector
  const router = useRouter();

  const isValidEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const isValidPassword = (password: string) => {
    return password.length >= 8 && /[A-Z]/.test(password);
  };

  const lecturerLogin = async (email: string, password: string) => {
    try {
      const response = await fetch('http://localhost:5001/api/lecturers/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Lecturer login failed: ${errorData.message || response.statusText}`);
        return false;
      }

      const data = await response.json();
      localStorage.setItem("Username", email);
      localStorage.setItem("isAuthenticated", 'lecturer');
      console.log("TESTTTT",data)
      if (data.lecturer?.id) {
        document.cookie = `lecturerID=${data.lecturer.id}; path=/; max-age=86400; ${process.env.NODE_ENV === 'production' ? 'secure;' : ''}`;
      }
      

      return true;
    } catch (error) {
      console.error('Lecturer login error:', error);
      alert('An error occurred during lecturer login. Please try again later.');
      return false;
    }
  };

  const candidateLogin = async (email: string, password: string) => {
    try {
      const response = await fetch('http://localhost:5001/api/candidates/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Candidate login failed: ${errorData.message || response.statusText}`);
        return false;
      }

      const data = await response.json();

      localStorage.setItem("Username", email);
      localStorage.setItem("isAuthenticated", 'true');

      if (data.user?.id) {
        document.cookie = `candidateID=${data.user.id}; path=/; max-age=86400; secure`;
      }

      return true;
    } catch (error) {
      console.error('Candidate login error:', error);
      alert('An error occurred during candidate login. Please try again later.');
      return false;
    }
  };



  const handleLogin = async () => {
    const normalizedUsername = username.toLowerCase().trim();

    // Validate email for both user types
    if (!isValidEmail(normalizedUsername)) {
      alert('Please enter a valid email address.');
      return;
    }

    if (!isValidPassword(password)) {
      alert('Password must be at least 8 characters long and contain at least one uppercase letter.');
      return;
    }
    document.cookie = "candidate=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie = "candidateID=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie = "lecturerID=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";

    let loginSuccess = false;
    if (userType === 'lecturer') {
      loginSuccess = await lecturerLogin(normalizedUsername, password);
    } else {
      loginSuccess = await candidateLogin(normalizedUsername, password);
    }


    if (loginSuccess) {
      alert('Login successful!');
      router.push('/');
    }
  };

  return (
    <div className={styles["login-page"]}>
      <div className={styles["company-name"]}>
        <h1>TeachingTeam</h1>
        <h2>The Right Tutors for the Right Courses.</h2>
      </div>

      <div className={styles["login-container"]}>
        <div className={styles["image-container"]}>
          <Image src="/logo.png" alt="Logo" width={200} height={200} />
        </div>

        <div className={styles["form-container"]}>

          {/* User type selector */}
          <select
            value={userType}
            onChange={(e) => setUserType(e.target.value as 'lecturer' | 'candidate')}
            className={styles["input-field"]}
          >
            <option value="candidate">Candidate</option>
            <option value="lecturer">Lecturer</option>
          </select>

          <input
            type="text"
            placeholder="Email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={styles["input-field"]}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles["input-field"]}
          />
          <button onClick={handleLogin} className={styles["login-button"]}>
            Login
          </button>
          <p className={styles["signup-text"]}>
            Don't have an account?{' '}
            <span onClick={() => router.push('/signup')} className={styles["signup-link"]}>
              Create an account
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
