import React, { useState } from "react";
import axios from "axios";
import styles from "../styles/login.module.css";
import { useRouter } from "next/router";


interface GraphQLResponse {
  data: {
    login: string;
  };
  errors?: { message: string }[];
}

const LoginPage: React.FC = () => {
    const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post<GraphQLResponse>(
        "http://localhost:3006/graphql",
        {
          query: `
            mutation Login($username: String!, $password: String!) {
              login(username: $username, password: $password)
            }
          `,
          variables: { username, password },
        },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.errors) {
        setError(response.data.errors[0].message || "Login failed");
        return;
      }

      const token = response.data.data.login;
      alert("login successful");
      localStorage.setItem("token", token);
      router.push('/report');
    } catch (err: any) {
      console.log(err)
      console.error("Login failed:", err);
      setError("Network or server error");
    }
  };

  return (
    <div className={styles.body}>
    <div className={styles.container}>
      <h1 className={styles.title}>ADMIN</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="username" className={styles.label}>Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password" className={styles.label}>Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            required
          />
        </div>

        <button type="submit" className={styles.button}>Login</button>
      </form>

      {error && <p className={styles.error}>{error}</p>}
    </div>
    </div>
  );
};

export default LoginPage;
