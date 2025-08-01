import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from './lecture/home';  // Adjust this path as needed
import '@testing-library/jest-dom';
import { useRouter } from 'next/router';
import React from 'react';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: () => <div></div>,
}));

// Mock alert globally
global.alert = jest.fn();

beforeEach(() => {
  localStorage.clear(); // Clear localStorage before each test
  jest.clearAllMocks(); // Reset all mocks including alert and useRouter
});

describe('Lecturer Page Course Selection', () => {
  it('should display applicant username, academic credential, availability, previous role, and skillset', async () => {
    const push = jest.fn();
    useRouter.mockReturnValue({ push });

    const LecturerUsername = "@lecturer1";
    const normalizedUsername = LecturerUsername.toLowerCase();
    
    // Set necessary values in localStorage
    localStorage.setItem("Username", normalizedUsername);
    localStorage.setItem("isAuthenticated", "lecturer");

    // Insert default courses into localStorage
    const courses = [
      { id: 1, title: "Artificial Intelligence", code: "COSC8888" },
      { id: 2, title: "Data Structures", code: "COSC2222" },
      { id: 3, title: "Cyber Security", code: "COSC3333" },
      { id: 4, title: "Cloud Computing", code: "COSC4444" },
      { id: 5, title: "Machine Learning", code: "COSC5555" },
      { id: 6, title: "Software Engineering", code: "COSC6666" }
    ];
    localStorage.setItem("courses", JSON.stringify(courses));

    const formData = {
        academicCredential: "Yeah",
        availability: "part-time",
        courseCode: "COSC8888",
        previousRole: "Dev",
        skillSet: "React",
    };

    localStorage.setItem("formData_Andrean1@gmail.com_1", JSON.stringify(formData));

    // Render the Home component
    render(<Home />);

    // Wait for courses to appear
    await waitFor(() => expect(screen.getByText('Applicants')).toBeInTheDocument());
    // await waitFor(() => expect(screen.getByText('Data Structures')).toBeInTheDocument());

    // Simulate course click
    fireEvent.click(screen.getByText('Applicants'));

    // Wait for the form to show
    await waitFor(() => expect(screen.getByText('Filter by Course:')).toBeInTheDocument());

    await waitFor(() => {
        expect(screen.getByText('Andrean1@gmail.com')).toBeInTheDocument();
        expect(screen.getByText('Yeah')).toBeInTheDocument();
        expect(screen.getByText('Dev')).toBeInTheDocument();
        expect(screen.getByText('React')).toBeInTheDocument();
        expect(screen.getByText('Andrean1@gmail.com')).toBeInTheDocument();
      });
      
  });
});
