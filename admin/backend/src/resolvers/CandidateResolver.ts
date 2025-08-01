import { Candidate } from "../entity/Candidate";
import { AppDataSource } from "../data-source";
import { GraphQLResolveInfo } from "graphql";

export const candidateResolvers = {
  Query: {
    // Fetch all candidates
    getCandidates: async () => {
      const candidateRepo = AppDataSource.getRepository(Candidate);
      return await candidateRepo.find();
    },

    // Fetch a single candidate by ID
    getCandidate: async (
      _: unknown,
      args: { id: number },
      __: unknown,
      ___: GraphQLResolveInfo
    ) => {
      const { id } = args;
      const candidateRepo = AppDataSource.getRepository(Candidate);
      const candidate = await candidateRepo.findOneBy({ id });

      if (!candidate) {
        throw new Error("Candidate not found");
      }

      return candidate;
    },
  },

  Mutation: {
    // Update candidate's is_Active status
    updateCandidateStatus: async (
      _: unknown,
      args: { id: number; is_Active: boolean }
    ) => {
      const { id, is_Active } = args;
      const candidateRepo = AppDataSource.getRepository(Candidate);

      const candidate = await candidateRepo.findOneBy({ id });
      if (!candidate) {
        throw new Error("Candidate not found");
      }

      candidate.is_Active = is_Active;
      await candidateRepo.save(candidate);

      return candidate;
    },
  },
};
