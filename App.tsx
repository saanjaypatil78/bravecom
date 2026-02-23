import React, { useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { Analytics } from '@vercel/analytics/react';

const TIMEOUT_MS = 15 * 60 * 1000; // 15 Minutes

const AppContent = () => {
  const { user, loading, signOut } = useAuth();

  // Auto-Logout Logic
  useEffect(() => {
    if (!user) return;

    let timeoutId: ReturnType<typeof setTimeout>;

    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        // Auto logout
        signOut();
        alert("Session timed out due to inactivity.");
      }, TIMEOUT_MS);
    };

    // Events to track activity
    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];
    
    // Initial start
    resetTimer();

    // Attach listeners
    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [user, signOut]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
          <p className="text-slate-400 font-['Rajdhani'] tracking-widest uppercase">Authenticating...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {!user ? (
        <LandingPage />
      ) : (
        <Dashboard onLogout={signOut} />
      )}
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
      <Analytics />
    </AuthProvider>
  );
};

export default App;
