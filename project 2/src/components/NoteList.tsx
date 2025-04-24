import React from 'react';
import { useNotes } from '../context/NotesContext';
import NoteCard from './NoteCard';

const NoteList: React.FC = () => {
  const { 
    notes, 
    view, 
    activeLabel, 
    searchQuery,
    labels
  } = useNotes();
  
  const filteredNotes = notes.filter((note) => {
    // Filter by search query first
    if (
      searchQuery &&
      !note.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !note.content.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !(note.listItems?.some((item) => 
        item.text.toLowerCase().includes(searchQuery.toLowerCase())
      ))
    ) {
      return false;
    }
    
    // Then apply view-specific filters
    if (view === 'notes') {
      return !note.isArchived && !note.isTrashed;
    } else if (view === 'archive') {
      return note.isArchived && !note.isTrashed;
    } else if (view === 'trash') {
      return note.isTrashed;
    } else if (view === 'label' && activeLabel) {
      return !note.isArchived && !note.isTrashed && note.labels.includes(activeLabel);
    }
    
    return true;
  });
  
  // Further split into pinned and unpinned notes
  const pinnedNotes = filteredNotes.filter((note) => note.isPinned);
  const unpinnedNotes = filteredNotes.filter((note) => !note.isPinned);
  
  const getViewTitle = () => {
    if (searchQuery) {
      return `Search results for "${searchQuery}"`;
    }
    
    switch (view) {
      case 'notes':
        return 'Notes';
      case 'archive':
        return 'Archive';
      case 'trash':
        return 'Trash';
      case 'label':
        if (activeLabel) {
          const label = labels.find((l) => l.id === activeLabel);
          return label ? label.name : 'Label';
        }
        return 'Label';
      default:
        return 'Notes';
    }
  };
  
  return (
    <div className="mt-8 pb-16">
      {searchQuery && filteredNotes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No matching notes found</p>
        </div>
      )}
      
      {view === 'trash' && (
        <div className="max-w-5xl mx-auto px-4 mb-6">
          <div className="bg-gray-100 rounded-lg p-4 text-sm text-gray-700">
            Notes in Trash are deleted after 7 days.
          </div>
        </div>
      )}
      
      {/* Pinned notes section */}
      {pinnedNotes.length > 0 && (
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
            Pinned
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
            {pinnedNotes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        </div>
      )}
      
      {/* Unpinned notes section */}
      {unpinnedNotes.length > 0 && (
        <div className="max-w-5xl mx-auto px-4">
          {pinnedNotes.length > 0 && (
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
              Others
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {unpinnedNotes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        </div>
      )}
      
      {/* Empty state */}
      {filteredNotes.length === 0 && !searchQuery && (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-28 h-28 mb-6 flex items-center justify-center text-gray-300">
            {view === 'notes' && (
              <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 8.5L12 3.5" />
                <path d="M18.5 10L16.5 7" />
                <path d="M5.5 10L7.5 7" />
                <rect width="14" height="14" x="5" y="10" rx="2" />
              </svg>
            )}
            {view === 'archive' && (
              <svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="5" x="2" y="3" rx="1" />
                <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" />
                <path d="M10 12h4" />
              </svg>
            )}
            {view === 'trash' && (
              <svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              </svg>
            )}
            {view === 'label' && (
              <svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
                <path d="M7 7h.01" />
              </svg>
            )}
          </div>
          <p className="text-xl text-gray-600 mb-2">No {getViewTitle().toLowerCase()} here</p>
          <p className="text-gray-500">
            {view === 'notes' && "Notes you add appear here"}
            {view === 'archive' && "Archived notes appear here"}
            {view === 'trash' && "Notes in Trash appear here"}
            {view === 'label' && "Notes with this label appear here"}
          </p>
        </div>
      )}
    </div>
  );
};

export default NoteList;