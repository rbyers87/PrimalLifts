import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Dumbbell,
  User,
  Settings,
  Trophy,
  LogOut,
  NotebookPen,
  Home,
  MessageSquare,
  Menu,
  X
} from 'lucide-react';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  if (!user) return null;

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getIconClasses = (path) => {
    const baseStyles = 'h-5 w-5';
    const activeStyles = 'text-indigo-600 dark:text-indigo-400';
    return `${baseStyles} ${isActive(path) ? activeStyles : ''}`;
  };

  const allNavLinks = [
    { path: '/', icon: <Home className={getIconClasses('/')} />, label: 'Home' },
    { path: '/wod', icon: <Dumbbell className={getIconClasses('/wod')} />, label: 'WOD' },
    { path: '/workouts', icon: <NotebookPen className={getIconClasses('/workouts')} />, label: 'Workouts' },
    { path: '/leaderboard', icon: <Trophy className={getIconClasses('/leaderboard')} />, label: 'Leaderboard' },
    { path: '/messageboard', icon: <MessageSquare className={getIconClasses('/messageboard')} />, label: 'Messages' },
    { path: '/profile', icon: <User className={getIconClasses('/profile')} />, label: 'Profile' }
  ];

  return (
    <nav className="bg-transparent shadow-lg dark:bg-transparent">
      <div className="container mx-auto px-4 bg-transparent">
        {/* Top nav bar */}
        <div className="flex items-center justify-between h-16 relative">
          {/* Left: Hamburger button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-md dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Center: App title */}
          <div className="absolute left-1/2 transform -translate-x-1/2 text-lg font-semibold text-gray-800 dark:text-white">
            Primal Lifts
          </div>

          {/* Right: Empty div to balance layout */}
          <div className="w-6 h-6" />
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            {allNavLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`${isActive(link.path)
                  ? 'bg-gray-100 dark:bg-gray-700 text-indigo-600 dark:text-indigo-400'
                  : 'dark:text-gray-300'
                  } block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-50 dark:hover:bg-gray-700`}
                onClick={() => setMenuOpen(false)}
              >
                <div className="flex items-center">
                  {link.icon}
                  <span className="ml-3">{link.label}</span>
                </div>
              </Link>
            ))}

            <div className="border-t border-gray-200 dark:border-gray-700 my-2" />

            <Link
              to="/settings"
              className={`${isActive('/settings')
                ? 'bg-gray-100 dark:bg-gray-700 text-indigo-600 dark:text-indigo-400'
                : 'dark:text-gray-300'
                } block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-50 dark:hover:bg-gray-700`}
              onClick={() => setMenuOpen(false)}
            >
              <div className="flex items-center">
                <Settings className="h-5 w-5" />
                <span className="ml-3">Settings</span>
              </div>
            </Link>

            <button
              onClick={() => {
                setMenuOpen(false);
                handleSignOut();
              }}
              className="w-full text-left dark:text-gray-300 block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <div className="flex items-center">
                <LogOut className="h-5 w-5" />
                <span className="ml-3">Sign Out</span>
              </div>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
