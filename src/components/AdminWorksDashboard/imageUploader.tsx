import React, { useState } from "react";
import Spinner from "./spinner";

const ImageUploader = ({
  value,
  onUploaded,
  onClear,
}: {
  value: string;
  onUploaded: (url: string) => void;
  onClear: () => void;
}) => {
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
};

export default ImageUploader;
