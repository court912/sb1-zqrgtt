import React from 'react';
import { Bell, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Header: React.FC = () => {
  const { user } = useAuth();

  return (
    <header className="bg-white shadow-md py-4 px-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Welcome, {user?.name}</h2>
        <div className="flex items-center space-x-4">
          <button className="text-gray-600 hover:text-gray-800">
            <Bell className="h-6 w-6" />
          </button>
          <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
            <User className="h-6 w-6" />
            <span>{user?.email}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;