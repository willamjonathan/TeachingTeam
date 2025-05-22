import { getFormsByCandidateId } from '../controller/candidate';
import { AppDataSource } from '../data-source';
import { AppliedForm } from '../entity/appliedForm';
import { Request, Response } from 'express';

jest.mock('../data-source', () => ({
  AppDataSource: {
    getRepository: jest.fn(),
  },
}));

describe('getFormsByCandidateId', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;
  let findMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    jsonMock = jest.fn();
    statusMock = jest.fn(() => ({ json: jsonMock })) as any;

    res = {
      status: statusMock,
      json: jsonMock,
    };

    findMock = jest.fn();

    // Mock the repository with find method
    (AppDataSource.getRepository as jest.Mock).mockReturnValue({
      find: findMock,
    });
  });

  it('should return forms with status 200 if found', async () => {
    const mockForms: AppliedForm[] = [
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
        candidateID: 1,
        courseID: 'MTH202',
        position: 'Analyst',
        previousRole: 'Assistant',
        availability: 'Part-Time',
        skillSet: ['Python'],
        academicCredential: 'Master',
      },
    ];

    findMock.mockResolvedValue(mockForms);

    req = {
      params: { candidateId: '1' },
    };

    await getFormsByCandidateId(req as Request, res as Response);

    expect(findMock).toHaveBeenCalledWith({
      where: { candidateID: 1 },
    });
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith(mockForms);
  });

  it('should return 404 if no forms found', async () => {
    findMock.mockResolvedValue([]);

    req = {
      params: { candidateId: '999' },
    };

    await getFormsByCandidateId(req as Request, res as Response);

    expect(findMock).toHaveBeenCalledWith({
      where: { candidateID: 999 },
    });
    expect(statusMock).toHaveBeenCalledWith(404);
    expect(jsonMock).toHaveBeenCalledWith({ message: 'No forms found for this candidate' });
  });

  it('should return 500 on repository error', async () => {
    findMock.mockRejectedValue(new Error('DB failure'));

    req = {
      params: { candidateId: '1' },
    };

    // Suppress console.error output during test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await getFormsByCandidateId(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Internal server error' })
    );

    consoleSpy.mockRestore();
  });
});
