"use client";
import React, { useEffect, useState, useCallback } from "react";
import type { Work } from "@/types/works";
import Container from "@/components/Container";
import Image from "next/image";
import Icons from "@/utils/icons";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import AdminHeader from "@/components/AdminHeader";

interface FormState {
  id?: string;
  title: string;
  imageUrl: string;
  imageAlt: string;
  videoId?: string;
}
const emptyForm: FormState = {
  title: "",
  imageUrl: "",
  imageAlt: "",
  videoId: "",
};

export default function AdminWorksClient() {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  // Removed original snapshot tracking; edits now staged as drafts
  const [drafts, setDrafts] = useState<Array<FormState & { tempId: string }>>(
    []
  );
  const [saving, setSaving] = useState(false);
  const [orderDirty, setOrderDirty] = useState(false);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const fetchWorks = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/works");
      const json = await res.json();
      setWorks(json.data || []);
    } catch (e: any) {
      console.log("Error fetching works: ", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorks();
  }, []);

  const onEdit = (w: Work) => {
    const snap = {
      id: w.id,
      title: w.title,
      imageUrl: w.image.url,
      imageAlt: w.image.alt,
      videoId: w.videoId,
    } as FormState;
    setForm(snap);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const onDelete = async (w: Work) => {
    if (!confirm("Delete this work?")) return;
    await fetch(`/api/works?id=${w.id}`, { method: "DELETE" });
    fetchWorks();
  };

  const publishAll = async () => {
    const hasReorder = orderDirty;
    if (drafts.length === 0 && !hasReorder) return;
    setSaving(true);
    try {
      // Persist reorder first if needed
      if (hasReorder) {
        const res = await fetch("/api/works", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reorder: true, ids: works.map((w) => w.id) }),
        });
        if (!res.ok) throw new Error("Failed to reorder works");
        setOrderDirty(false);
      }
      for (const d of drafts) {
        const imageAlt = d.imageAlt?.trim() ? d.imageAlt.trim() : "Work image";
        if (d.id) {
          const res = await fetch("/api/works", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: d.id,
              title: d.title,
              image: { url: d.imageUrl, alt: imageAlt },
              videoId: d.videoId || undefined,
              published: true,
            }),
          });
          if (!res.ok) throw new Error("Failed to apply staged update");
        } else {
          const res = await fetch("/api/works", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: d.title,
              image: { url: d.imageUrl, alt: imageAlt },
              videoId: d.videoId || undefined,
              published: true,
            }),
          });
          if (!res.ok) throw new Error("Failed to create staged draft");
        }
      }
      setDrafts([]);
      setForm(emptyForm);
      fetchWorks();
    } catch (e: any) {
      console.log("Error publishing works: ", e.message);
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setDrafts([]);
    setForm(emptyForm);
  };
  const createDraft = () => {
    if (!form.title || !form.imageUrl) return;
    const tempId =
      "temp-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7);
    setDrafts((ds) => [...ds, { ...form, tempId }]);
    setForm(emptyForm);
  };
  const editDraft = (id: string) => {
    const d = drafts.find((dr) => dr.tempId === id);
    if (!d) return;
    const { tempId: _, ...rest } = d;
    console.log(_);
    setForm(rest);
    setDrafts((ds) => ds.filter((dr) => dr.tempId !== id));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const removeDraft = (id: string) => {
    if (!confirm("Remove this draft?")) return;
    setDrafts((ds) => ds.filter((d) => d.tempId !== id));
  };

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setWorks((items) => {
      const oldIndex = items.findIndex((w) => w.id === active.id);
      const newIndex = items.findIndex((w) => w.id === over.id);
      return arrayMove(items, oldIndex, newIndex);
    });
    setOrderDirty(true);
  }, []);
  // saveOrder removed – reorder persisted on publish

  return (
    <>
      <AdminHeader />
      <section className="bg-white min-h-screen py-8" data-admin-page="works">
        <Container>
          <div className="grid xl:grid-cols-3 gap-10 items-start">
            <div className="xl:col-span-1 border border-neutral-200 rounded-2xl p-6 shadow-sm bg-neutral-50/50">
              <h2 className="ff-figtree text-lg font-medium flex items-center gap-2">
                {form.id ? "Edit Work" : "New Work"}
                {form.id && (
                  <span className="text-[10px] uppercase tracking-wide bg-neutral-900 text-white px-2 py-0.5 rounded">
                    Editing
                  </span>
                )}
              </h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!form.title || !form.imageUrl) return;
                  const tempId =
                    "temp-" +
                    Date.now() +
                    "-" +
                    Math.random().toString(36).slice(2, 7);
                  if (form.id) {
                    setDrafts((ds) => [...ds, { ...form, tempId }]);
                    setForm(emptyForm);
                  } else {
                    createDraft();
                  }
                }}
                className="mt-6 flex flex-col gap-5"
              >
                <Field label="Title" required>
                  <input
                    className={inputCls}
                    required
                    value={form.title}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, title: e.target.value }))
                    }
                  />
                </Field>
                <Field
                  label="Image"
                  required
                  hint="Upload and preview. Stored under /public/uploads."
                >
                  <ImageUploader
                    value={form.imageUrl}
                    onUploaded={(url) =>
                      setForm((f) => ({ ...f, imageUrl: url }))
                    }
                    onClear={() => setForm((f) => ({ ...f, imageUrl: "" }))}
                  />
                </Field>
                <Field
                  label="Image Alt"
                  hint="Optional – falls back to 'Work image' if empty"
                >
                  <input
                    className={inputCls}
                    value={form.imageAlt}
                    placeholder="e.g. Dashboard screenshot"
                    onChange={(e) =>
                      setForm((f) => ({ ...f, imageAlt: e.target.value }))
                    }
                  />
                </Field>
                <Field
                  label="Video URL"
                  hint="Store raw value (URL or ID shown as entered)"
                >
                  <input
                    className={inputCls}
                    value={form.videoId || ""}
                    placeholder="dQw4w9WgXcQ"
                    onChange={(e) =>
                      setForm((f) => ({ ...f, videoId: e.target.value }))
                    }
                  />
                </Field>
                {/* Order field removed – ordering managed solely via drag & drop list */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={!form.title || !form.imageUrl}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {form.id ? "Update" : "Create"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm(emptyForm)}
                    className="px-4 py-2 rounded-md border border-neutral-300 text-sm hover:bg-neutral-100 cursor-pointer"
                  >
                    Clear
                  </button>
                </div>
              </form>
            </div>
            <div className="xl:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="ff-figtree text-xl font-light">
                  All <em className="font-medium not-italic">Works</em>
                </h2>
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={resetForm}
                    disabled={saving}
                    className="px-4 py-2 rounded-md border border-neutral-300 text-sm font-medium hover:bg-neutral-100 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={publishAll}
                    disabled={saving || (!orderDirty && drafts.length === 0)}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-md bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {saving ? "Publishing…" : "Publish"}
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto border border-neutral-200 rounded-xl shadow-sm">
                <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                  <table className="w-full text-sm">
                    <thead className="bg-neutral-100 text-neutral-600 text-xs uppercase tracking-wide">
                      <tr>
                        <Th className="w-10"> </Th>
                        <Th className="w-28">Preview</Th>
                        <Th>Title</Th>
                        <Th className="w-24">Video</Th>
                        <Th className="w-28">Status</Th>
                        <Th className="w-40">Actions</Th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      {drafts.map((d) => (
                        <DraftRow
                          key={d.tempId}
                          draft={d}
                          onEditDraft={editDraft}
                          onRemoveDraft={removeDraft}
                        />
                      ))}
                      <tr className="hidden" aria-hidden />
                    </tbody>
                    <SortableContext
                      items={works.map((w) => w.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <tbody className="divide-y divide-neutral-200 border-t border-neutral-200">
                        {loading && (
                          <tr>
                            <td
                              colSpan={6}
                              className="py-10 text-center text-neutral-500"
                            >
                              Loading…
                            </td>
                          </tr>
                        )}
                        {!loading &&
                          works.length === 0 &&
                          drafts.length === 0 && (
                            <tr>
                              <td
                                colSpan={6}
                                className="py-10 text-center text-neutral-400"
                              >
                                No works yet.
                              </td>
                            </tr>
                          )}
                        {!loading &&
                          works
                            .filter(
                              (w) => !drafts.some((d) => d.id && d.id === w.id)
                            )
                            .map((w) => (
                              <SortableRow
                                key={w.id}
                                id={w.id}
                                work={w}
                                onEdit={onEdit}
                                onDelete={onDelete}
                              />
                            ))}
                      </tbody>
                    </SortableContext>
                  </table>
                </DndContext>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm font-medium text-neutral-700">
      <span>
        {label}
        {required && <sup className="text-red-500 ms-0.5">*</sup>}
      </span>
      {children}
      {hint && (
        <span className="text-[11px] font-normal text-neutral-400">{hint}</span>
      )}
    </label>
  );
}
function Th({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th className={"text-left font-semibold py-3 px-3 " + className}>
      {children}
    </th>
  );
}
const inputCls =
  "rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900/30 focus:border-neutral-900 transition";
function Spinner() {
  return (
    <span className="inline-block size-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
  );
}

interface SortableRowProps {
  id: string;
  work: Work;
  onEdit: (w: Work) => void;
  onDelete: (w: Work) => void;
}
function SortableRow({ id, work, onEdit, onDelete }: SortableRowProps) {
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
}

function DraftRow({
  draft,
  onEditDraft,
  onRemoveDraft,
}: {
  draft: FormState & { tempId: string };
  onEditDraft: (id: string) => void;
  onRemoveDraft: (id: string) => void;
}) {
  const isUpdate = !!draft.id;
  return (
    <tr className="bg-amber-50/60 hover:bg-amber-50">
      <td className="p-3 align-center text-neutral-400">—</td>
      <td className="p-3">
        <div className="relative w-24 aspect-[16/9] rounded-md overflow-hidden bg-neutral-200">
          {draft.imageUrl ? ( // eslint-disable-next-line @next/next/no-img-element
            <img
              src={draft.imageUrl}
              alt={draft.imageAlt || "Draft image"}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="flex items-center justify-center text-[10px] text-neutral-400 w-full h-full">
              No Image
            </div>
          )}
        </div>
      </td>
      <td className="p-3 align-center">
        <p className="font-medium text-neutral-900 leading-snug line-clamp-2">
          {draft.title || <span className="text-neutral-400">Untitled</span>}
        </p>
        <p
          className={
            "text-[10px] mt-1 tracking-wide " +
            (isUpdate ? "text-blue-600" : "text-amber-600")
          }
        >
          {isUpdate ? "Update (staged)" : "Draft (local)"}
        </p>
      </td>
      <td className="p-3 align-center">
        {draft.videoId ? (
          <span className="px-2 py-0.5 bg-neutral-900 text-white rounded text-[11px]">
            Yes
          </span>
        ) : (
          <span className="text-neutral-400">—</span>
        )}
      </td>
      <td className="p-3 align-center">
        <span
          className={
            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium " +
            (isUpdate
              ? "bg-blue-200 text-blue-700"
              : "bg-amber-200 text-amber-700")
          }
        >
          {isUpdate ? "Update" : "Draft"}
        </span>
      </td>
      <td className="p-3 align-center">
        <div className="flex flex-wrap gap-2">
          <IconButton
            label="Edit draft"
            variant="default"
            onClick={() => onEditDraft(draft.tempId)}
            icon={<Icons.Edit className="w-4 h-4" />}
          />
          <IconButton
            label="Remove draft"
            variant="danger"
            onClick={() => onRemoveDraft(draft.tempId)}
            icon={<Icons.Trash className="w-4 h-4" />}
          />
        </div>
      </td>
    </tr>
  );
}

function IconButton({
  label,
  onClick,
  icon,
  variant = "default",
}: {
  label: string;
  onClick: () => void;
  icon: React.ReactNode;
  variant?: "default" | "danger";
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={
        "inline-flex items-center justify-center rounded-md border text-xs font-medium w-8 h-8 focus:outline-none focus:ring-2 focus:ring-neutral-900/40 transition cursor-pointer " +
        (variant === "danger"
          ? "border-red-300 text-red-600 hover:bg-red-50"
          : "border-neutral-300 text-neutral-600 hover:bg-neutral-100")
      }
    >
      {icon}
      <span className="sr-only">{label}</span>
    </button>
  );
}

function ImageUploader({
  value,
  onUploaded,
  onClear,
}: {
  value: string;
  onUploaded: (url: string) => void;
  onClear: () => void;
}) {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [opening, setOpening] = useState(false); // debounce rapid re-open
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const openFile = () => {
    if (opening || uploading) return; // prevent double trigger
    setOpening(true);
    inputRef.current?.click();
    // allow another open on next tick
    setTimeout(() => setOpening(false), 300);
  };

  const handleFiles = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      if (!file.type.startsWith("image/"))
        throw new Error("Only image files allowed");
      if (file.size > 4 * 1024 * 1024) throw new Error("Max 4MB file size");
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed");
      onUploaded(json.url);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setUploading(false);
      setDragOver(false);
    }
  };

  const onInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    void handleFiles(e.target.files);
    e.target.value = "";
  };

  const remove = () => {
    onClear();
    setError(null);
  };

  const containerClickable = !value && !uploading; // disable auto-open when value exists or uploading

  return (
    <div className="flex flex-col gap-2">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragOver(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={
          "relative rounded-xl border-2 border-dashed px-4 py-6 flex flex-col items-center justify-center text-center gap-3 transition " +
          (containerClickable ? "cursor-pointer" : "cursor-default") +
          " " +
          (value
            ? "border-neutral-300 bg-white"
            : "border-neutral-300 bg-neutral-50/60 hover:bg-neutral-100/60") +
          (dragOver ? " border-neutral-900 bg-neutral-100" : "")
        }
        onClick={
          containerClickable
            ? (e) => {
                e.stopPropagation();
                openFile();
              }
            : undefined
        }
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={onInputChange}
          hidden
        />
        {!value && !uploading && (
          <>
            <p className="text-sm font-medium text-neutral-700">
              Drop image or click to upload
            </p>
            <p className="text-[11px] text-neutral-500">
              PNG/JPG/WebP up to 4MB
            </p>
            <button
              type="button"
              className="px-3 py-1.5 rounded-md bg-neutral-900 text-white text-xs font-medium hover:bg-neutral-800"
              onClick={(e) => {
                e.stopPropagation();
                openFile();
              }}
            >
              Browse
            </button>
          </>
        )}
        {uploading && (
          <div className="flex flex-col items-center gap-2">
            <Spinner />
            <p className="text-xs text-neutral-600">Uploading…</p>
          </div>
        )}
        {value && !uploading && (
          <div className="w-full flex flex-col items-center gap-3">
            <div className="relative w-full max-w-[260px] aspect-[16/9] rounded-lg overflow-hidden ring-1 ring-neutral-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={value}
                alt="Uploaded image preview"
                className="object-cover w-full h-full"
              />
            </div>
            <div className="flex gap-2 flex-wrap justify-center">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openFile();
                }}
                className="px-3 py-1.5 rounded-md border border-neutral-300 text-xs font-medium hover:bg-neutral-100"
              >
                Replace
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  remove();
                }}
                className="px-3 py-1.5 rounded-md border border-red-300 text-xs font-medium text-red-600 hover:bg-red-50"
              >
                Remove
              </button>
            </div>
          </div>
        )}
      </div>
      {error && <p className="text-[11px] text-red-600">{error}</p>}
    </div>
  );
}
