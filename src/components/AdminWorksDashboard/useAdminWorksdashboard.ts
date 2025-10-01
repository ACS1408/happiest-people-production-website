import { useCallback, useEffect, useState } from "react";
import {
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import type { FormState } from "@/types/admin";
import type { Work } from "@/types/works";

const emptyForm: FormState = {
  title: "",
  imageUrl: "",
  imageAlt: "",
  videoId: "",
};

const useAdminWorksdashboard = () => {
  const [works, setWorks] = useState<Work[]>([]);
  // Keep a snapshot of the last fetched (server) ordering so we can revert sorting
  const [originalWorks, setOriginalWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  // Draft now enriched with action type
  const [drafts, setDrafts] = useState<Array<FormState & { tempId: string; action: 'create' | 'update' | 'delete'; originalId?: string }>>(
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
      const incoming: Work[] = json.data || [];
      setWorks(incoming);
      setOriginalWorks(incoming);
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
      imageUrl: w.image?.url || "",
      imageAlt: w.image?.alt || "",
      videoId: w.videoId,
    } as FormState;
    setForm(snap);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const onDelete = async (w: Work) => {
    if (!confirm("Stage deletion for this work?")) return;
    // Avoid duplicating delete draft
    const exists = drafts.some(d => d.action === 'delete' && (d.originalId === w.id || d.id === w.id));
    if (exists) return;
    setDrafts(ds => [...ds, { tempId: 'temp-' + Date.now() + '-' + Math.random().toString(36).slice(2,7), title: w.title, imageUrl: w.image?.url || '', imageAlt: w.image?.alt || '', videoId: w.videoId, id: w.id, action: 'delete', originalId: w.id }]);
  };

  const publishAll = async () => {
    const hasReorder = orderDirty;
    if (drafts.length === 0 && !hasReorder) return;
    setSaving(true);
    try {
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
        if (d.action === 'delete' && (d.originalId || d.id)) {
          const id = d.originalId || d.id!;
          const res = await fetch(`/api/works?id=${id}`, { method: 'DELETE' });
          if (!res.ok) throw new Error('Failed to delete work');
          continue;
        }
        const imageAlt = d.imageAlt?.trim() ? d.imageAlt.trim() : "Work image";
        const imagePayload = d.imageUrl ? { url: d.imageUrl, alt: imageAlt } : undefined;
        if (d.action === 'update' && d.id) {
          const res = await fetch("/api/works", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: d.id,
              title: d.title,
              image: imagePayload,
              videoId: d.videoId || undefined,
              published: true,
            }),
          });
          if (!res.ok) throw new Error("Failed to apply staged update");
        } else if (d.action === 'create') {
          const res = await fetch("/api/works", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: d.title,
              image: imagePayload,
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
      fetch('/api/admin/work-drafts/cleanup?ageMinutes=0', { method: 'POST' })
        .catch(() => {/* ignore */});
    } catch (e: any) {
      console.log("Error publishing works: ", e.message);
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setDrafts([]);
    setForm(emptyForm);
    // Revert any unsaved drag-sort changes
    setWorks(originalWorks);
    setOrderDirty(false);
  };
  const createDraft = () => {
    if (!form.title) return; // image not mandatory
    const tempId =
      "temp-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7);
    // Determine whether this is a create or update draft
    if (form.id) {
      setDrafts((ds) => [...ds, { ...form, tempId, action: 'update' }]);
    } else {
      setDrafts((ds) => [...ds, { ...form, tempId, action: 'create' }]);
    }
    setForm(emptyForm);
  };
  const editDraft = (id: string) => {
    const d = drafts.find((dr) => dr.tempId === id);
    if (!d) return;
    const { tempId: _, action, originalId, ...rest } = d;
    setForm(rest);
    setDrafts((ds) => ds.filter((dr) => dr.tempId !== id));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const removeDraft = (id: string) => {
    if (!confirm("Remove this staged change?")) return;
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
  return {
    form,
    loading,
    saving,
    sensors,
    onEdit,
    onDelete,
    publishAll,
    resetForm,
    createDraft,
    editDraft,
    removeDraft,
    handleDragEnd,
    setForm,
    setDrafts,
    emptyForm,
    orderDirty,
    drafts,
    works,
  };
};

export default useAdminWorksdashboard;
