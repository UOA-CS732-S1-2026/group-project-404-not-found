import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import MaterialsMarketPage from './MaterialsMarketPage';

// Mock fetch to prevent actual API calls during tests
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ materials: [], total: 0 }),
  })
) as unknown as typeof fetch;

describe('MaterialsMarketPage Component', () => {
  it('renders the materials header and search inputs', () => {
    render(
      <MemoryRouter>
        <MaterialsMarketPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Materials')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search by course code or material title...')).toBeInTheDocument();
  });

  it('renders the points balance card', () => {
    render(
      <MemoryRouter>
        <MaterialsMarketPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Points Balance')).toBeInTheDocument();
  });
});
