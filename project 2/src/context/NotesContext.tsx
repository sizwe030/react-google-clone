import React, { createContext, useContext, useEffect, useState } from 'react';
import { NoteItem, Label, NoteColor, ChecklistItem } from '../types';

interface NotesContextType {
  notes: NoteItem[];
  labels: Label[];
  activeLabel: string | null;
  searchQuery: string;
  view: 'notes' | 'archive' | 'trash' | 'label';
  showSidebar: boolean;
  toggleSidebar: () => void;
  createNote: (note: Partial<NoteItem>) => void;
  updateNote: (id: string, updates: Partial<NoteItem>) => void;
  deleteNote: (id: string) => void;
  togglePinned: (id: string) => void;
  toggleArchived: (id: string) => void;
  toggleTrashed: (id: string) => void;
  restoreNote: (id: string) => void;
  permanentlyDeleteNote: (id: string) => void;
  changeNoteColor: (id: string, color: NoteColor) => void;
  addLabel: (name: string) => void;
  removeLabel: (id: string) => void;
  toggleLabelOnNote: (noteId: string, labelId: string) => void;
  setActiveLabel: (labelId: string | null) => void;
  setSearchQuery: (query: string) => void;
  setView: (view: 'notes' | 'archive' | 'trash' | 'label') => void;
  addChecklistItem: (noteId: string, text: string) => void;
  toggleChecklistItem: (noteId: string, itemId: string) => void;
  updateChecklistItem: (noteId: string, itemId: string, text: string) => void;
  removeChecklistItem: (noteId: string, itemId: string) => void;
}

