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
        className="w-full max-w-md p-5 rounded-xl"
        style={{
          backgroundColor: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.15)',
        }}
      >
        <h1 className="text-white text-xl font-semibold mb-2">Admin Login</h1>
        <p className="text-white/60 text-sm mb-4">Enter your Supabase admin account credentials.</p>

        <form onSubmit={onSubmit} className="space-y-3">
          <label className="block">
            <span className="text-white/80 text-sm">Email</span>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              className="mt-1 w-full rounded-lg px-3 py-2 outline-none"
              style={{
                backgroundColor: 'rgba(0,0,0,0.25)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: 'white',
              }}
              placeholder="admin@example.com"
              autoComplete="email"
            />
          </label>

          <label className="block">
            <span className="text-white/80 text-sm">Password</span>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              className="mt-1 w-full rounded-lg px-3 py-2 outline-none"
              style={{
                backgroundColor: 'rgba(0,0,0,0.25)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: 'white',
              }}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </label>

          {error && (
            <div
              className="text-sm px-3 py-2 rounded-lg"
              style={{ backgroundColor: 'rgba(255,107,0,0.15)', color: '#FF6B00' }}
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
