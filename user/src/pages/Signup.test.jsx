import React from 'react'; // Import React
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Signup from '../pages/signup'; // Adjust the path based on your project structure
import { useRouter } from 'next/router';

// Mocking dependencies
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// Mocking localStorage
beforeAll(() => {
  const localStorageMock = (function () {
    let store = {};
    return {
      getItem: (key) => store[key] || null,
      setItem: (key, value) => {
        store[key] = value.toString();
      },
      clear: () => {
        store = {};
      },
    };
  })();
  global.localStorage = localStorageMock;
});

// Mocking alert
global.alert = jest.fn();

describe('Signup Component', () => {
  const mockPush = jest.fn();
  beforeEach(() => {
    useRouter.mockReturnValue({ push: mockPush });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  // Test 1: Successful signup flow
  it('should sign up successfully and navigate to login', async () => {
    // Render the Signup component
    render(<Signup />);

    // Get the input elements
    const emailInput = screen.getByPlaceholderText('Email Address');
    const passwordInput = screen.getByPlaceholderText('Password');
    const signupButton = screen.getByText('Sign Up');

    // Simulate entering valid data
    fireEvent.change(emailInput, { target: { value: 'testuser@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'ValidPassword1' } });

    // Simulate a signup button click
    fireEvent.click(signupButton);

    // Wait for the alert and router push to be triggered
    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Account created successfully!');
      expect(mockPush).toHaveBeenCalledWith('/login');
      expect(localStorage.getItem('testuser@example.com')).not.toBeNull();
    });
  });
  // Test 2: Attempting to sign up with an existing email
  it('should show an alert if email is already used', async () => {
    // Simulate an existing user in localStorage
    localStorage.setItem('testuser@example.com', JSON.stringify({ email: 'testuser@example.com', password: 'ExistingPassword1' }));
    // Fill the form with the same email
    render(<Signup />);
    const emailInput = screen.getByPlaceholderText('Email Address');
    const passwordInput = screen.getByPlaceholderText('Password');
    const signupButton = screen.getByText('Sign Up');

    fireEvent.change(emailInput, { target: { value: 'testuser@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'ValidPassword1' } });

    fireEvent.click(signupButton);
    // Expect alert about user already existing, and data should not be overwritten
    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('User already exists!');
      expect(localStorage.getItem('testuser@example.com')).not.toBeNull(); // Ensure it doesn't overwrite existing user
    });
  });
  // Test 3: Invalid email format
  it('should show an alert if email format is invalid', async () => {
    render(<Signup />);
    // Provide an invalid email and a valid password
    const emailInput = screen.getByPlaceholderText('Email Address');
    const passwordInput = screen.getByPlaceholderText('Password');
    const signupButton = screen.getByText('Sign Up');

    fireEvent.change(emailInput, { target: { value: 'invalidemail' } });
    fireEvent.change(passwordInput, { target: { value: 'ValidPassword1' } });

    fireEvent.click(signupButton);
    // Expect alert about invalid email format
    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Please enter a valid email address.');
    });
  });


  //Test 4: Invalid password format (too short or no uppercase)
  it('should show an alert if password is too short or lacks an uppercase letter', async () => {
    render(<Signup />);
    // Provide a valid email but a weak password
    const emailInput = screen.getByPlaceholderText('Email Address');
    const passwordInput = screen.getByPlaceholderText('Password');
    const signupButton = screen.getByText('Sign Up');

    fireEvent.change(emailInput, { target: { value: 'testuser@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'short' } });

    fireEvent.click(signupButton);
    // Expect alert about password strength
    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Password must be at least 8 characters long and contain at least one uppercase letter.');
    });
  });
});
