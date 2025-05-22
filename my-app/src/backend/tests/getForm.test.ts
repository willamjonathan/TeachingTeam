import { getForm } from '../controller/candidate';
import { AppDataSource } from '../data-source';
import { AppliedForm } from '../entity/appliedForm';
import { Request, Response } from 'express';

// Mock the data-source and repository methods
jest.mock('../data-source', () => ({
  AppDataSource: {
    getRepository: jest.fn(),
  },
}));

describe('getForm', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock response methods to track calls and allow chaining
    jsonMock = jest.fn();
    statusMock = jest.fn(() => ({ json: jsonMock })) as any;

    res = {
      json: jsonMock,
      status: statusMock,
    };
  });

  it('should return all forms with status 200', async () => {
    // Create mock AppliedForm instances like your entity
    const forms: AppliedForm[] = [
      new AppliedForm(),
      new AppliedForm(),
    ];

    // Fill in entity properties according to your entity definition
    forms[0].candidateID = 1;
    forms[0].courseID = 'CSE101';
    forms[0].position = 'Developer';
    forms[0].previousRole = 'Intern';
    forms[0].availability = 'Full-Time';
    forms[0].skillSet = ['JavaScript', 'TypeScript'];
    forms[0].academicCredential = 'Bachelor';

    forms[1].candidateID = 2;
    forms[1].courseID = 'MTH202';
    forms[1].position = 'Team Lead';
    forms[1].previousRole = 'Developer';
    forms[1].availability = 'Part-Time';
    forms[1].skillSet = ['Python', 'Data Analysis'];
    forms[1].academicCredential = 'Master';

    // Mock getRepository().find() to return our mock forms array
    (AppDataSource.getRepository as jest.Mock).mockReturnValue({
      find: jest.fn().mockResolvedValue(forms),
    });

    req = {}; // No body or params needed for getForm

    // Call your controller function
    await getForm(req as Request, res as Response);

    // Assert that the find method was called once
    expect(AppDataSource.getRepository).toHaveBeenCalledWith(AppliedForm);

    // Assert response json was called with our forms data
    expect(jsonMock).toHaveBeenCalledWith(forms);

    // No explicit status set means default 200 OK is assumed by Express
  });

  it('should return 500 if repository throws error', async () => {
    // Mock getRepository().find() to throw error
    (AppDataSource.getRepository as jest.Mock).mockReturnValue({
      find: jest.fn().mockRejectedValue(new Error('DB failure')),
    });

    req = {};

    // Spy on console.error to suppress error output during test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await getForm(req as Request, res as Response);

    // Check that 500 status was sent with error message
    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({ error: 'Failed to fetch forms' });

    consoleSpy.mockRestore();
  });
});
