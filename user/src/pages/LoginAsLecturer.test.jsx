import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../pages/login'; // Adjust if your file path is different
import '@testing-library/jest-dom';
import { useRouter } from 'next/router';
import React from 'react';  // Add this line

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// Mock alert
global.alert = jest.fn();

describe('Login Page', () => {
  // Set lecturer account in localStorage
  localStorage.setItem('@lecturer1', JSON.stringify({
    username: '@lecturer1', //Andrean1@gmail.com
    password: 'iamlecturer' //iamlecturer1AS

  }));

  
  it('fail to log in because the password is wrong', () =>{
    const push = jest.fn();
    useRouter.mockReturnValue({ push });    

    render(<Login />);

    // Fill the form
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: '@lecturer1' },
    });

    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'iamNotalecturer' },
    });

    fireEvent.click(screen.getByText(/login/i));

    // Check for alert
    expect(alert).toHaveBeenCalledWith('Incorrect password!');
  });

  it('logs in a lecturer and redirects to home page', async () => {
    const push = jest.fn();
    useRouter.mockReturnValue({ push });    

    render(<Login />);

    // Fill the form
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: '@lecturer1' },
    });

    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'iamlecturer' },
    });

    fireEvent.click(screen.getByText(/login/i));

    // Check for alert
    expect(alert).toHaveBeenCalledWith('Login successful!');

    // Check that it is really a lecturer
    expect(localStorage.getItem('isAuthenticated')).toBe('lecturer');

    // Check if router.push was called to redirect
    expect(push).toHaveBeenCalledWith('/');

  });
});
