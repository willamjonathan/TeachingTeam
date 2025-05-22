import { getApplicantsByCourseCodeFromAppliedForm } from '../controller/candidate';
import { AppDataSource } from '../data-source';
import { AppliedForm } from '../entity/appliedForm';
import { Request, Response } from 'express';

// Mock the AppDataSource to avoid real database calls
jest.mock('../data-source', () => ({
  AppDataSource: {
    getRepository: jest.fn(),
  },
}));

describe('getApplicantsByCourseCodeFromAppliedForm', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;
  let findMock: jest.Mock;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Mock the Express response methods status and json
    jsonMock = jest.fn();
    statusMock = jest.fn(() => ({ json: jsonMock })) as any;

    res = {
      status: statusMock,
      json: jsonMock,
    };

    // Mock repository find method
    findMock = jest.fn();

    // Mock the getRepository method to return an object with findMock method
    (AppDataSource.getRepository as jest.Mock).mockReturnValue({
      find: findMock,
    });
  });

  // Test case: Successful retrieval of applicants by course code
  it('should return applicants with status 200 if found', async () => {
    // Arrange: Define mock data to simulate applicants in the database
    const mockApplicants: AppliedForm[] = [
      {
        candidateID: 1,
        courseID: 'CSE101',
        position: 'Developer',
        previousRole: 'Intern',
        availability: 'Full-Time',
        skillSet: ['JavaScript'],
        academicCredential: 'Bachelor',
      },
      {
        candidateID: 2,
        courseID: 'CSE101',
        position: 'Analyst',
        previousRole: 'Assistant',
        availability: 'Part-Time',
        skillSet: ['Python'],
        academicCredential: 'Master',
      },
    ];

    // Mock the find method to resolve with the mockApplicants array
    findMock.mockResolvedValue(mockApplicants);

    // Setup request params with a course code
    req = {
      params: { courseCode: 'CSE101' },
    };

    // Act: Call the controller function
    await getApplicantsByCourseCodeFromAppliedForm(req as Request, res as Response);

    // Assert: Verify find was called with correct filter
    expect(findMock).toHaveBeenCalledWith({ where: { courseID: 'CSE101' } });
    // Assert: Verify the response status is 200 (OK)
    expect(statusMock).toHaveBeenCalledWith(200);
    // Assert: Verify the JSON response matches the mock data
    expect(jsonMock).toHaveBeenCalledWith(mockApplicants);
  });

  // Test case: No applicants found for the given course code
  it('should return 404 if no applicants found', async () => {
    // Mock the find method to resolve with an empty array, simulating no data
    findMock.mockResolvedValue([]);

    // Setup request params with a course code that does not exist in data
    req = {
      params: { courseCode: 'UNKNOWN' },
    };

    // Act: Call the controller function
    await getApplicantsByCourseCodeFromAppliedForm(req as Request, res as Response);

    // Assert: Verify find was called with the correct filter
    expect(findMock).toHaveBeenCalledWith({ where: { courseID: 'UNKNOWN' } });
    // Assert: Verify the response status is 404 (Not Found)
    expect(statusMock).toHaveBeenCalledWith(404);
    // Assert: Verify the response message is correct
    expect(jsonMock).toHaveBeenCalledWith({ message: 'No applicants found for this course code' });
  });

  // Test case: Database or unexpected error during find operation
  it('should return 500 on repository error', async () => {
    // Mock the find method to reject with an error simulating a DB failure
    findMock.mockRejectedValue(new Error('DB failure'));

    // Setup request params with a valid course code
    req = {
      params: { courseCode: 'CSE101' },
    };

    // Spy on console.error to suppress error output during tests
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // Act: Call the controller function
    await getApplicantsByCourseCodeFromAppliedForm(req as Request, res as Response);

    // Assert: Verify response status is 500 (Internal Server Error)
    expect(statusMock).toHaveBeenCalledWith(500);
    // Assert: Verify the error message in JSON response
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Internal server error' })
    );

    // Restore original console.error implementation
    consoleSpy.mockRestore();
  });
});
