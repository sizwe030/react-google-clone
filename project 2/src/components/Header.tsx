import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu, 
  Search, 
  X, 
  Cog, 
  Grid, 
  List as ListIcon,
  RefreshCw
} from 'lucide-react';
import { useNotes } from '../context/NotesContext';

const Header: React.FC = () => {
  const { 
    toggleSidebar, 
    searchQuery, 
    setSearchQuery 
  } = useNotes();
  
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
    setIsSearchExpanded(true);
  };

  const handleSearchBlur = () => {
    setIsSearchFocused(false);
    if (!searchQuery) {
      setIsSearchExpanded(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setIsSearchExpanded(false);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // Focus search input when expanded
  useEffect(() => {
    if (isSearchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchExpanded]);

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-10 flex items-center px-4">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 mr-4"
            aria-label="Toggle sidebar"
          >
            <Menu size={20} />
          </button>
          
          <div className="flex items-center">
            <div className="w-6 h-6 mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 8.5L12 3.5" />
                <path d="M18.5 10L16.5 7" />
                <path d="M5.5 10L7.5 7" />
                <rect width="14" height="14" x="5" y="10" rx="2" />
              </svg>
            </div>
            <h1 className="text-xl font-medium text-gray-800">Keep</h1>
          </div>
        </div>
        
        <div className={`flex-1 max-w-2xl mx-4 transition-all duration-200 ${isSearchExpanded ? 'mx-4' : 'mx-0'}`}>
          <div 
            className={`relative flex items-center h-12 rounded-lg border border-transparent ${
              isSearchFocused ? 'bg-white border-gray-200 shadow-md' : 'bg-gray-100'
            }`}
          >
            <div className="flex items-center justify-center w-10 h-10 ml-1">
              <Search size={20} className="text-gray-500" />
            </div>
            
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
              className="flex-1 h-full bg-transparent outline-none text-gray-700"
            />
            
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-700"
                aria-label="Clear search"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>
        
        <div className="flex items-center">
          <button
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 mr-1"
            aria-label="Refresh"
          >
            <RefreshCw size={20} />
          </button>
          
          <button
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 mr-1"
            aria-label="Toggle view"
          >
            <Grid size={20} />
          </button>
          
          <button
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100"
            aria-label="Settings"
          >
            <Cog size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;