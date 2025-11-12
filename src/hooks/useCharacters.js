import { useState, useEffect } from 'react';
import { fetchCharacters } from '../services/api';

export const useCharacters = (page = 1) => {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const loadCharacters = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await fetchCharacters(page);
        setCharacters(data.results || []);
        setTotalCount(data.count || 0);
        setTotalPages(Math.ceil((data.count || 0) / 10));
      } catch (err) {
        setError(err.message || 'Failed to load characters');
        setCharacters([]);
      } finally {
        setLoading(false);
      }
    };

    loadCharacters();
  }, [page]);

  return { characters, loading, error, totalPages, totalCount };
};

