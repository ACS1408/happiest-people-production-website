"use client";
import React from "react";
import Container from "@/components/Container";
import { DndContext } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import AdminHeader from "@/components/AdminHeader";
import Field from "./field";
import ImageUploader from "./imageUploader";
import Th from "./th";
import DraftRow from "./draftRow";
import SortableRow from "./sortableRow";
import { twc } from "@/utils";
import useAdminWorksdashboard from "./useAdminWorksdashboard";

const AdminWorksDashboard = () => {
  const {
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
  } = useAdminWorksdashboard();
  // Fire-and-forget stale draft cleanup on mount (age threshold default 10m)
  React.useEffect(() => {
    fetch('/api/admin/work-drafts/cleanup?ageMinutes=0', { method: 'POST' })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.deleted) {
          // eslint-disable-next-line no-console
          console.log('Cleaned stale draft images:', data.deleted);
        }
      })
      .catch(() => { /* silent */ });
  }, []);
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
                  if (!form.title) return; // image no longer mandatory
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
                    className={twClasses.input}
                    required
                    value={form.title}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, title: e.target.value }))
                    }
                  />
                </Field>
                <Field
                  label="Image"
                  // removed required to make optional
                  hint="Upload and preview. Stored under /public/uploads."
                >
                  <ImageUploader
                    value={form.imageUrl || ""}
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
                    className={twClasses.input}
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
                    className={twClasses.input}
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
                    disabled={!form.title} // only title required now
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
};

export default AdminWorksDashboard;

const twClasses = twc({
  input:
    "rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900/30 focus:border-neutral-900 transition",
});
