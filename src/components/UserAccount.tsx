import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { LogOut, User } from 'lucide-react';

interface GoogleUserInfo {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
  locale: string;
  access_token: string;
}

interface UserAccountProps {
  user: GoogleUserInfo | null;
  onLogin: (response: any) => void;
  onLogout: () => void;
}

export default function UserAccount({ user, onLogin, onLogout }: UserAccountProps) {
  const login = useGoogleLogin({
    onSuccess: onLogin,
    onError: (error) => {
      console.error('Login Failed:', error);
    },
    scope: 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
    flow: 'implicit',
  });

  if (!user) {
    return (
      <button
        onClick={() => login()}
        className="fixed bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50"
      >
        <User size={20} className="text-[#8b7355]" />
        <span>Sign in with Google</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 flex items-center gap-4">
      <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg">
        <img
          src={user.picture}
          alt={user.name}
          className="w-6 h-6 rounded-full"
        />
        <span className="text-sm font-medium">{user.name}</span>
      </div>
      <button
        onClick={onLogout}
        className="p-2 text-gray-500 hover:text-gray-700"
        title="Sign out"
      >
        <LogOut size={20} />
      </button>
    </div>
  );
}