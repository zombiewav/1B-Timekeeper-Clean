import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const { signIn, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await signIn(email.trim(), password);
      navigate('/admin');
    } catch (err: any) {
      setError(err?.message ?? 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="w-full flex items-center justify-center py-8">
      <div
        className="w-full max-w-md p-6 rounded-2xl shadow-lg"
        style={{
          backgroundColor: 'white',
          border: '1px solid rgba(0,0,0,0.08)',
        }}
      >
        <h1 className="text-[#003087] text-2xl font-bold mb-2">
          Admin Login
        </h1>

        <p className="text-gray-600 text-sm mb-5">
          Enter your admin credentials to continue.
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block">
            <span className="text-gray-700 text-sm font-medium">
              Email
            </span>

            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              className="mt-1 w-full rounded-lg px-3 py-2 outline-none"
              style={{
                backgroundColor: '#F5F5F5',
                border: '1px solid #D1D5DB',
                color: '#111827',
              }}
              placeholder="admin@example.com"
              autoComplete="email"
            />
          </label>

          <label className="block">
            <span className="text-gray-700 text-sm font-medium">
              Password
            </span>

            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              className="mt-1 w-full rounded-lg px-3 py-2 outline-none"
              style={{
                backgroundColor: '#F5F5F5',
                border: '1px solid #D1D5DB',
                color: '#111827',
              }}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </label>

          {error && (
            <div
              className="text-sm px-3 py-2 rounded-lg"
              style={{
                backgroundColor: 'rgba(255,107,0,0.12)',
                color: '#FF6B00',
              }}
              role="alert"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 rounded-lg font-semibold transition-transform active:scale-[0.99]"
            style={{
              backgroundColor: '#FF6B00',
              color: 'white',
              padding: '10px 14px',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}