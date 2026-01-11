import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import About from './pages/About';
import Roadmap from './pages/Roadmap';

interface GoogleUser {
  name: string;
  picture: string;
  email: string;
  access_token?: string;
  isGuest?: boolean;
}

export default function App() {
  const [user, setUser] = useState<GoogleUser | null>(() => {
    const savedUser = localStorage.getItem('wsdm_user_session');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            'Authorization': `Bearer ${tokenResponse.access_token}`,
          },
        });

        if (!userInfoResponse.ok) {
          throw new Error('Failed to fetch user info');
        }

        const userInfo = await userInfoResponse.json();
        const newUser = {
          name: userInfo.name,
          picture: userInfo.picture,
          email: userInfo.email,
          access_token: tokenResponse.access_token,
        };

        setUser(newUser);
        localStorage.setItem('wsdm_user_session', JSON.stringify(newUser));
      } catch (error) {
        console.error('Authentication error:', error);
      }
    },
    onError: (error) => console.error('Login failed:', error),
    scope: 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
  });

  const handleGuestLogin = () => {
    const guestUser = {
      name: 'Guest User',
      picture: `https://ui-avatars.com/api/?name=Guest+User&background=random&size=128`,
      email: 'guest@example.com',
      isGuest: true,
    };
    setUser(guestUser);
    localStorage.setItem('wsdm_user_session', JSON.stringify(guestUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('wsdm_user_session');

    // Clear other local storage only if really needed, but keeping offline notes for guest might be desired behavior
    // For now, we just clear the session.
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LandingPage onLogin={login} onGuestLogin={handleGuestLogin} />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            user ? (
              <Dashboard user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/about" element={<About />} />
        <Route path="/roadmap" element={<Roadmap />} />
      </Routes>
    </Router>
  );
}