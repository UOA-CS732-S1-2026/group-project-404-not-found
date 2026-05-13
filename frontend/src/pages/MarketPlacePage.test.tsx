import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import MarketPlacePage from './MarketPlacePage';

// Mock fetch to prevent actual API calls during tests
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ listings: [], total: 0 }),
  })
) as unknown as typeof fetch;

describe('MarketPlacePage Component', () => {
  it('renders the marketplace header and search bar', () => {
    render(
      <MemoryRouter>
        <MarketPlacePage />
      </MemoryRouter>
    );

    expect(screen.getByText('Filters')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Keyword...')).toBeInTheDocument();
  });

  it('renders filter tags for categories', () => {
    render(
      <MemoryRouter>
        <MarketPlacePage />
      </MemoryRouter>
    );

    expect(screen.getByText('Textbooks / Books')).toBeInTheDocument();
    expect(screen.getByText('Electronics')).toBeInTheDocument();
    expect(screen.getByText('Stationery')).toBeInTheDocument();
  });
});
