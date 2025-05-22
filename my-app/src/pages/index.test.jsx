import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from './index';  // Adjust this path as needed
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

  const applicantUsername = "testuser@example.com";
    const applicantPassword = "ValidPassword1";
    const normalizedUsername = applicantUsername.toLowerCase();

    const applicantAccount = { username: applicantUsername, password: applicantPassword };

    // Set necessary values in localStorage
    localStorage.setItem(applicantUsername, JSON.stringify(applicantAccount));
    localStorage.setItem("Username", normalizedUsername);
    localStorage.setItem("isAuthenticated", "true");

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

});

describe('Applicant Page Course Selection', () => {

  it('The form is not submitted because user left previous role blank', async () => {
    const push = jest.fn();
    useRouter.mockReturnValue({ push });


    // Render the Home component
    render(<Home />);

    // Wait for courses to appear
    await waitFor(() => expect(screen.getByText('Artificial Intelligence')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('Data Structures')).toBeInTheDocument());

    // Simulate course click
    fireEvent.click(screen.getByText('Artificial Intelligence'));

    // Wait for the form to show
    await waitFor(() => expect(screen.getByText('Previous Role')).toBeInTheDocument());

    // Fill out form
    fireEvent.change(screen.getByLabelText(/Previous Role/i), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText(/Skills/i), { target: { value: 'React, Node.js' } });
    fireEvent.change(screen.getByLabelText(/Academic Credential/i), { target: { value: 'BSc in Computer Science' } });

    // Submit form
    fireEvent.click(await screen.findByText(/Submit/i));

    // Wait for success alert
    await waitFor(() => {
      expect(localStorage.getItem('formData_testuser@example.com_1')).toBe(null);
    });
  });

  it('The form is not submitted because user left academic credentials blank', async () => {
    const push = jest.fn();
    useRouter.mockReturnValue({ push });


    // Render the Home component
    render(<Home />);

    // Wait for courses to appear
    await waitFor(() => expect(screen.getByText('Artificial Intelligence')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('Data Structures')).toBeInTheDocument());

    // Simulate course click
    fireEvent.click(screen.getByText('Artificial Intelligence'));

    // Wait for the form to show
    await waitFor(() => expect(screen.getByText('Previous Role')).toBeInTheDocument());

    // Fill out form
    fireEvent.change(screen.getByLabelText(/Previous Role/i), { target: { value: 'job' } });
    fireEvent.change(screen.getByLabelText(/Skills/i), { target: { value: 'React, Node.js' } });
    fireEvent.change(screen.getByLabelText(/Academic Credential/i), { target: { value: '' } });

    // Submit form
    fireEvent.click(await screen.findByText(/Submit/i));

    // Wait for success alert
    await waitFor(() => {
      expect(localStorage.getItem('formData_testuser@example.com_1')).toBe(null);
    });
  });

  it('The form is not submitted because user left skills blank', async () => {
    const push = jest.fn();
    useRouter.mockReturnValue({ push });


    // Render the Home component
    render(<Home />);

    // Wait for courses to appear
    await waitFor(() => expect(screen.getByText('Artificial Intelligence')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('Data Structures')).toBeInTheDocument());

    // Simulate course click
    fireEvent.click(screen.getByText('Artificial Intelligence'));

    // Wait for the form to show
    await waitFor(() => expect(screen.getByText('Previous Role')).toBeInTheDocument());

    // Fill out form
    fireEvent.change(screen.getByLabelText(/Previous Role/i), { target: { value: 'job' } });
    fireEvent.change(screen.getByLabelText(/Skills/i), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText(/Academic Credential/i), { target: { value: 'BSc in Computer Science' } });

    // Submit form
    fireEvent.click(await screen.findByText(/Submit/i));

    // Wait for success alert
    await waitFor(() => {
      expect(localStorage.getItem('formData_testuser@example.com_1')).toBe(null);
    });
  });

  it('should display courses, open the form on course click, and submit the form', async () => {
    const push = jest.fn();
    useRouter.mockReturnValue({ push });


    // Render the Home component
    render(<Home />);

    // Wait for courses to appear
    await waitFor(() => expect(screen.getByText('Artificial Intelligence')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('Data Structures')).toBeInTheDocument());

    // Simulate course click
    fireEvent.click(screen.getByText('Artificial Intelligence'));

    // Wait for the form to show
    await waitFor(() => expect(screen.getByText('Previous Role')).toBeInTheDocument());

    // Fill out form
    fireEvent.change(screen.getByLabelText(/Previous Role/i), { target: { value: 'Software Engineer' } });
    fireEvent.change(screen.getByLabelText(/Skills/i), { target: { value: 'React, Node.js' } });
    fireEvent.change(screen.getByLabelText(/Academic Credential/i), { target: { value: 'BSc in Computer Science' } });

    // Submit form
    fireEvent.click(await screen.findByText(/Submit/i));

    // Wait for success alert
    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Form submitted successfully!');
      expect(localStorage.getItem('formData_testuser@example.com_1')).toBe("{\"previousRole\":\"Software Engineer\",\"availability\":\"part-time\",\"skillSet\":\"React, Node.js\",\"academicCredential\":\"BSc in Computer Science\",\"courseCode\":\"COSC8888\"}");
    });
  });
});
