import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { APP_ADMIN_NAME, appTheme, palette } from '../theme';

const toAscii = (value: string) => value.replace(/[^\x00-\x7F]/g, '');

export function LoginPage() {
  const { signIn, loading } = useAuth();
  const { isDark } = useApp();
  const navigate = useNavigate();
  const colors = isDark ? appTheme.dark : appTheme.light;

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
      setError(
        toAscii(
          err?.message ?? 'Login failed. Please check your credentials.',
        ),
      );
    }
  };

  return (
    <div className="w-full flex items-center justify-center py-8">
      <div
        className="w-full max-w-md p-6 rounded-2xl shadow-lg transition-colors"
        style={{
          backgroundColor: colors.cardBackground,
          border: `1px solid ${colors.border}`,
          boxShadow: colors.cardShadow,
        }}
      >
        <h1 className="text-2xl font-bold mb-2" style={{ color: colors.text }}>
          {APP_ADMIN_NAME}
        </h1>

        <p className="text-sm mb-5" style={{ color: colors.mutedText }}>
          Enter your admin credentials to continue.
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium" style={{ color: colors.text }}>
              Email
            </span>

            <input
              value={email}
              onChange={(e) => setEmail(toAscii(e.target.value))}
              type="email"
              required
              className="mt-1 w-full rounded-lg px-3 py-2 outline-none transition-colors"
              style={{
                backgroundColor: colors.surfaceBackground,
                border: `1px solid ${colors.border}`,
                color: colors.text,
              }}
              placeholder="admin@example.com"
              autoComplete="email"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium" style={{ color: colors.text }}>
              Password
            </span>

            <input
              value={password}
              onChange={(e) => setPassword(toAscii(e.target.value))}
              type="password"
              required
              className="mt-1 w-full rounded-lg px-3 py-2 outline-none transition-colors"
              style={{
                backgroundColor: colors.surfaceBackground,
                border: `1px solid ${colors.border}`,
                color: colors.text,
              }}
              placeholder="********"
              autoComplete="current-password"
            />
          </label>

          {error && (
            <div
              className="text-sm px-3 py-2 rounded-lg"
              style={{
                backgroundColor: isDark ? 'rgba(220,38,38,0.18)' : 'rgba(220,38,38,0.12)',
                color: palette.rejected,
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
              backgroundColor: colors.actionAccent,
              color: isDark ? colors.text : '#FFFFFF',
              padding: '10px 14px',
              opacity: loading ? 0.7 : 1,
              boxShadow: isDark
                ? '0 10px 24px rgba(195,142,180,0.2)'
                : '0 10px 24px rgba(134,168,207,0.28)',
            }}
          >
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
