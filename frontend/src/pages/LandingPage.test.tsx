import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import LandingPage from './LandingPage';

describe('LandingPage Component', () => {
  it('renders the landing page with the main heading', () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    // The component has "About us" as the main heading in Hero section
    expect(screen.getByText('About us')).toBeInTheDocument();
    
    // It should also have the call to action
    expect(screen.getByText('Ready to start swapping?')).toBeInTheDocument();
  });

  it('shows Sign Up button when no user is logged in', () => {
    render(
      <MemoryRouter>
        <LandingPage currentUser={null} />
      </MemoryRouter>
    );

    expect(screen.getByText('Sign Up Now')).toBeInTheDocument();
  });

  it('shows Profile button when user is logged in', () => {
    const mockUser = { id: 1, email: 'student@aucklanduni.ac.nz' };
    render(
      <MemoryRouter>
        <LandingPage currentUser={mockUser} />
      </MemoryRouter>
    );

    expect(screen.getByText('Go to Profile')).toBeInTheDocument();
    expect(screen.queryByText('Sign Up Now')).not.toBeInTheDocument();
  });
});
