import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../pages/login'; // Adjust the import path if necessary
import '@testing-library/jest-dom';
import { useRouter } from 'next/router';
import React from 'react';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// Mock alert
global.alert = jest.fn();

describe('Login Page for Applicant', () => {
  // Set applicant account in localStorage
  const applicantUsername = "testuser@example.com";
  const applicantPassword = "ValidPassword1";
  const applicantAccount = { username: applicantUsername, password: applicantPassword };
  localStorage.setItem(applicantUsername, JSON.stringify(applicantAccount));

  it('fail to log in because user input invalid username (not in correct template)', () => {
    const push = jest.fn();
    useRouter.mockReturnValue({ push });
    
    render(<Login />);

    // Fill the form with wrong applicant credentials
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "Unregisteredgmail.com"},
    });

    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: applicantPassword },
    });

    fireEvent.click(screen.getByText(/login/i));

    // Check for alert
    expect(alert).toHaveBeenCalledWith('Please enter a valid email address.');

    // Check that the applicant does not change isAuthenticated
    expect(localStorage.getItem('isAuthenticated')).toBe(null);
    
    // Check if router.push was not called to redirect
    expect(push).not.toHaveBeenCalled();
  });

  it('fail to log in because user input unregistered email/username', () => {
    const push = jest.fn();
    useRouter.mockReturnValue({ push });
    
    render(<Login />);

    // Fill the form with wrong applicant credentials
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "Unregistered@gmail.com"},
    });

    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: applicantPassword },
    });

    fireEvent.click(screen.getByText(/login/i));

    // Check for alert
    expect(alert).toHaveBeenCalledWith('User not found. Please sign up.');

    // Check that the applicant does not change isAuthenticated
    expect(localStorage.getItem('isAuthenticated')).toBe(null);
    
    // Check if router.push was not called to redirect
    expect(push).not.toHaveBeenCalled();
  });

  it('fail to log in because the password is wrong', () => {
    const push = jest.fn();
    useRouter.mockReturnValue({ push });
    
    render(<Login />);

    // Fill the form with wrong applicant credentials
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: applicantUsername },
    });

    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "WrongPassword" },
    });

    fireEvent.click(screen.getByText(/login/i));

    // Check for alert
    expect(alert).toHaveBeenCalledWith('Incorrect password!');

    // Check that the applicant does not change isAuthenticated
    expect(localStorage.getItem('isAuthenticated')).toBe(null);
    
    // Check if router.push was not called to redirect
    expect(push).not.toHaveBeenCalled();
  });

  it('logs in an applicant and redirects to home page', () => {
    const push = jest.fn();
    useRouter.mockReturnValue({ push });

    render(<Login />);

    // Fill the form with applicant credentials
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: applicantUsername },
    });

    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: applicantPassword },
    });

    fireEvent.click(screen.getByText(/login/i));

    // Check for alert
    expect(alert).toHaveBeenCalledWith('Login successful!');

    // Check that it is really a applicant
    expect(localStorage.getItem('isAuthenticated')).toBe('true');
    
    // Check if router.push was called to redirect
    expect(push).toHaveBeenCalledWith('/');  
  });
});
