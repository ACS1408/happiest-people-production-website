import { Work } from "@/types/works";
import { useSortable } from "@dnd-kit/sortable";
import React from "react";
import { CSS } from "@dnd-kit/utilities";
import Image from "next/image";
import IconButton from "./iconButton";
import Icons from "@/utils/icons";

interface SortableRowProps {
  id: string;
  work: Work;
  onEdit: (w: Work) => void;
  onDelete: (w: Work) => void;
}

const SortableRow = ({ id, work, onEdit, onDelete }: SortableRowProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    background: isDragging ? "rgba(0,0,0,0.04)" : undefined,
  };
  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={"group hover:bg-neutral-50 " + (isDragging ? "shadow-sm" : "")}
    >
      <td className="p-3 align-center">
        <button
          className="cursor-grab active:cursor-grabbing text-neutral-400 hover:text-neutral-600 transition"
          aria-label="Drag to reorder"
          {...attributes}
          {...listeners}
        >
          ☰
        </button>
      </td>
      <td className="p-3">
        <div className="relative w-24 aspect-[16/9] rounded-md overflow-hidden bg-neutral-200">
          <Image
            src={work.image.url}
            alt={work.image.alt}
            fill
            className="object-cover"
          />
        </div>
      </td>
      <td className="p-3">
        <p className="font-medium text-neutral-900 leading-snug line-clamp-2">
          {work.title}
        </p>
        <p className="text-[10px] mt-1 text-neutral-400 tracking-wide">
          ID: {work.id.slice(0, 8)}
        </p>
      </td>
      <td className="p-3">
        {work.videoId ? (
          <span className="px-2 py-0.5 bg-neutral-900 text-white rounded text-[11px]">
            Yes
          </span>
        ) : (
          <span className="text-neutral-400">—</span>
        )}
      </td>
      <td className="p-3">
        {work.published ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-700 px-2 py-0.5 text-[11px] font-medium">
            Published
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-neutral-200 text-neutral-600 px-2 py-0.5 text-[11px] font-medium">
            Draft
          </span>
        )}
      </td>
      <td className="p-3">
        <div className="flex flex-wrap gap-2">
          <IconButton
            label="Edit"
            variant="default"
            onClick={() => onEdit(work)}
            icon={<Icons.Edit className="w-4 h-4" />}
          />
          <IconButton
            label="Delete"
            variant="danger"
            onClick={() => onDelete(work)}
            icon={<Icons.Trash className="w-4 h-4" />}
          />
        </div>
      </td>
    </tr>
  );
};

export default SortableRow;
