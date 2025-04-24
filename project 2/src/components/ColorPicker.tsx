import React, { useState, useRef, useEffect } from 'react';
import { Palette } from 'lucide-react';
import { colorOptions } from '../utils/colors';
import { NoteColor } from '../types';

interface ColorPickerProps {
  selectedColor: NoteColor;
  onChange: (color: NoteColor) => void;
  position?: 'top' | 'bottom';
}

const ColorPicker: React.FC<ColorPickerProps> = ({ 
  selectedColor, 
  onChange,
  position = 'bottom' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  
  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);
  
  const handleColorSelect = (color: NoteColor) => {
    onChange(color);
    setIsOpen(false);
  };
  
  return (
    <div ref={pickerRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        title="Background options"
      >
        <Palette size={18} />
      </button>
      
      {isOpen && (
        <div 
          className={`absolute ${
            position === 'top' ? 'bottom-10' : 'top-10'
          } left-0 z-20 bg-white border border-gray-200 rounded-lg shadow-lg p-2 w-[290px] grid grid-cols-4 gap-1`}
        >
          {colorOptions.map((option) => (
            <div 
              key={option.color}
              onClick={() => handleColorSelect(option.color)}
              className={`w-full aspect-square rounded-full border cursor-pointer flex items-center justify-center ${
                getColorClass(option.color)
              } ${
                selectedColor === option.color ? 'ring-2 ring-blue-500' : ''
              }`}
              title={option.label}
            >
              {selectedColor === option.color && (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const getColorClass = (color: NoteColor): string => {
  switch (color) {
    case 'red':
      return 'bg-red-100 border-red-200';
    case 'orange':
      return 'bg-orange-100 border-orange-200';
    case 'yellow':
      return 'bg-yellow-100 border-yellow-200';
    case 'green':
      return 'bg-green-100 border-green-200';
    case 'teal':
      return 'bg-teal-100 border-teal-200';
    case 'blue':
      return 'bg-blue-100 border-blue-200';
    case 'darkblue':
      return 'bg-indigo-100 border-indigo-200';
    case 'purple':
      return 'bg-purple-100 border-purple-200';
    case 'pink':
      return 'bg-pink-100 border-pink-200';
    case 'brown':
      return 'bg-amber-100 border-amber-200';
    case 'gray':
      return 'bg-gray-100 border-gray-200';
    case 'default':
    default:
      return 'bg-white border-gray-200';
  }
};

export default ColorPicker;