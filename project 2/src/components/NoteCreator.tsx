import React, { useState, useRef, useEffect } from 'react';
import { CheckSquare, Plus, Palette } from 'lucide-react';
import { useNotes } from '../context/NotesContext';
import { NoteType, ChecklistItem, NoteColor } from '../types';
import ColorPicker from './ColorPicker';

const NoteCreator: React.FC = () => {
  const { createNote } = useNotes();
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [noteType, setNoteType] = useState<NoteType>('note');
  const [listItems, setListItems] = useState<ChecklistItem[]>([]);
  const [newListItem, setNewListItem] = useState('');
  const [color, setColor] = useState<NoteColor>('default');
  const [showColorPicker, setShowColorPicker] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const contentInputRef = useRef<HTMLTextAreaElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };
    
    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded, title, content, listItems]);
  
  const handleNoteTypeChange = (type: NoteType) => {
    setNoteType(type);
    if (type === 'list' && listItems.length === 0) {
      setListItems([
        { id: Date.now().toString(), text: '', isChecked: false }
      ]);
    }
  };
  
  const handleExpand = () => {
    setIsExpanded(true);
    
    // Focus title input after expansion
    setTimeout(() => {
      if (titleInputRef.current) {
        titleInputRef.current.focus();
      }
    }, 100);
  };
  
  const handleAddListItem = () => {
    if (!newListItem.trim()) return;
    
    setListItems([
      ...listItems,
      {
        id: Date.now().toString(),
        text: newListItem,
        isChecked: false,
      },
    ]);
    setNewListItem('');
  };
  
  const handleListItemChange = (id: string, text: string) => {
    setListItems(
      listItems.map((item) => (item.id === id ? { ...item, text } : item))
    );
  };
  
  const handleListItemCheck = (id: string) => {
    setListItems(
      listItems.map((item) => 
        item.id === id ? { ...item, isChecked: !item.isChecked } : item
      )
    );
  };
  
  const handleRemoveListItem = (id: string) => {
    setListItems(listItems.filter((item) => item.id !== id));
  };
  
  const handleClose = () => {
    if (title.trim() || content.trim() || listItems.some(item => item.text.trim())) {
      const filteredListItems = listItems.filter(item => item.text.trim());
      
      createNote({
        type: noteType,
        title: title.trim(),
        content: content.trim(),
        color,
        listItems: noteType === 'list' ? filteredListItems : undefined,
      });
    }
    
    // Reset form
    setIsExpanded(false);
    setTitle('');
    setContent('');
    setColor('default');
    setNoteType('note');
    setListItems([]);
    setNewListItem('');
    setShowColorPicker(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Close note on Escape
    if (e.key === 'Escape') {
      handleClose();
    }
    
    // Save note on Ctrl/Cmd + Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleClose();
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-24 mb-8 px-4">
      <div
        ref={containerRef}
        className={`bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden transition-all duration-200 ${
          isExpanded ? 'shadow-md' : ''
        }`}
        onKeyDown={handleKeyDown}
      >
        {isExpanded && (
          <div className="p-4">
            <input
              ref={titleInputRef}
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-lg font-medium outline-none mb-2"
            />
          </div>
        )}
        
        <div className="p-4 pt-0">
          {!isExpanded ? (
            <div
              onClick={handleExpand}
              className="min-h-[46px] py-2 cursor-text text-gray-600"
            >
              Take a note...
            </div>
          ) : noteType === 'note' ? (
            <textarea
              ref={contentInputRef}
              placeholder="Take a note..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full min-h-[100px] outline-none resize-none"
            />
          ) : (
            <div className="space-y-2">
              {listItems.map((item) => (
                <div key={item.id} className="flex items-center gap-2">
                  <button
                    onClick={() => handleListItemCheck(item.id)}
                    className={`flex-shrink-0 w-5 h-5 rounded border ${
                      item.isChecked
                        ? 'bg-blue-500 border-blue-500 text-white'
                        : 'border-gray-300'
                    }`}
                  >
                    {item.isChecked && (
                      <span className="flex items-center justify-center">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                    )}
                  </button>
                  
                  <input
                    type="text"
                    placeholder="List item"
                    value={item.text}
                    onChange={(e) => handleListItemChange(item.id, e.target.value)}
                    className={`flex-1 outline-none ${
                      item.isChecked ? 'line-through text-gray-500' : ''
                    }`}
                  />
                  
                  <button
                    onClick={() => handleRemoveListItem(item.id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              ))}
              
              <div className="flex items-center gap-2 mt-2">
                <button className="flex-shrink-0 w-5 h-5 rounded border border-transparent text-blue-500">
                  <Plus size={20} />
                </button>
                
                <input
                  type="text"
                  placeholder="List item"
                  value={newListItem}
                  onChange={(e) => setNewListItem(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddListItem();
                    }
                  }}
                  className="flex-1 outline-none"
                />
                
                <button
                  onClick={handleAddListItem}
                  className="text-blue-500 hover:text-blue-600"
                >
                  Add
                </button>
              </div>
            </div>
          )}
        </div>
          
        {isExpanded && (
          <div className="px-2 py-2 flex justify-between items-center border-t border-gray-100">
            <div className="flex items-center space-x-1">
              <div className="relative">
                <button
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                  title="Background options"
                >
                  <Palette size={18} />
                </button>
                
                {showColorPicker && (
                  <div className="absolute bottom-full left-0 mb-1">
                    <ColorPicker
                      selectedColor={color}
                      onChange={(newColor) => {
                        setColor(newColor);
                        setShowColorPicker(false);
                      }}
                      position="top"
                    />
                  </div>
                )}
              </div>
              
              <button
                onClick={() => handleNoteTypeChange(noteType === 'note' ? 'list' : 'note')}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                title={noteType === 'note' ? 'Switch to checklist' : 'Switch to note'}
              >
                <CheckSquare size={18} />
              </button>
            </div>
            
            <button
              onClick={handleClose}
              className="px-4 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteCreator;