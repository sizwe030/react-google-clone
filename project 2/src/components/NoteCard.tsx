import React, { useState, useRef } from 'react';
import { Pin, Archive, Trash2, Tag, MoreVertical } from 'lucide-react';
import { NoteItem } from '../types';
import { useNotes } from '../context/NotesContext';
import { getColorClass } from '../utils/colors';
import ColorPicker from './ColorPicker';

interface NoteCardProps {
  note: NoteItem;
}

const NoteCard: React.FC<NoteCardProps> = ({ note }) => {
  const { 
    updateNote, 
    togglePinned, 
    toggleArchived, 
    toggleTrashed,
    restoreNote,
    permanentlyDeleteNote,
    changeNoteColor,
    labels,
    toggleLabelOnNote,
    addChecklistItem,
    toggleChecklistItem,
    updateChecklistItem,
    removeChecklistItem
  } = useNotes();
  
  const [isEditing, setIsEditing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showLabels, setShowLabels] = useState(false);
  const [editedTitle, setEditedTitle] = useState(note.title);
  const [editedContent, setEditedContent] = useState(note.content);
  const [newListItemText, setNewListItemText] = useState('');
  const [editedListItems, setEditedListItems] = useState(note.listItems || []);
  
  const menuRef = useRef<HTMLDivElement>(null);
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);
  
  const handleEdit = () => {
    setIsEditing(true);
    setEditedTitle(note.title);
    setEditedContent(note.content);
    setEditedListItems(note.listItems || []);
  };
  
  const handleSave = () => {
    // Filter out empty list items
    const filteredListItems = editedListItems.filter(item => item.text.trim());
    
    updateNote(note.id, {
      title: editedTitle,
      content: editedContent,
      listItems: note.type === 'list' ? filteredListItems : undefined,
    });
    
    setIsEditing(false);
  };
  
  const handleOutsideClick = (e: React.MouseEvent) => {
    if (isEditing) {
      handleSave();
    }
  };
  
  const handleAddListItem = () => {
    if (!newListItemText.trim()) return;
    
    addChecklistItem(note.id, newListItemText);
    setNewListItemText('');
    
    // Also update local state
    if (isEditing) {
      setEditedListItems([
        ...editedListItems,
        {
          id: Date.now().toString(),
          text: newListItemText,
          isChecked: false,
        },
      ]);
      setNewListItemText('');
    }
  };
  
  const handleEditListItem = (id: string, text: string) => {
    if (isEditing) {
      setEditedListItems(
        editedListItems.map((item) => 
          item.id === id ? { ...item, text } : item
        )
      );
    } else {
      updateChecklistItem(note.id, id, text);
    }
  };
  
  const handleCheckListItem = (id: string) => {
    if (isEditing) {
      setEditedListItems(
        editedListItems.map((item) => 
          item.id === id ? { ...item, isChecked: !item.isChecked } : item
        )
      );
    } else {
      toggleChecklistItem(note.id, id);
    }
  };
  
  const handleRemoveListItem = (id: string) => {
    if (isEditing) {
      setEditedListItems(editedListItems.filter((item) => item.id !== id));
    } else {
      removeChecklistItem(note.id, id);
    }
  };
  
  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
    setShowColorPicker(false);
    setShowLabels(false);
  };
  
  const toggleColorPicker = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowColorPicker(!showColorPicker);
    setShowLabels(false);
  };
  
  const toggleLabelsMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowLabels(!showLabels);
    setShowColorPicker(false);
  };
  
  const handleColorChange = (color: typeof note.color) => {
    changeNoteColor(note.id, color);
    setShowColorPicker(false);
  };
  
  const getFormattedContent = (content: string) => {
    return content.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        {i < content.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };
  
  return (
    <div
      className={`group rounded-lg border overflow-hidden transition-all duration-200 ${
        getColorClass(note.color)
      } ${
        isEditing ? 'shadow-md' : 'shadow-sm hover:shadow-md'
      }`}
      onClick={isEditing ? undefined : handleEdit}
    >
      <div className="p-4">
        {/* Title */}
        {isEditing ? (
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="w-full text-lg font-medium bg-transparent outline-none mb-2"
            placeholder="Title"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          note.title && (
            <div className="text-lg font-medium mb-2">{note.title}</div>
          )
        )}
        
        {/* Note content or checklist */}
        {note.type === 'note' ? (
          isEditing ? (
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full bg-transparent outline-none resize-none min-h-[60px]"
              placeholder="Note"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <div className="text-gray-700 whitespace-pre-wrap">
              {getFormattedContent(note.content)}
            </div>
          )
        ) : (
          <div className="space-y-2">
            {(isEditing ? editedListItems : note.listItems)?.map((item) => (
              <div key={item.id} className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCheckListItem(item.id);
                  }}
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
                
                {isEditing ? (
                  <input
                    type="text"
                    value={item.text}
                    onChange={(e) => handleEditListItem(item.id, e.target.value)}
                    className={`flex-1 outline-none bg-transparent ${
                      item.isChecked ? 'line-through text-gray-500' : ''
                    }`}
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <span className={`flex-1 ${
                    item.isChecked ? 'line-through text-gray-500' : ''
                  }`}>
                    {item.text}
                  </span>
                )}
                
                {isEditing && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveListItem(item.id);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                )}
              </div>
            ))}
            
            {isEditing && (
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </div>
                
                <input
                  type="text"
                  value={newListItemText}
                  onChange={(e) => setNewListItemText(e.target.value)}
                  className="flex-1 outline-none bg-transparent"
                  placeholder="List item"
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddListItem();
                    }
                  }}
                />
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddListItem();
                  }}
                  className="text-blue-500 hover:text-blue-600"
                >
                  Add
                </button>
              </div>
            )}
          </div>
        )}
        
        {/* Labels display */}
        {note.labels.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {note.labels.map((labelId) => {
              const label = labels.find((l) => l.id === labelId);
              if (!label) return null;
              
              return (
                <div 
                  key={labelId}
                  className="text-xs bg-gray-200 text-gray-800 rounded-full px-2.5 py-1"
                >
                  {label.name}
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Card actions */}
      <div className={`px-2 py-2 flex justify-between items-center border-t border-gray-100/50 opacity-0 group-hover:opacity-100 ${
        isEditing ? 'opacity-100' : ''
      } transition-opacity`}>
        <div className="flex">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleColorPicker(e);
            }}
            className="p-2 text-gray-600 hover:bg-gray-100/50 rounded-full"
            title="Background options"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="13.5" cy="6.5" r="2.5" />
              <path d="M17 2H7a5 5 0 0 0-5 5v10a5 5 0 0 0 5 5h10a5 5 0 0 0 5-5V7a5 5 0 0 0-5-5Z" />
              <circle cx="10.5" cy="10.5" r=".5" />
              <circle cx="14.5" cy="10.5" r=".5" />
              <circle cx="18.5" cy="10.5" r=".5" />
              <circle cx="6.5" cy="10.5" r=".5" />
              <circle cx="10.5" cy="14.5" r=".5" />
              <circle cx="14.5" cy="14.5" r=".5" />
              <circle cx="18.5" cy="14.5" r=".5" />
              <circle cx="6.5" cy="14.5" r=".5" />
              <circle cx="10.5" cy="18.5" r=".5" />
              <circle cx="14.5" cy="18.5" r=".5" />
              <circle cx="18.5" cy="18.5" r=".5" />
              <circle cx="6.5" cy="18.5" r=".5" />
            </svg>
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleLabelsMenu(e);
            }}
            className="p-2 text-gray-600 hover:bg-gray-100/50 rounded-full"
            title="Add label"
          >
            <Tag size={18} />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (note.isTrashed) {
                restoreNote(note.id);
              } else {
                toggleArchived(note.id);
              }
            }}
            className="p-2 text-gray-600 hover:bg-gray-100/50 rounded-full"
            title={note.isTrashed ? "Restore" : "Archive"}
          >
            <Archive size={18} />
          </button>
          
          <div className="relative" ref={menuRef}>
            <button
              onClick={toggleMenu}
              className="p-2 text-gray-600 hover:bg-gray-100/50 rounded-full"
              title="More"
            >
              <MoreVertical size={18} />
            </button>
            
            {showMenu && (
              <div className="absolute bottom-full left-0 mb-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 w-40 z-10">
                {note.isTrashed ? (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        restoreNote(note.id);
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                    >
                      Restore
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Delete note permanently?')) {
                          permanentlyDeleteNote(note.id);
                        }
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Delete forever
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTrashed(note.id);
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                    >
                      Delete
                    </button>
                    {isEditing && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSave();
                          setShowMenu(false);
                        }}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                      >
                        Save
                      </button>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        
        {!note.isArchived && !note.isTrashed && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              togglePinned(note.id);
            }}
            className={`p-2 rounded-full ${
              note.isPinned ? 'text-amber-600' : 'text-gray-600 hover:bg-gray-100/50'
            }`}
            title={note.isPinned ? "Unpin note" : "Pin note"}
          >
            <Pin size={18} fill={note.isPinned ? "currentColor" : "none"} />
          </button>
        )}
      </div>
      
      {/* Color picker */}
      {showColorPicker && (
        <div ref={colorPickerRef} className="absolute z-10 right-0 bottom-full mb-1" onClick={(e) => e.stopPropagation()}>
          <ColorPicker
            selectedColor={note.color}
            onChange={handleColorChange}
          />
        </div>
      )}
      
      {/* Labels menu */}
      {showLabels && (
        <div 
          ref={labelsRef} 
          className="absolute bottom-full left-0 mb-1 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-10 w-56"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-sm font-medium p-2">Label note</div>
          <div className="max-h-[200px] overflow-y-auto">
            {labels.map((label) => (
              <div 
                key={label.id}
                className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer"
                onClick={() => toggleLabelOnNote(note.id, label.id)}
              >
                <input
                  type="checkbox"
                  checked={note.labels.includes(label.id)}
                  onChange={() => {}}
                  className="mr-2"
                />
                <span>{label.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NoteCard;