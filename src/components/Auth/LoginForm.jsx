import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#000000' }}>
      <div className="border-2 border-sw-gold rounded-lg p-8 max-w-md w-full" style={{ backgroundColor: '#0A0A0A' }}>
        <h2 className="text-3xl font-display font-bold text-sw-gold mb-6 text-center">
          ═══ ACCESS DATABANK ═══
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sw-deep-gold font-display mb-2">USERNAME</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 border border-sw-border rounded text-sw-light focus:outline-none focus:border-sw-gold focus:ring-1 focus:ring-sw-blue focus:ring-opacity-30"
              style={{ backgroundColor: '#0f0f0f' }}
              placeholder="Enter username"
            />
          </div>

          <div>
            <label className="block text-sw-deep-gold font-display mb-2">PASSWORD</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-sw-border rounded text-sw-light focus:outline-none focus:border-sw-gold focus:ring-1 focus:ring-sw-blue focus:ring-opacity-30"
              style={{ backgroundColor: '#0f0f0f' }}
              placeholder="Enter password"
            />
          </div>

          {error && (
            <div className="border border-sw-red rounded p-3 text-sw-red text-sm font-display" style={{ backgroundColor: '#1a0a0a' }}>
              {error.toUpperCase()}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-sw-gold text-sw-void font-display font-bold rounded hover:bg-sw-amber hover:shadow-glow-gold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'AUTHENTICATING...' : 'LOGIN'}
          </button>
        </form>

        <div className="mt-6 text-sm text-center font-display">
          <p className="text-sw-dim">DEMO CREDENTIALS:</p>
          <p className="mt-2 text-sw-gold">luke / skywalker</p>
          <p className="text-sw-gold">leia / organa</p>
          <p className="text-sw-gold">han / solo</p>
          <p className="text-sw-gold">admin / admin123</p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;

