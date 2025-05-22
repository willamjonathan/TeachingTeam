import { createForm } from '../controller/candidate';
import { AppDataSource } from '../data-source';
import { AppliedForm } from '../entity/appliedForm';
import { Request, Response } from 'express';

//All test Comments are refined by chatGPT, however they are working as assistance, we create the comment first and they fix the grammar or something like that

// Mock the data source module to avoid actual DB calls during tests
jest.mock('../data-source', () => ({
  AppDataSource: {
    manager: {
      save: jest.fn(), // Mock 'save' method for entity persistence
    },
  },
}));

describe('createForm', () => {
  // Declare variables for request and response mocks
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    // Clear all previous mock calls and implementations before each test
    jest.clearAllMocks();

    // Create mock functions for response.json and response.status chaining
    jsonMock = jest.fn();
    statusMock = jest.fn(() => ({ json: jsonMock })) as any;

    // Mock response object with status and json methods
    res = { status: statusMock, json: jsonMock };
  });

  it('should create and return the form with status 201', async () => {
    // Prepare a mock request object with valid form data
    req = {
      body: {
        CandidateID: 123,
        CourseCode: 'CSE101',
        Position: 'Team Lead',
        PreviousRole: 'Developer',
        Availability: 'Full-Time',
        Skills: ['JavaScript', 'Node'],
        AcademicCredentials: 'Bachelor',
      },
    };

    // Create an instance of AppliedForm representing what would be saved
    const savedForm = new AppliedForm();
    savedForm.candidateID = 123;
    savedForm.courseID = 'CSE101';
    savedForm.position = 'Team Lead';
    savedForm.previousRole = 'Developer';
    savedForm.availability = 'Full-Time';
    savedForm.skillSet = ['JavaScript', 'Node'];
    savedForm.academicCredential = 'Bachelor';

    // Mock AppDataSource.manager.save to resolve with savedForm instance
    (AppDataSource.manager.save as jest.Mock).mockResolvedValue(savedForm);

    // Call the createForm controller method with mocked request and response
    await createForm(req as Request, res as Response);

    // Assert save method was called once to persist form data
    expect(AppDataSource.manager.save).toHaveBeenCalledTimes(1);

    // Assert response status was set to 201 (Created)
    expect(statusMock).toHaveBeenCalledWith(201);

    // Assert response json method was called with the saved form object
    expect(jsonMock).toHaveBeenCalledWith(savedForm);
  });

  it('should return 400 if CandidateID is missing', async () => {
    // Prepare request missing CandidateID but with CourseCode
    req = { body: { CourseCode: 'CSE101' } };

    // Call createForm with incomplete data
    await createForm(req as Request, res as Response);

    // Expect response status 400 (Bad Request) due to missing CandidateID
    expect(statusMock).toHaveBeenCalledWith(400);

    // Expect json response to contain the appropriate error message
    expect(jsonMock).toHaveBeenCalledWith({ error: 'CandidateID and CourseCode are required' });

    // Ensure no attempt was made to save incomplete form data to DB
    expect(AppDataSource.manager.save).not.toHaveBeenCalled();
  });

  it('should return 400 if CourseCode is missing', async () => {
    // Prepare request missing CourseCode but with CandidateID
    req = { body: { CandidateID: 123 } };

    // Call createForm with incomplete data
    await createForm(req as Request, res as Response);

    // Expect response status 400 (Bad Request) due to missing CourseCode
    expect(statusMock).toHaveBeenCalledWith(400);

    // Expect json response with error message about required fields
    expect(jsonMock).toHaveBeenCalledWith({ error: 'CandidateID and CourseCode are required' });

    // Ensure save method was not called as validation failed
    expect(AppDataSource.manager.save).not.toHaveBeenCalled();
  });

  it('should return 500 if saving form throws error', async () => {
    // Prepare request with valid data
    req = {
      body: {
        CandidateID: 123,
        CourseCode: 'CSE101',
        Position: 'Team Lead',
        PreviousRole: 'Developer',
        Availability: 'Full-Time',
        Skills: ['JavaScript', 'Node'],
        AcademicCredentials: 'Bachelor',
      },
    };

    // Mock save method to simulate database failure by rejecting the promise
    (AppDataSource.manager.save as jest.Mock).mockRejectedValue(new Error('DB error'));

    // Suppress console.error output during test to keep logs clean
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // Call createForm, which should catch the save error and respond with 500
    await createForm(req as Request, res as Response);

    // Verify save method was called despite the error
    expect(AppDataSource.manager.save).toHaveBeenCalled();

    // Expect HTTP 500 status for internal server error
    expect(statusMock).toHaveBeenCalledWith(500);

    // Expect json response to include failure message
    expect(jsonMock).toHaveBeenCalledWith({ error: 'Failed to create form' });

    // Restore original console.error function after test
    consoleSpy.mockRestore();
  });
});
