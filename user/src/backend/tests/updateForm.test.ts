import { updateForm } from '../controller/candidate';
import { AppDataSource } from '../data-source';
import { AppliedForm } from '../entity/appliedForm';
import { Request, Response } from 'express';

jest.mock('../data-source', () => ({
  AppDataSource: {
    getRepository: jest.fn(),
  },
}));

describe('updateForm', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;
  let saveMock: jest.Mock;
  let findOneMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    jsonMock = jest.fn();
    statusMock = jest.fn(() => ({ json: jsonMock })) as any;

    res = {
      status: statusMock,
      json: jsonMock,
    };

    saveMock = jest.fn();
    findOneMock = jest.fn();

    // Mock the repository methods findOne and save
    (AppDataSource.getRepository as jest.Mock).mockReturnValue({
      findOne: findOneMock,
      save: saveMock,
    });
  });

  it('should update and return the form with status 200', async () => {
    const existingForm = new AppliedForm();
    existingForm.candidateID = 1;
    existingForm.courseID = 'CSE101';
    existingForm.position = 'Developer';
    existingForm.previousRole = 'Intern';
    existingForm.availability = 'Full-Time';
    existingForm.skillSet = ['JavaScript'];
    existingForm.academicCredential = 'Bachelor';

    // Mock findOne to return the existing form
    findOneMock.mockResolvedValue(existingForm);
    // Mock save to resolve with updated form (usually same object)
    saveMock.mockResolvedValue(existingForm);

    req = {
      params: {
        candidateId: '1',
        courseCode: 'CSE101',
      },
      body: {
        Position: 'Team Lead',
        PreviousRole: 'Developer',
        Availability: 'Part-Time',
        Skills: ['TypeScript', 'Node.js'],
        AcademicCredentials: 'Master',
      },
    };

    await updateForm(req as Request, res as Response);

    // Check that findOne was called with correct where clause
    expect(findOneMock).toHaveBeenCalledWith({
      where: { candidateID: 1, courseID: 'CSE101' },
    });

    // Check that form fields were updated
    expect(existingForm.position).toBe('Team Lead');
    expect(existingForm.previousRole).toBe('Developer');
    expect(existingForm.availability).toBe('Part-Time');
    expect(existingForm.skillSet).toEqual(['TypeScript', 'Node.js']);
    expect(existingForm.academicCredential).toBe('Master');

    // Check that save was called to persist changes
    expect(saveMock).toHaveBeenCalledWith(existingForm);

    // Response status 200 and json called with updated form
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith(existingForm);
  });

  it('should return 404 if form not found', async () => {
    // findOne returns null => no form found
    findOneMock.mockResolvedValue(null);

    req = {
      params: {
        candidateId: '999',
        courseCode: 'NONEXIST',
      },
      body: {},
    };

    await updateForm(req as Request, res as Response);

    expect(findOneMock).toHaveBeenCalledWith({
      where: { candidateID: 999, courseID: 'NONEXIST' },
    });

    // Expect 404 with "Form not found" message
    expect(statusMock).toHaveBeenCalledWith(404);
    expect(jsonMock).toHaveBeenCalledWith({ message: 'Form not found' });

    // Save should not be called if form doesn't exist
    expect(saveMock).not.toHaveBeenCalled();
  });

  it('should return 500 on repository error', async () => {
    // findOne throws error simulating DB failure
    findOneMock.mockRejectedValue(new Error('DB error'));

    req = {
      params: {
        candidateId: '1',
        courseCode: 'CSE101',
      },
      body: {},
    };

    // Spy console.error to suppress error logs during test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await updateForm(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Internal server error' })
    );

    consoleSpy.mockRestore();
  });
});
