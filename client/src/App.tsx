import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { KycRegister } from './pages/KycRegister';
import { PreferenceOnboarding } from './pages/PreferenceOnboarding';
import { Dashboard } from './pages/Dashboard';
import { Library } from './pages/Library';
import { Arcade } from './pages/Arcade';
import { GameArena } from './pages/GameArena';
import { Vault } from './pages/Vault';
import { ParentDashboard } from './pages/ParentDashboard';

function AppContent() {
  const { user, loading } = useAuth();
  
  // Custom router state using browser location pathname & search
  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname || '/');
  const [queryParams, setQueryParams] = useState<URLSearchParams>(new URLSearchParams(window.location.search));

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
      setQueryParams(new URLSearchParams(window.location.search));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (to: string) => {
    const [pathPart, queryPart] = to.split('?');
    window.history.pushState({}, '', to);
    setCurrentPath(pathPart);
    setQueryParams(new URLSearchParams(queryPart || ''));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // While checking token session
  if (loading) {
    return (
      <div className="min-h-screen bg-[#080c16] flex flex-col items-center justify-center space-y-4">
        <div className="w-14 h-14 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <p className="font-epic text-amber-200 tracking-wider text-lg">Opening The Sacred Codex...</p>
      </div>
    );
  }

  // Route Dispatcher
  const renderRoute = () => {
    // Protected Routes Check (Acceptance Criteria 1: User cannot access game modes or stories without completing KYC)
    const isProtected = [
      '/dashboard',
      '/library',
      '/games',
      '/vault/premium',
      '/parent/dashboard',
      '/onboarding/preferences'
    ].some(prefix => currentPath.startsWith(prefix));

    if (isProtected && !user) {
      return <Login navigate={navigate} />;
    }

    if (currentPath === '/') {
      return <Landing navigate={navigate} />;
    }

    if (currentPath === '/auth/login') {
      return <Login navigate={navigate} />;
    }

    if (currentPath === '/auth/register-kyc') {
      return <KycRegister navigate={navigate} />;
    }

    if (currentPath === '/onboarding/preferences') {
      return <PreferenceOnboarding navigate={navigate} />;
    }

    if (currentPath === '/dashboard') {
      return <Dashboard navigate={navigate} />;
    }

    if (currentPath === '/library') {
      return <Library navigate={navigate} />;
    }

    if (currentPath === '/games') {
      return <Arcade navigate={navigate} />;
    }

    if (currentPath.startsWith('/games/play/')) {
      const parts = currentPath.split('/');
      const gameId = parts[3] || 'TRIVIA';
      const categoryParam = queryParams.get('category') || undefined;
      return <GameArena gameId={gameId} categoryParam={categoryParam} navigate={navigate} />;
    }

    if (currentPath === '/vault/premium') {
      return <Vault navigate={navigate} />;
    }

    if (currentPath === '/parent/dashboard') {
      return <ParentDashboard navigate={navigate} />;
    }

    // Default Fallback
    return <Landing navigate={navigate} />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080c16] text-slate-100">
      <Navbar currentPath={currentPath} navigate={navigate} />
      <main className="flex-grow">
        {renderRoute()}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