const NotesContext = createContext<NotesContextType | null>(null);

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notes, setNotes] = useState<NoteItem[]>(() => {
    const savedNotes = localStorage.getItem('notes');
    return savedNotes ? JSON.parse(savedNotes) : [];
  });
  
  const [labels, setLabels] = useState<Label[]>(() => {
    const savedLabels = localStorage.getItem('labels');
    return savedLabels ? JSON.parse(savedLabels) : [];
  });
  
  const [activeLabel, setActiveLabel] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [view, setView] = useState<'notes' | 'archive' | 'trash' | 'label'>('notes');
  const [showSidebar, setShowSidebar] = useState<boolean>(true);

  // Save to localStorage whenever notes or labels change
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('labels', JSON.stringify(labels));
  }, [labels]);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  };

  const createNote = (note: Partial<NoteItem>) => {
    const newNote: NoteItem = {
      id: generateId(),
      type: note.type || 'note',
      title: note.title || '',
      content: note.content || '',
      color: note.color || 'default',
      isPinned: note.isPinned || false,
      isArchived: note.isArchived || false,
      isTrashed: note.isTrashed || false,
      labels: note.labels || [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      listItems: note.type === 'list' ? note.listItems || [] : undefined,
    };
    
    setNotes((prev) => [newNote, ...prev]);
  };

  const updateNote = (id: string, updates: Partial<NoteItem>) => {
    setNotes((prev) => 
      prev.map((note) => 
        note.id === id 
          ? { ...note, ...updates, updatedAt: Date.now() } 
          : note
      )
    );
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => 
      prev.map((note) => 
        note.id === id 
          ? { ...note, isTrashed: true, updatedAt: Date.now() } 
          : note
      )
    );
  };

  const togglePinned = (id: string) => {
    setNotes((prev) => 
      prev.map((note) => 
        note.id === id 
          ? { ...note, isPinned: !note.isPinned, updatedAt: Date.now() } 
          : note
      )
    );
  };

  const toggleArchived = (id: string) => {
    setNotes((prev) => 
      prev.map((note) => 
        note.id === id 
          ? { 
              ...note, 
              isArchived: !note.isArchived, 
              isPinned: false, // Remove pin when archiving
              updatedAt: Date.now() 
            } 
          : note
      )
    );
  };

  const toggleTrashed = (id: string) => {
    setNotes((prev) => 
      prev.map((note) => 
        note.id === id 
          ? { 
              ...note, 
              isTrashed: !note.isTrashed, 
              isPinned: false, // Remove pin when trashing
              updatedAt: Date.now() 
            } 
          : note
      )
    );
  };

  const restoreNote = (id: string) => {
    setNotes((prev) => 
      prev.map((note) => 
        note.id === id 
          ? { 
              ...note, 
              isTrashed: false, 
              updatedAt: Date.now() 
            } 
          : note
      )
    );
  };

  const permanentlyDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  };

  const changeNoteColor = (id: string, color: NoteColor) => {
    setNotes((prev) => 
      prev.map((note) => 
        note.id === id 
          ? { ...note, color, updatedAt: Date.now() } 
          : note
      )
    );
  };

  const addLabel = (name: string) => {
    // Don't add if label with same name already exists
    if (labels.some((label) => label.name.toLowerCase() === name.toLowerCase())) {
      return;
    }
    
    const newLabel: Label = {
      id: generateId(),
      name,
    };
    
    setLabels((prev) => [...prev, newLabel]);
  };

  const removeLabel = (id: string) => {
    setLabels((prev) => prev.filter((label) => label.id !== id));
    
    // Also remove this label from all notes
    setNotes((prev) => 
      prev.map((note) => ({
        ...note,
        labels: note.labels.filter((labelId) => labelId !== id),
      }))
    );
  };

  const toggleLabelOnNote = (noteId: string, labelId: string) => {
    setNotes((prev) => 
      prev.map((note) => {
        if (note.id !== noteId) return note;
        
        const hasLabel = note.labels.includes(labelId);
        const updatedLabels = hasLabel
          ? note.labels.filter((id) => id !== labelId)
          : [...note.labels, labelId];
        
        return {
          ...note,
          labels: updatedLabels,
          updatedAt: Date.now(),
        };
      })
    );
  };

  const addChecklistItem = (noteId: string, text: string) => {
    if (!text.trim()) return;
    
    const newItem: ChecklistItem = {
      id: generateId(),
      text,
      isChecked: false,
    };
    
    setNotes((prev) => 
      prev.map((note) => {
        if (note.id !== noteId) return note;
        
        return {
          ...note,
          listItems: [...(note.listItems || []), newItem],
          updatedAt: Date.now(),
        };
      })
    );
  };

  const toggleChecklistItem = (noteId: string, itemId: string) => {
    setNotes((prev) => 
      prev.map((note) => {
        if (note.id !== noteId || !note.listItems) return note;
        
        return {
          ...note,
          listItems: note.listItems.map((item) => 
            item.id === itemId 
              ? { ...item, isChecked: !item.isChecked } 
              : item
          ),
          updatedAt: Date.now(),
        };
      })
    );
  };

  const updateChecklistItem = (noteId: string, itemId: string, text: string) => {
    setNotes((prev) => 
      prev.map((note) => {
        if (note.id !== noteId || !note.listItems) return note;
        
        return {
          ...note,
          listItems: note.listItems.map((item) => 
            item.id === itemId 
              ? { ...item, text } 
              : item
          ),
          updatedAt: Date.now(),
        };
      })
    );
  };

  const removeChecklistItem = (noteId: string, itemId: string) => {
    setNotes((prev) => 
      prev.map((note) => {
        if (note.id !== noteId || !note.listItems) return note;
        
        return {
          ...note,
          listItems: note.listItems.filter((item) => item.id !== itemId),
          updatedAt: Date.now(),
        };
      })
    );
  };

  const value: NotesContextType = {
    notes,
    labels,
    activeLabel,
    searchQuery,
    view,
    showSidebar,
    toggleSidebar,
    createNote,
    updateNote,
    deleteNote,
    togglePinned,
    toggleArchived,
    toggleTrashed,
    restoreNote,
    permanentlyDeleteNote,
    changeNoteColor,
    addLabel,
    removeLabel,
    toggleLabelOnNote,
    setActiveLabel,
    setSearchQuery,
    setView,
    addChecklistItem,
    toggleChecklistItem,
    updateChecklistItem,
    removeChecklistItem,
  };

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
};