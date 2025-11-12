const MOCK_USERS = {
  'luke': 'skywalker',
  'leia': 'organa',
  'han': 'solo',
  'admin': 'admin123'
};

const TOKEN_KEY = 'sw_token';
const TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

const generateToken = () => {
  return btoa(JSON.stringify({
    username: Date.now(),
    exp: Date.now() + TOKEN_EXPIRY
  }));
};

export const login = async (username, password) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const normalizedUsername = username.toLowerCase().trim();
  const normalizedPassword = password.trim();

  if (MOCK_USERS[normalizedUsername] === normalizedPassword) {
    const token = generateToken();
    const tokenData = {
      token,
      username: normalizedUsername,
      expiresAt: Date.now() + TOKEN_EXPIRY
    };
    localStorage.setItem(TOKEN_KEY, JSON.stringify(tokenData));
    return { success: true, token };
  }

  throw new Error('Invalid credentials');
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const getToken = () => {
  const tokenData = localStorage.getItem(TOKEN_KEY);
  if (!tokenData) return null;

  try {
    const data = JSON.parse(tokenData);
    if (data.expiresAt && data.expiresAt > Date.now()) {
      return data.token;
    }
    // Token expired
    logout();
    return null;
  } catch (error) {
    logout();
    return null;
  }
};

export const isAuthenticated = () => {
  return getToken() !== null;
};

export const refreshToken = () => {
  if (isAuthenticated()) {
    const token = generateToken();
    const tokenData = localStorage.getItem(TOKEN_KEY);
    if (tokenData) {
      const data = JSON.parse(tokenData);
      const newTokenData = {
        token,
        username: data.username,
        expiresAt: Date.now() + TOKEN_EXPIRY
      };
      localStorage.setItem(TOKEN_KEY, JSON.stringify(newTokenData));
      return token;
    }
  }
  return null;
};

