import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, MapPin, Users, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { signOut } = useAuth();

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/locations', icon: MapPin, label: 'Locations' },
    { path: '/users', icon: Users, label: 'Users' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="bg-blue-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out">
      <h1 className="text-2xl font-semibold text-center">Dental SaaS</h1>
      <nav>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center space-x-2 py-2.5 px-4 rounded transition duration-200 ${
              location.pathname === item.path ? 'bg-blue-700' : 'hover:bg-blue-700'
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="absolute bottom-0 w-full p-4">
        <button
          onClick={signOut}
          className="flex items-center space-x-2 w-full py-2.5 px-4 rounded transition duration-200 hover:bg-blue-700"
        >
          <LogOut className="h-5 w-5" />
          <span>Log out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;