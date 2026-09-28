"use client";

import type { Link as LinkRecord } from "@prisma/client";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Toggle } from "./Toggle";

interface LinkTableProps {
  links: LinkRecord[];
  onReorder: (orderedIds: string[]) => void;
  onToggleActive: (id: string, active: boolean) => void;
  onToggleFeatured: (id: string, featured: boolean) => void;
  onEdit: (link: LinkRecord) => void;
  onDelete: (id: string) => void;
}

export function LinkTable({
  links,
  onReorder,
  onToggleActive,
  onToggleFeatured,
  onEdit,
  onDelete,
}: LinkTableProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = links.findIndex((l) => l.id === active.id);
    const newIndex = links.findIndex((l) => l.id === over.id);
    const reordered = [...links];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, moved);
    onReorder(reordered.map((l) => l.id));
  };

  if (links.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-rmz-black/15 px-6 py-12 text-center text-rmz-black/50">
        No links yet. Add your first one to start the rebellion.
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={links.map((l) => l.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-2">
          {links.map((link) => (
            <SortableLinkRow
              key={link.id}
              link={link}
              onToggleActive={onToggleActive}
              onToggleFeatured={onToggleFeatured}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

interface SortableLinkRowProps {
  link: LinkRecord;
  onToggleActive: (id: string, active: boolean) => void;
  onToggleFeatured: (id: string, featured: boolean) => void;
  onEdit: (link: LinkRecord) => void;
  onDelete: (id: string) => void;
}

function SortableLinkRow({ link, onToggleActive, onToggleFeatured, onEdit, onDelete }: SortableLinkRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: link.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 rounded-xl border border-rmz-black/10 bg-white px-4 py-3"
    >
      <button
        type="button"
        aria-label="Drag to reorder"
        className="cursor-grab touch-none text-rmz-black/30 hover:text-rmz-black/60 active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        ⠿
      </button>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-rmz-black">
          {link.title}
          {link.type === "social" && (
            <span className="ml-2 rounded-full bg-rmz-black/10 px-2 py-0.5 text-[10px] font-bold uppercase text-rmz-black/60">
              Social
            </span>
          )}
          {link.featured && (
            <span className="ml-2 rounded-full bg-rmz-red/10 px-2 py-0.5 text-[10px] font-bold uppercase text-rmz-red">
              Featured
            </span>
          )}
        </p>
        <p className="truncate text-xs text-rmz-black/40">{link.url}</p>
      </div>

      <span className="shrink-0 rounded-full bg-rmz-beige px-2.5 py-1 text-xs font-semibold text-rmz-black/60">
        {link.clicks} click{link.clicks === 1 ? "" : "s"}
      </span>

      <div className="flex shrink-0 items-center gap-3 text-xs">
        <label className="flex items-center gap-1.5">
          <span className="text-rmz-black/50">Active</span>
          <Toggle checked={link.active} onChange={(v) => onToggleActive(link.id, v)} />
        </label>
        <label className="flex items-center gap-1.5">
          <span className="text-rmz-black/50">Featured</span>
          <Toggle checked={link.featured} onChange={(v) => onToggleFeatured(link.id, v)} />
        </label>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={() => onEdit(link)}
          className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-rmz-black/60 hover:bg-rmz-beige"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => {
            if (confirm(`Delete "${link.title}"? This can't be undone.`)) onDelete(link.id);
          }}
          className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-rmz-red hover:bg-rmz-red/10"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
