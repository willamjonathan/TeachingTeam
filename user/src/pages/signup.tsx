import { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import styles from "../styles/Signup.module.css";
import React from 'react';

const Signup = () => {
  const [role, setRole] = useState<'candidate' | 'lecturer'>('candidate');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');        
  const [gender, setGender] = useState('');   

  const router = useRouter();

  // Email validation function
  const isValidEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  // Password validation function: min 8 chars, at least one uppercase letter
  const isValidPassword = (password: string) => {
    return password.length >= 8 && /[A-Z]/.test(password);
  };

  const handleSignup = async () => {
    if (role === "candidate") {
      await handleSignupCandidate();
    } else if (role === "lecturer") {
      await handleSignupLecturer();
    }
  };
  
  const handleSignupCandidate = async () => {
    const normalizedEmail = email.toLowerCase();

    if (!isValidEmail(normalizedEmail)) {
      alert('Please enter a valid email address.');
      return;
    }

    if (!isValidPassword(password)) {
      alert('Password must be at least 8 characters long and contain at least one uppercase letter.');
      return;
    }

    if (!dob) {
      alert('Please enter your date of birth.');
      return;
    }

    if (!gender) {
      alert('Please select your gender.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/api/candidates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: normalizedEmail,
          password,
          DOB: dob,
          gender,
          DOJ: new Date().toISOString(), // Automatically send current date/time as DOJ
          is_Active: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();

        if (response.status === 400 && errorData.message === "Email is already") {
          alert('Email is already registered. Please try logging in.');
        } else {
          alert(`Signup failed: ${errorData.message || response.statusText}`);
        }
        return;
      }

      await response.json();
      alert('Account created successfully!');
      router.push('/login');
    } catch (error) {
      console.error('Signup error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  const handleSignupLecturer = async () => {
    const normalizedEmail = email.toLowerCase();
    
    if (!isValidEmail(normalizedEmail)) {
      alert('Please enter a valid email address.');
      return;
    }

    if (!isValidPassword(password)) {
      alert('Password must be at least 8 characters long and contain at least one uppercase letter.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/api/lecturers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: normalizedEmail,
          password: password,
          department: "ComputerScience"
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();

        if (response.status === 400 && errorData.message === "Email is already in use") {
          alert('Email is already registered. Please try logging in.');
        } else {
          alert(`Signup failed: ${errorData.message || response.statusText}`);
        }
        return;
      }

      await response.json();
      alert('Account created successfully!');
      router.push('/login');
    } catch (error) {
      console.error('Signup error:', error);
      alert('An error occurred. Please try again later.');
    }
  }

  return (
    <div className={styles["signup-page"]}>
      <div className={styles["company-name"]}>
        <h1>TeachingTeam</h1>
        <h2>The Right Tutors for the Right Courses.</h2>
      </div>

      <div className={styles["signup-container"]}>
        <div className={styles["image-container"]}>
          <Image
            src="/logo.png"
            alt="Logo"
            width={200}
            height={200}
          />
        </div>
        <div className={styles["form-container"]}>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as 'candidate' | 'lecturer')}
            className={styles["input-field"]}
          >
            <option value="candidate">Candidate</option>
            <option value="lecturer">Lecturer</option>
          </select>

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles["input-field"]}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles["input-field"]}
          />
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles["input-field"]}
          />

          {/* New input for DOB */}
          <input
            type="date"
            placeholder="Date of Birth"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className={styles["input-field"]}
          />

          {/* New select for gender */}
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className={styles["input-field"]}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

          <button onClick={handleSignup} className={styles["signup-button"]}>
            Sign Up
          </button>
          <p className={styles["login-text"]}>
            Already have an account?{' '}
            <span onClick={() => router.push('/login')} className={styles["login-link"]}>
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
