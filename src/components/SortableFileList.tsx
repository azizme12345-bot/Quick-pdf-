import React from 'react';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, X, File as FileIcon } from 'lucide-react';

interface SortableItemProps {
  key?: React.Key;
  id: string;
  file: File;
  onRemove: (id: string) => void;
  previewUrl?: string;
}

function SortableItem({ id, file, onRemove, previewUrl }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center justify-between p-3 mb-2 bg-white border border-slate-200 rounded-lg shadow-sm">
      <div className="flex items-center gap-3 overflow-hidden">
        <div {...attributes} {...listeners} className="cursor-grab p-1 text-slate-400 hover:text-slate-600">
          <GripVertical className="h-5 w-5" />
        </div>
        {previewUrl ? (
          <img src={previewUrl} alt={file.name} className="h-10 w-10 object-cover rounded" />
        ) : (
          <div className="h-10 w-10 bg-blue-50 rounded flex items-center justify-center text-blue-500 shrink-0">
            <FileIcon className="h-5 w-5" />
          </div>
        )}
        <div className="overflow-hidden">
          <p className="text-sm font-medium text-slate-700 truncate">{file.name}</p>
          <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
        </div>
      </div>
      <button 
        onClick={() => onRemove(id)}
        className="p-2 text-slate-400 hover:text-red-500 transition-colors shrink-0"
        aria-label="Remove file"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}

export interface FileWithId {
  id: string;
  file: File;
  previewUrl?: string;
}

interface SortableFileListProps {
  items: FileWithId[];
  setItems: React.Dispatch<React.SetStateAction<FileWithId[]>>;
  onRemove: (id: string) => void;
}

export default function SortableFileList({ items, setItems, onRemove }: SortableFileListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext 
        items={items.map(i => i.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="w-full max-w-2xl mx-auto my-6">
          {items.map((item) => (
            <SortableItem key={item.id} id={item.id} file={item.file} onRemove={onRemove} previewUrl={item.previewUrl} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
