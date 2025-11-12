const SWAPI_BASE_URL = 'https://swapi.dev/api';

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

const fetchWrapper = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new ApiError(
        `API request failed: ${response.statusText}`,
        response.status
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(`Network error: ${error.message}`, 0);
  }
};

export const fetchCharacters = async (page = 1) => {
  const url = `${SWAPI_BASE_URL}/people/?page=${page}`;
  return fetchWrapper(url);
};

export const fetchCharacterDetails = async (url) => {
  if (!url) throw new ApiError('Character URL is required', 400);
  return fetchWrapper(url);
};

export const fetchHomeworld = async (url) => {
  // Handle "unknown", "n/a", empty strings, or invalid URLs
  if (!url || url === 'unknown' || url === 'n/a' || typeof url !== 'string' || !url.startsWith('http')) {
    return null;
  }
  
  try {
    const data = await fetchWrapper(url);
    // Validate the response has required fields
    if (data && data.name) {
      return data;
    }
    return null;
  } catch (error) {
    console.error('Error fetching homeworld:', error);
    return null;
  }
};

export const fetchSpecies = async (urls) => {
  // Handle empty array, null, or undefined
  if (!urls || !Array.isArray(urls) || urls.length === 0) {
    return [];
  }
  
  // Filter out invalid URLs
  const validUrls = urls.filter(url => 
    url && 
    typeof url === 'string' && 
    url.startsWith('http') && 
    url !== 'unknown' && 
    url !== 'n/a'
  );
  
  if (validUrls.length === 0) {
    return [];
  }
  
  try {
    // Fetch all species in parallel, but handle individual failures
    const speciesPromises = validUrls.map(async (url) => {
      try {
        const data = await fetchWrapper(url);
        // Validate response
        if (data && data.name) {
          return data;
        }
        return null;
      } catch (error) {
        console.error(`Error fetching species from ${url}:`, error);
        return null;
      }
    });
    
    const results = await Promise.all(speciesPromises);
    // Filter out any null results from failed fetches
    return results.filter(Boolean);
  } catch (error) {
    console.error('Error fetching species:', error);
    return [];
  }
};

export const fetchFilm = async (url) => {
  if (!url) return null;
  try {
    return await fetchWrapper(url);
  } catch (error) {
    console.error('Error fetching film:', error);
    return null;
  }
};

export const fetchAllHomeworlds = async () => {
  const homeworlds = new Set();
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    try {
      const data = await fetchCharacters(page);
      if (data && data.results) {
        data.results.forEach(character => {
          // Validate homeworld URL before adding
          if (character.homeworld && 
              typeof character.homeworld === 'string' && 
              character.homeworld.startsWith('http') &&
              character.homeworld !== 'unknown' &&
              character.homeworld !== 'n/a') {
            homeworlds.add(character.homeworld);
          }
        });
      }
      hasMore = data.next !== null;
      page++;
    } catch (error) {
      console.error('Error fetching homeworlds:', error);
      hasMore = false;
    }
  }

  // Fetch all homeworlds in parallel with error handling
  const homeworldData = await Promise.all(
    Array.from(homeworlds).map(async (url) => {
      try {
        return await fetchHomeworld(url);
      } catch (error) {
        console.error(`Error fetching homeworld ${url}:`, error);
        return null;
      }
    })
  );

  return homeworldData
    .filter(Boolean)
    .filter(hw => hw.name) // Ensure name exists
    .map(hw => ({
      url: hw.url,
      name: hw.name
    }));
};

export const fetchAllFilms = async () => {
  try {
    const url = `${SWAPI_BASE_URL}/films/`;
    const data = await fetchWrapper(url);
    return data.results.map(film => ({
      url: film.url,
      title: film.title
    }));
  } catch (error) {
    console.error('Error fetching films:', error);
    return [];
  }
};

export const fetchAllSpecies = async () => {
  try {
    const species = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      try {
        const url = `${SWAPI_BASE_URL}/species/?page=${page}`;
        const data = await fetchWrapper(url);
        if (data && data.results && Array.isArray(data.results)) {
          species.push(...data.results);
        }
        hasMore = data.next !== null;
        page++;
      } catch (error) {
        console.error(`Error fetching species page ${page}:`, error);
        hasMore = false;
      }
    }

    return species
      .filter(s => s && s.name && s.url) // Validate species data
      .map(s => ({
        url: s.url,
        name: s.name
      }));
  } catch (error) {
    console.error('Error fetching species:', error);
    return [];
  }
};

