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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
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

  // All navigation links including home
  const allNavLinks = [
    { path: "/", icon: <Home className={getIconClasses("/")} />, label: "Home" },
    { path: "/wod", icon: <Dumbbell className={getIconClasses("/wod")} />, label: "WOD" },
    { path: "/workouts", icon: <NotebookPen className={getIconClasses("/workouts")} />, label: "Workouts" },
    { path: "/leaderboard", icon: <Trophy className={getIconClasses("/leaderboard")} />, label: "Leaderboard" },
    { path: "/messageboard", icon: <MessageSquare className={getIconClasses("/messageboard")} />, label: "Messages" },
    { path: "/profile", icon: <User className={getIconClasses("/profile")} />, label: "Profile" }
  ];
  
  // Main navigation links (excluding home for desktop view)
  const mainNavLinks = allNavLinks.slice(1);
  
  return (
    <nav className="bg-transparent shadow-lg dark:bg-transparent">
      <div className="container mx-auto px-4 bg-transparent">
        {/* Desktop Navigation */}
        <div className="hidden md:flex justify-center items-center h-16 relative">
          {/* Home icon on the left */}
          <Link 
            to="/" 
            className={`absolute left-0 flex items-center ${isActive("/") ? "text-indigo-600 dark:text-indigo-400" : "dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"}`}
          >
            <Home className="h-6 w-6" />
          </Link>
          
          {/* Main navigation links - centered */}
          <div className="flex items-center space-x-8 mx-auto">
            {mainNavLinks.map((link) => (
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
            <Link
              to="/profile"
              className={`${isActive("/profile") ? "text-indigo-600 dark:text-indigo-400" : "dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"} px-3 py-2 rounded-md text-sm font-medium`}
            >
              <User className="h-5 w-5" />
            </Link>
            
            <Link
              to="/settings"
              className={`${isActive("/settings") ? "text-indigo-600 dark:text-indigo-400" : "dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"} px-3 py-2 rounded-md text-sm font-medium`}
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
        
        {/* Mobile Navigation */}
        <div className="md:hidden">
          <div className="flex justify-between items-center h-16">
            {/* Hamburger menu button on the left */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            
            {/* App Title or Logo in center */}
            <div className="text-lg font-semibold text-gray-800 dark:text-white">
              Primal Lifts
            </div>
            

            {/* User profile on the right */}
            <Link
              to="/profile"
              className={`p-2 ${isActive("/profile") ? "text-indigo-600 dark:text-indigo-400" : "text-gray-600 dark:text-gray-300"}`}
            >
              <User className="h-6 w-6" />
            </Link>
          </div>


          
          {/* Mobile menu dropdown */}
          {mobileMenuOpen && (
            <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              {/* Include Home in the menu */}
              {allNavLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`${isActive(link.path) ? "bg-gray-100 dark:bg-gray-700 text-indigo-600 dark:text-indigo-400" : "dark:text-gray-300"} block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-50 dark:hover:bg-gray-700`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center">
                    {link.icon}
                    <span className="ml-3">{link.label}</span>
                  </div>
                </Link>
              ))}
              
              <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
              
              <Link
                to="/settings"
                className={`${isActive("/settings") ? "bg-gray-100 dark:bg-gray-700 text-indigo-600 dark:text-indigo-400" : "dark:text-gray-300"} block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-50 dark:hover:bg-gray-700`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center">
                  <Settings className="h-5 w-5" />
                  <span className="ml-3">Settings</span>
                </div>
              </Link>
              
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
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
      </div>
    </nav>
  );
}
