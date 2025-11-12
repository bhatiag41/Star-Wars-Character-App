import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import CharacterModal from '../src/components/CharacterModal';

// Mock the useCharacterDetails hook
vi.mock('../src/hooks/useCharacterDetails', () => ({
  useCharacterDetails: vi.fn()
}));

import { useCharacterDetails } from '../src/hooks/useCharacterDetails';

describe('CharacterModal', () => {
  const mockCharacter = {
    name: 'Luke Skywalker',
    height: '172',
    mass: '77',
    birth_year: '19BBY',
    films: ['https://swapi.dev/api/films/1/', 'https://swapi.dev/api/films/2/'],
    created: '2014-12-09T13:50:51.644000Z',
    homeworld: 'https://swapi.dev/api/planets/1/',
    species: []
  };

  const mockHomeworld = {
    name: 'Tatooine',
    terrain: 'desert',
    climate: 'arid',
    population: '200000'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders modal when open', () => {
    useCharacterDetails.mockReturnValue({
      character: mockCharacter,
      homeworld: mockHomeworld,
      species: [],
      loading: false,
      error: null
    });

    render(
      <CharacterModal
        characterUrl="https://swapi.dev/api/people/1/"
        isOpen={true}
        onClose={() => {}}
      />
    );

    expect(screen.getByText(/LUKE SKYWALKER/i)).toBeInTheDocument();
  });

  it('displays character details correctly', async () => {
    useCharacterDetails.mockReturnValue({
      character: mockCharacter,
      homeworld: mockHomeworld,
      species: [],
      loading: false,
      error: null
    });

    render(
      <CharacterModal
        characterUrl="https://swapi.dev/api/people/1/"
        isOpen={true}
        onClose={() => {}}
      />
    );

    expect(screen.getByText(/1.72m/i)).toBeInTheDocument();
    expect(screen.getByText(/77kg/i)).toBeInTheDocument();
    expect(screen.getByText(/19BBY/i)).toBeInTheDocument();
    expect(screen.getByText(/2/i)).toBeInTheDocument();
    expect(screen.getByText(/Tatooine/i)).toBeInTheDocument();
  });

  it('shows loading state', () => {
    useCharacterDetails.mockReturnValue({
      character: null,
      homeworld: null,
      species: [],
      loading: true,
      error: null
    });

    render(
      <CharacterModal
        characterUrl="https://swapi.dev/api/people/1/"
        isOpen={true}
        onClose={() => {}}
      />
    );

    // Loading spinner should be visible
    expect(screen.getByText(/LOADING/i)).toBeInTheDocument();
  });

  it('shows error state', () => {
    useCharacterDetails.mockReturnValue({
      character: null,
      homeworld: null,
      species: [],
      loading: false,
      error: 'Failed to load character'
    });

    render(
      <CharacterModal
        characterUrl="https://swapi.dev/api/people/1/"
        isOpen={true}
        onClose={() => {}}
      />
    );

    expect(screen.getByText(/Error Loading Data/i)).toBeInTheDocument();
    expect(screen.getByText(/Failed to load character/i)).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    useCharacterDetails.mockReturnValue({
      character: mockCharacter,
      homeworld: mockHomeworld,
      species: [],
      loading: false,
      error: null
    });

    const { container } = render(
      <CharacterModal
        characterUrl="https://swapi.dev/api/people/1/"
        isOpen={false}
        onClose={() => {}}
      />
    );

    expect(container.firstChild).toBeNull();
  });
});

