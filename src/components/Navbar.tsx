import React from 'react';
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
  MoreHorizontal
} from 'lucide-react';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if current route is active
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

  // Common active and inactive styles
  const getNavLinkClasses = (path) => {
    const baseStyles = "px-3 py-2 rounded-md text-sm font-medium flex flex-col items-center";
    const activeStyles = "text-indigo-600 dark:text-indigo-400";
    const inactiveStyles = "dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400";
    
    return `${baseStyles} ${isActive(path) ? activeStyles : inactiveStyles}`;
  };
  
  const getIconClasses = (path) => {
    const baseStyles = "h-5 w-5";
    const activeStyles = "text-indigo-600 dark:text-indigo-400";
    
    return `${baseStyles} ${isActive(path) ? activeStyles : ""}`;
  };

  // Main navigation links
  const navLinks = [
    { path: "/", icon: <Home className={getIconClasses("/")} />, label: "Home" },
    { path: "/wod", icon: <Dumbbell className={getIconClasses("/wod")} />, label: "WOD" },
    { path: "/workouts", icon: <NotebookPen className={getIconClasses("/workouts")} />, label: "Workouts" },
    { path: "/leaderboard", icon: <Trophy className={getIconClasses("/leaderboard")} />, label: "Leaderboard" },
    { path: "/messageboard", icon: <MessageSquare className={getIconClasses("/messageboard")} />, label: "Messages" }
  ];
  
  // Account navigation links
  const accountLinks = [
    { path: "/profile", icon: <User className={getIconClasses("/profile")} />, label: "Profile" },
    { path: "/settings", icon: <Settings className={getIconClasses("/settings")} />, label: "Settings" }
  ];
  
  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:block bg-transparent shadow-lg dark:bg-transparent">
        <div className="container mx-auto px-4 bg-transparent">
          <div className="flex justify-center items-center h-16 relative">
            {/* Home icon on the left */}
            <Link 
              to="/" 
              className={`absolute left-0 flex items-center ${isActive("/") ? "text-indigo-600 dark:text-indigo-400" : "dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"}`}
            >
              <Home className="h-6 w-6" />
            </Link>
            
            {/* Main navigation links - centered (excluding Home which is on the left) */}
            <div className="flex items-center space-x-8 mx-auto">
              {navLinks.slice(1).map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={getNavLinkClasses(link.path)}
                >
                  {link.icon}
                  <span className="text-xs mt-1">{link.label}</span>
                </Link>
              ))}
            </div>
            
            {/* User controls on the right */}
            <div className="absolute right-0 flex items-center space-x-4">
              {accountLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`${isActive(link.path) ? "text-indigo-600 dark:text-indigo-400" : "dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"} px-3 py-2 rounded-md text-sm font-medium`}
                >
                  {link.icon}
                </Link>
              ))}
              
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
        
      {/* Mobile Navigation - Simple Bottom Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg z-10">
        <div className="grid grid-cols-5 h-16">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex flex-col items-center justify-center ${
                isActive(link.path) 
                  ? "text-indigo-600 dark:text-indigo-400" 
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {React.cloneElement(link.icon, { 
                className: isActive(link.path) 
                  ? "h-6 w-6 text-indigo-600 dark:text-indigo-400" 
                  : "h-6 w-6 text-gray-500 dark:text-gray-400" 
              })}
              <span className="text-xs mt-1">{link.label}</span>
            </Link>
          ))}
          
          {/* More menu */}
          <div className="relative group">
            <Link
              to="/profile"
              className={`flex flex-col items-center justify-center ${
                isActive("/profile") || isActive("/settings") 
                  ? "text-indigo-600 dark:text-indigo-400" 
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              <User className={`h-6 w-6 ${
                isActive("/profile") 
                  ? "text-indigo-600 dark:text-indigo-400" 
                  : "text-gray-500 dark:text-gray-400"
              }`} />
              <span className="text-xs mt-1">Profile</span>
            </Link>
          </div>
        </div>
      </nav>
      
      {/* Add padding to the bottom of the page on mobile to prevent content from being hidden behind the navbar */}
      <div className="md:hidden h-16"></div>
    </>
  );
}
