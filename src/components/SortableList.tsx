import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Move } from 'lucide-react';

interface SortableItemProps<T> {
  item: T;
  index: number;
  children: React.ReactNode;
}

function SortableItem<T extends { id?: number | string }>({
  item,
  index,
  children,
}: SortableItemProps<T>) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
    data: { item, index },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative ${isDragging ? 'shadow-2xl scale-105' : ''}`}
    >
      <div
        {...attributes}
        {...listeners}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 p-2 text-gray-300 hover:text-yingge-gold cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity z-10"
        title="拖动排序"
      >
        <GripVertical size={18} />
      </div>
      <div className="ml-0">{children}</div>
    </div>
  );
}

interface SortableListProps<T> {
  items: T[];
  setItems: (items: T[]) => void;
  onReorder?: (items: T[]) => void;
  children: (item: T, index: number) => React.ReactNode;
  className?: string;
  itemClassName?: string;
  disabled?: boolean;
}

export function SortableList<T extends { id?: number | string }>({
  items,
  setItems,
  onReorder,
  children,
  className = '',
  itemClassName = '',
  disabled = false,
}: SortableListProps<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!disabled && over && active.id !== over.id) {
      const activeData = active.data.current as { item: T; index: number };
      const overData = over.data.current as { item: T; index: number };
      
      const oldIndex = activeData?.index ?? items.findIndex((item) => item.id === active.id);
      const newIndex = overData?.index ?? items.findIndex((item) => item.id === over.id);

      const newItems = arrayMove(items, oldIndex, newIndex);

      const updatedItems = newItems.map((item, index) => ({
        ...item,
        sort_order: index,
      }));

      setItems(updatedItems);
      onReorder?.(updatedItems);
    }
  };

  if (disabled) {
    return (
      <div className={className}>
        {items.map((item, index) => (
          <div key={item.id} className={itemClassName}>
            {children(item, index)}
          </div>
        ))}
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items.map((item) => item.id)} strategy={rectSortingStrategy}>
        <div className={className}>
          {items.map((item, index) => (
            <SortableItem key={item.id} item={item} index={index}>
              <div className={itemClassName}>{children(item, index)}</div>
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

interface SortToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

export function SortToggle({ enabled, onChange }: SortToggleProps) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
        enabled
          ? 'bg-yingge-gold text-white shadow-md shadow-yingge-gold/30'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      <Move size={18} />
      {enabled ? '排序模式已开启' : '开启排序模式'}
    </button>
  );
}

export default SortableList;