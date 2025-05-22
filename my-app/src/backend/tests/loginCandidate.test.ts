import { Request, Response } from "express";
import { AppDataSource } from "../data-source"; // Adjust path to your data source
import { Candidate } from "../entity/Candidate"; // Import your entity here
import { loginCandidate } from "../controller/userController"; // Adjust path

describe("loginCandidate", () => {
  // Mock response object
  let res: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn(() => ({ json: jsonMock } as any));

    res = {
      status: statusMock,
      json: jsonMock,
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should return 400 if candidate email not found", async () => {
    // Mock request
    const req = {
      body: {
        email: "nonexistent@example.com",
        password: "password123",
      },
    } as Request;

    // Mock repository to return null (no candidate found)
    jest.spyOn(AppDataSource, "getRepository").mockReturnValue({
      findOne: jest.fn().mockResolvedValue(null),
    } as any);

    await loginCandidate(req, res as Response);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({ message: "Email not found" });
  });

  it("should return 410 if password is incorrect", async () => {
    const req = {
      body: {
        email: "test@example.com",
        password: "wrongpassword",
      },
    } as Request;

    // Mock candidate data with correct password
    const candidate: Candidate = {
      id: 1,
      email: "test@example.com",
      name: "Test User",
      password: "correctpassword",
      DOB: "2000-01-01",
      gender: "male",
      DOJ: "2020-01-01",
      is_Active: true,
      preferences: [],
    };

    jest.spyOn(AppDataSource, "getRepository").mockReturnValue({
      findOne: jest.fn().mockResolvedValue(candidate),
    } as any);

    await loginCandidate(req, res as Response);

    expect(statusMock).toHaveBeenCalledWith(410);
    expect(jsonMock).toHaveBeenCalledWith({ message: "Incorrect password" });
  });

  it("should return 420 if candidate is banned (is_Active is false)", async () => {
    const req = {
      body: {
        email: "banned@example.com",
        password: "password123",
      },
    } as Request;

    // Candidate with is_Active = false (banned)
    const candidate: Candidate = {
      id: 2,
      email: "banned@example.com",
      name: "Banned User",
      password: "password123",
      DOB: "1990-01-01",
      gender: "female",
      DOJ: "2019-01-01",
      is_Active: false,
      preferences: [],
    };

    jest.spyOn(AppDataSource, "getRepository").mockReturnValue({
      findOne: jest.fn().mockResolvedValue(candidate),
    } as any);

    await loginCandidate(req, res as Response);

    expect(statusMock).toHaveBeenCalledWith(420);
    expect(jsonMock).toHaveBeenCalledWith({ message: "Candidate is banned" });
  });

  it("should return 200 and user info if login is successful", async () => {
    const req = {
      body: {
        email: "active@example.com",
        password: "password123",
      },
    } as Request;

    const candidate: Candidate = {
      id: 3,
      email: "active@example.com",
      name: "Active User",
      password: "password123",
      DOB: "1985-05-05",
      gender: "other",
      DOJ: "2018-06-06",
      is_Active: true,
      preferences: [],
    };

    jest.spyOn(AppDataSource, "getRepository").mockReturnValue({
      findOne: jest.fn().mockResolvedValue(candidate),
    } as any);

    await loginCandidate(req, res as Response);

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      message: "Login successful",
      user: {
        id: candidate.id,
        name: candidate.name,
        email: candidate.email,
        DOB: candidate.DOB,
        gender: candidate.gender,
        DOJ: candidate.DOJ,
        is_Active: candidate.is_Active,
      },
    });
  });

  it("should return 500 if there is an unexpected error", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {}); // suppress console.error
    const req = {
      body: {
        email: "error@example.com",
        password: "password123",
      },
    } as Request;

    // Mock findOne to throw error
    jest.spyOn(AppDataSource, "getRepository").mockReturnValue({
      findOne: jest.fn().mockRejectedValue(new Error("DB error")),
    } as any);

    await loginCandidate(req, res as Response);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      message: "Internal server error",
    });
  });
});
