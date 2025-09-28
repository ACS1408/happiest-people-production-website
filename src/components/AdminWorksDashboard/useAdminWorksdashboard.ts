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
