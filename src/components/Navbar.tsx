import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Dumbbell, 
  User, 
  Settings, 
  Trophy, 
  LogOut, 
  NotebookPen, 
  Home, 
  MessageSquare 
} from 'lucide-react';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  if (!user) return null;
  
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="bg-transparent shadow-lg dark:bg-transparent">
      <div className="container mx-auto px-4 bg-transparent">
        <div className="flex justify-center items-center h-16 relative">
          {/* Home icon on the left */}
          <Link 
            to="/" 
            className="absolute left-0 flex items-center"
          >
            <Home className="h-6 w-6 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400" />
          </Link>
          
          {/* Main navigation links - centered */}
          <div className="flex items-center space-x-8 mx-auto">
            <Link
              to="/wod"
              className="dark:text-gray-300 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium dark:hover:text-indigo-400 flex flex-col items-center"
            >
              <Dumbbell className="h-5 w-5" />
              <span className="text-xs mt-1">WOD</span>
            </Link>
            
            <Link
              to="/workouts"
              className="dark:text-gray-300 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium dark:hover:text-indigo-400 flex flex-col items-center"
            >
              <NotebookPen className="h-5 w-5" />
              <span className="text-xs mt-1">Workouts</span>
            </Link>
            
            <Link
              to="/leaderboard"
              className="dark:text-gray-300 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium dark:hover:text-indigo-400 flex flex-col items-center"
            >
              <Trophy className="h-5 w-5" />
              <span className="text-xs mt-1">Leaderboard</span>
            </Link>
            
            <Link
              to="/messageboard"
              className="dark:text-gray-300 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium dark:hover:text-indigo-400 flex flex-col items-center"
            >
              <MessageSquare className="h-5 w-5" />
              <span className="text-xs mt-1">Messages</span>
            </Link>
          </div>
          
          {/* User controls on the right */}
          <div className="absolute right-0 flex items-center space-x-4">
            <Link
              to="/profile"
              className="dark:text-gray-300 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium dark:hover:text-indigo-400"
            >
              <User className="h-5 w-5" />
            </Link>
            
            <Link
              to="/settings"
              className="dark:text-gray-300 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium dark:hover:text-indigo-400"
            >
              <Settings className="h-5 w-5" />
            </Link>
            
            <button
              onClick={handleSignOut}
              className="dark:text-gray-300 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium dark:hover:text-indigo-400"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
