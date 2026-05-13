import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import CourseListPage from './CourseListPage';

describe('CourseListPage Component', () => {
  it('renders the course directory header and search bar', () => {
    render(
      <MemoryRouter>
        <CourseListPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Find your course')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search by course code, title, or instructor...')).toBeInTheDocument();
  });

  it('renders department filter tags', () => {
    render(
      <MemoryRouter>
        <CourseListPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Computer Science')).toBeInTheDocument();
    expect(screen.getByText('Business')).toBeInTheDocument();
    expect(screen.getByText('Engineering')).toBeInTheDocument();
  });
});
