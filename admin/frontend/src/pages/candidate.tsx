import { useEffect, useState } from "react";
import axios from "axios";
import Header from "./components/header";
import Footer from "./components/footer";
import styles from "../styles/candidate.module.css";

interface Candidate {
  id: number;
  name: string;
  email: string;
  is_Active: boolean;
}

interface GetCandidatesResponse {
  data: {
    getCandidates: Candidate[];
  };
}

interface UpdateCandidateResponse {
  data: {
    updateCandidateStatus: Candidate;
  };
}

const CandidatePage = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await axios.post<GetCandidatesResponse>(
          "http://localhost:3006/graphql",
          {
            query: `
              query {
                getCandidates {
                  id
                  name
                  email
                  is_Active
                }
              }
            `,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        setCandidates(response.data.data.getCandidates || []);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch candidates.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  const updateCandidateStatus = async (id: number, isActive: boolean) => {
    try {
      const response = await axios.post<UpdateCandidateResponse>(
        "http://localhost:3006/graphql",
        {
          query: `
            mutation {
              updateCandidateStatus(id: ${id}, is_Active: ${isActive}) {
                id
                name
                email
                is_Active
              }
            }
          `,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const updatedCandidate = response.data.data.updateCandidateStatus;

      setCandidates((prevCandidates) =>
        prevCandidates.map((candidate) =>
          candidate.id === updatedCandidate.id
            ? { ...candidate, is_Active: updatedCandidate.is_Active }
            : candidate
        )
      );
    } catch (err) {
      console.error(err);
      setError("Failed to update candidate status.");
    }
  };

  // Filter candidates by name (case-insensitive)
  const filteredCandidates = candidates.filter((candidate) =>
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.body}>
      <Header />
      <div className={styles.containerCandidate}>
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <div className={styles.containerCandidate2}>
            <div className={styles.title}>Candidate List</div>

            {/* Search input */}
            <input
              type="text"
              placeholder="Search by name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />

            <div className={styles.candidateList}>
              <ul>
                {filteredCandidates.length > 0 ? (
                  filteredCandidates.map((candidate) => (
                    <li key={candidate.id}>
                      <div className={styles.candidateBox}>
                        <div className={styles.candidateBox2}>

                          <p>{candidate.name}- {" "}{candidate.is_Active ? "Active" : "Inactive"}</p>
                          {candidate.email}
                        </div>
                        <div className={styles.candidateBox3}>
                          <button
                            onClick={() =>
                              updateCandidateStatus(candidate.id, !candidate.is_Active)
                            }
                          >
                            {candidate.is_Active ? "Deactivate" : "Activate"}

                          </button>
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <p>No candidates found.</p>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CandidatePage;
