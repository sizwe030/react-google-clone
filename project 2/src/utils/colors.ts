import { NoteColor } from '../types';

export const getColorClass = (color: NoteColor): string => {
  switch (color) {
    case 'red':
      return 'bg-red-100 hover:bg-red-200 border-red-200';
    case 'orange':
      return 'bg-orange-100 hover:bg-orange-200 border-orange-200';
    case 'yellow':
      return 'bg-yellow-100 hover:bg-yellow-200 border-yellow-200';
    case 'green':
      return 'bg-green-100 hover:bg-green-200 border-green-200';
    case 'teal':
      return 'bg-teal-100 hover:bg-teal-200 border-teal-200';
    case 'blue':
      return 'bg-blue-100 hover:bg-blue-200 border-blue-200';
    case 'darkblue':
      return 'bg-indigo-100 hover:bg-indigo-200 border-indigo-200';
    case 'purple':
      return 'bg-purple-100 hover:bg-purple-200 border-purple-200';
    case 'pink':
      return 'bg-pink-100 hover:bg-pink-200 border-pink-200';
    case 'brown':
      return 'bg-amber-100 hover:bg-amber-200 border-amber-200';
    case 'gray':
      return 'bg-gray-100 hover:bg-gray-200 border-gray-200';
    case 'default':
    default:
      return 'bg-white hover:bg-gray-50 border-gray-200';
  }
};

export const colorOptions: { color: NoteColor; label: string }[] = [
  { color: 'default', label: 'Default' },
  { color: 'red', label: 'Red' },
  { color: 'orange', label: 'Orange' },
  { color: 'yellow', label: 'Yellow' },
  { color: 'green', label: 'Green' },
  { color: 'teal', label: 'Teal' },
  { color: 'blue', label: 'Blue' },
  { color: 'darkblue', label: 'Dark Blue' },
  { color: 'purple', label: 'Purple' },
  { color: 'pink', label: 'Pink' },
  { color: 'brown', label: 'Brown' },
  { color: 'gray', label: 'Gray' },
];