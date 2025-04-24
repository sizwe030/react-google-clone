export type NoteColor = 
  | 'default' 
  | 'red' 
  | 'orange' 
  | 'yellow' 
  | 'green' 
  | 'teal' 
  | 'blue' 
  | 'darkblue' 
  | 'purple' 
  | 'pink' 
  | 'brown'
  | 'gray';

export type NoteType = 'note' | 'list';

export interface NoteItem {
  id: string;
  type: NoteType;
  title: string;
  content: string;
  color: NoteColor;
  isPinned: boolean;
  isArchived: boolean;
  isTrashed: boolean;
  labels: string[];
  createdAt: number;
  updatedAt: number;
  listItems?: ChecklistItem[];
}

export interface ChecklistItem {
  id: string;
  text: string;
  isChecked: boolean;
}

export interface Label {
  id: string;
  name: string;
}