import React from 'react';
import { 
  Lightbulb, 
  Bell, 
  Tag, 
  Edit3, 
  Archive, 
  Trash2, 
  Plus 
} from 'lucide-react';
import { useNotes } from '../context/NotesContext';

const Sidebar: React.FC = () => {
  const { 
    showSidebar, 
    view, 
    setView, 
    labels, 
    activeLabel, 
    setActiveLabel,
    addLabel,
    notes
  } = useNotes();

  // Count notes
  const notesCount = notes.filter(note => !note.isArchived && !note.isTrashed).length;
  const remindersCount = 0; // For future implementation
  const archivedCount = notes.filter(note => note.isArchived).length;
  const trashedCount = notes.filter(note => note.isTrashed).length;

  const handleLabelClick = (labelId: string) => {
    setActiveLabel(labelId);
    setView('label');
  };

  const handleAddLabel = () => {
    const labelName = prompt('Enter new label name:');
    if (labelName && labelName.trim()) {
      addLabel(labelName.trim());
    }
  };

  if (!showSidebar) return null;

  return (
    <div className="fixed top-16 left-0 bottom-0 w-64 bg-white border-r border-gray-200 z-[5] overflow-y-auto transition-all duration-300 transform">
      <div className="py-2">
        <button 
          className={`flex items-center w-full px-6 py-3 text-sm font-medium rounded-r-full transition-colors ${
            view === 'notes' && !activeLabel ? 'bg-amber-100 text-amber-900' : 'hover:bg-gray-100 text-gray-700'
          }`}
          onClick={() => {
            setView('notes');
            setActiveLabel(null);
          }}
        >
          <Lightbulb size={18} className="mr-3" />
          <span>Notes</span>
          {notesCount > 0 && (
            <span className="ml-auto text-xs text-gray-500">{notesCount}</span>
          )}
        </button>
        
        <button 
          className="flex items-center w-full px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-r-full transition-colors"
        >
          <Bell size={18} className="mr-3" />
          <span>Reminders</span>
          {remindersCount > 0 && (
            <span className="ml-auto text-xs text-gray-500">{remindersCount}</span>
          )}
        </button>
        
        {/* Labels section */}
        <div className="mt-2 mb-2">
          <div className="px-6 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Labels</div>
          
          {labels.map((label) => (
            <button
              key={label.id}
              className={`flex items-center w-full px-6 py-3 text-sm font-medium rounded-r-full transition-colors ${
                activeLabel === label.id ? 'bg-amber-100 text-amber-900' : 'hover:bg-gray-100 text-gray-700'
              }`}
              onClick={() => handleLabelClick(label.id)}
            >
              <Tag size={18} className="mr-3" />
              <span>{label.name}</span>
            </button>
          ))}
          
          <button 
            className="flex items-center w-full px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-r-full transition-colors"
            onClick={handleAddLabel}
          >
            <Plus size={18} className="mr-3" />
            <span>Create new label</span>
          </button>
        </div>
        
        <button 
          className="flex items-center w-full px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-r-full transition-colors"
        >
          <Edit3 size={18} className="mr-3" />
          <span>Edit labels</span>
        </button>
        
        <button 
          className={`flex items-center w-full px-6 py-3 text-sm font-medium rounded-r-full transition-colors ${
            view === 'archive' ? 'bg-amber-100 text-amber-900' : 'hover:bg-gray-100 text-gray-700'
          }`}
          onClick={() => {
            setView('archive');
            setActiveLabel(null);
          }}
        >
          <Archive size={18} className="mr-3" />
          <span>Archive</span>
          {archivedCount > 0 && (
            <span className="ml-auto text-xs text-gray-500">{archivedCount}</span>
          )}
        </button>
        
        <button 
          className={`flex items-center w-full px-6 py-3 text-sm font-medium rounded-r-full transition-colors ${
            view === 'trash' ? 'bg-amber-100 text-amber-900' : 'hover:bg-gray-100 text-gray-700'
          }`}
          onClick={() => {
            setView('trash');
            setActiveLabel(null);
          }}
        >
          <Trash2 size={18} className="mr-3" />
          <span>Trash</span>
          {trashedCount > 0 && (
            <span className="ml-auto text-xs text-gray-500">{trashedCount}</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;