import React, { useState } from 'react';
import { Compass, X, ArrowRight, CheckCircle2, Sparkles, Lock, User, Mail } from 'lucide-react';

export interface AuthUserData {
  name: string;
  email?: string;
}

interface AuthModalProps {
  initialMode: 'login' | 'register';
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (userData?: AuthUserData) => void;
  onSwitchToJourney?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  initialMode,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Keep internal mode in sync with prop if changed
  React.useEffect(() => {
    setMode(initialMode);
    setSuccessMessage(null);
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = fullName.trim() || 'Raahi Explorer';
    const trimmedEmail = email.trim();

    // 1. Store in local registered users database
    try {
      const existingRaw = localStorage.getItem('raahi_registered_users');
      const list = existingRaw ? JSON.parse(existingRaw) : [];
      const updated = list.filter((u: any) => u.email?.toLowerCase() !== trimmedEmail.toLowerCase());
      updated.push({
        name: trimmedName,
        email: trimmedEmail,
        password: password,
        registeredAt: new Date().toISOString(),
      });
      localStorage.setItem('raahi_registered_users', JSON.stringify(updated));
    } catch (err) {
      console.warn('Could not store registered user in local storage:', err);
    }

    // 2. Direct user to Login as requested: "once we register then we have to log in"
    setMode('login');
    setEmail(trimmedEmail || trimmedName);
    setPassword('');
    setSuccessMessage(`Account created for ${trimmedName}! Please log in to enter your trip requirements.`);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const inputVal = email.trim();
    let resolvedName = inputVal.includes('@') ? inputVal.split('@')[0] : inputVal;

    // Check if user was registered previously
    try {
      const existingRaw = localStorage.getItem('raahi_registered_users');
      if (existingRaw) {
        const list = JSON.parse(existingRaw);
        const found = list.find(
          (u: any) =>
            u.email?.toLowerCase() === inputVal.toLowerCase() ||
            u.name?.toLowerCase() === inputVal.toLowerCase()
        );
        if (found && found.name) {
          resolvedName = found.name;
        }
      }
    } catch {}

    const userData: AuthUserData = {
      name: resolvedName || 'Raahi Explorer',
      email: inputVal,
    };

    try {
      localStorage.setItem(
        'raahi_auth_user',
        JSON.stringify({
          ...userData,
          isLoggedIn: true,
          loggedInAt: new Date().toISOString(),
        })
      );
    } catch (err) {
      console.warn('Could not store auth session:', err);
    }

    onSuccess(userData);
  };

  const handleGoogleLogin = () => {
    const userData: AuthUserData = {
      name: 'Aarav Sharma',
      email: 'aarav.sharma@example.com',
    };
    try {
      localStorage.setItem(
        'raahi_auth_user',
        JSON.stringify({
          ...userData,
          isLoggedIn: true,
          loggedInAt: new Date().toISOString(),
        })
      );
    } catch {}
    onSuccess(userData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0E0924]/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-[#FDF6E9] text-[#120D31] rounded-3xl p-7 sm:p-9 shadow-2xl border-2 border-[#120D31] relative overflow-hidden"
        style={{ boxShadow: '0 25px 50px -12px rgba(18, 13, 49, 0.45)' }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-[#120D31]/5 hover:bg-[#120D31]/10 flex items-center justify-center text-[#120D31] transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Header */}
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-9 h-9 rounded-xl bg-[#7D1921] flex items-center justify-center shadow-sm">
            <Compass className="w-5 h-5 text-[#F9D48B]" />
          </div>
          <span className="font-heading font-black italic text-xl tracking-wider text-[#7D1921]">
            RAAHI
          </span>
        </div>

        {/* Success Banner if redirected from registration */}
        {successMessage && (
          <div className="mb-5 p-3 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-start gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="leading-snug">{successMessage}</p>
          </div>
        )}

        {mode === 'login' ? (
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#120D31] tracking-tight">
              Login to Plan Trip
            </h2>
            <p className="text-xs sm:text-sm text-[#120D31]/60 mt-1.5 mb-5 font-medium">
              Log in to store your personalized itineraries and explore cultural trails.
            </p>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#120D31] block mb-1.5">
                  Name or Email Address
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#120D31]/40 absolute left-4 top-3.5" />
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. Aarav Sharma or you@example.com"
                    className="w-full bg-[#120D31]/4 border-2 border-[#120D31]/15 focus:border-[#7D1921] rounded-2xl pl-11 pr-4 py-3 text-sm font-medium text-[#120D31] outline-none transition-colors placeholder:text-[#120D31]/30"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#120D31] block mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#120D31]/40 absolute left-4 top-3.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#120D31]/4 border-2 border-[#120D31]/15 focus:border-[#7D1921] rounded-2xl pl-11 pr-4 py-3 text-sm font-medium text-[#120D31] outline-none transition-colors placeholder:text-[#120D31]/30"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#F9D48B] hover:bg-[#fedd9b] active:scale-[0.98] text-[#171009] font-heading font-black py-3.5 rounded-2xl text-sm transition-transform shadow-sm flex items-center justify-center gap-2 cursor-pointer border-2 border-[#120D31]/10 mt-2"
              >
                <span>Log In &amp; Continue to Trip Planner</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </form>

            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-[#120D31]/12" />
              <span className="text-[11px] font-bold text-[#120D31]/40">OR</span>
              <div className="flex-1 h-px bg-[#120D31]/12" />
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 border-2 border-[#120D31]/15 hover:bg-[#120D31]/5 text-[#120D31] transition-colors cursor-pointer"
            >
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l6-6C34.6 5.1 29.6 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.4-.1-2.5-.4-3.5z" />
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.4 18.9 12 24 12c3.1 0 5.8 1.1 8 3l6-6C34.6 5.1 29.6 3 24 3 16.3 3 9.6 7.3 6.3 14.7z" />
                <path fill="#4CAF50" d="M24 45c5.5 0 10.4-2.1 14.2-5.6l-6.6-5.4C29.6 35.6 26.9 36.5 24 36.5c-5.3 0-9.7-3.1-11.4-7.6l-6.6 5.1C9.5 40.6 16.2 45 24 45z" />
                <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.4-2.4 4.4-4.5 5.8l6.6 5.4C41.7 35.9 45 30.6 45 24c0-1.4-.1-2.5-.4-3.5z" />
              </svg>
              <span>Continue with Google</span>
            </button>

            <p className="text-center text-xs text-[#120D31]/70 font-semibold mt-5">
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setSuccessMessage(null);
                }}
                className="text-[#7D1921] font-black hover:underline cursor-pointer"
              >
                Register here
              </button>
            </p>
          </div>
        ) : (
          <div>
            <span className="inline-block text-[10px] font-extrabold tracking-wider px-3 py-1 rounded-full bg-[#7D1921]/10 text-[#7D1921] uppercase mb-2">
              STEP 1: REGISTRATION
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#120D31] tracking-tight">
              Register New Account
            </h2>
            <p className="text-xs sm:text-sm text-[#120D31]/60 mt-1.5 mb-5 font-medium">
              Create your identity once, then log in to plan trips and build itineraries.
            </p>

            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#120D31] block mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#120D31]/40 absolute left-4 top-3.5" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full bg-[#120D31]/4 border-2 border-[#120D31]/15 focus:border-[#7D1921] rounded-2xl pl-11 pr-4 py-3 text-sm font-medium text-[#120D31] outline-none transition-colors placeholder:text-[#120D31]/30"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#120D31] block mb-1.5">
                  Email or Username
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#120D31]/40 absolute left-4 top-3.5" />
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. aarav@example.com"
                    className="w-full bg-[#120D31]/4 border-2 border-[#120D31]/15 focus:border-[#7D1921] rounded-2xl pl-11 pr-4 py-3 text-sm font-medium text-[#120D31] outline-none transition-colors placeholder:text-[#120D31]/30"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#120D31] block mb-1.5">
                  Create Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#120D31]/40 absolute left-4 top-3.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#120D31]/4 border-2 border-[#120D31]/15 focus:border-[#7D1921] rounded-2xl pl-11 pr-4 py-3 text-sm font-medium text-[#120D31] outline-none transition-colors placeholder:text-[#120D31]/30"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#F9D48B] hover:bg-[#fedd9b] active:scale-[0.98] text-[#171009] font-heading font-black py-3.5 rounded-2xl text-sm transition-transform shadow-sm flex items-center justify-center gap-2 cursor-pointer border-2 border-[#120D31]/10 mt-2"
              >
                <span>Register &amp; Proceed to Login</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </form>

            <p className="text-center text-xs text-[#120D31]/70 font-semibold mt-5">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setSuccessMessage(null);
                }}
                className="text-[#7D1921] font-black hover:underline cursor-pointer"
              >
                Log in here
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
