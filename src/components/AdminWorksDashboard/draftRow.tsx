import React, { useState } from "react";
import IconButton from "./iconButton";
import Icons from "@/utils/icons";
import type { FormState } from "@/types/admin";
import useFetchSignedWorkImages from "@/hooks/useFetchSignedWorkImages";
import Image from "next/image";

const DraftRow = ({
  draft,
  onEditDraft,
  onRemoveDraft,
}: {
  draft: FormState & { tempId: string };
  onEditDraft: (id: string) => void;
  onRemoveDraft: (id: string) => void;
}) => {
  const { signedSrc, imgError, setImgError } = useFetchSignedWorkImages(
    draft.imageUrl || ""
  );
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  console.log("imgError: ", imgError);

  const isUpdate = !!draft.id;
  return (
    <tr className="bg-amber-50/60 hover:bg-amber-50">
      <td className="p-3 align-center text-neutral-400">—</td>
      <td className="p-3">
        <div className="relative w-24 aspect-[16/9] rounded-md overflow-hidden bg-neutral-200">
          {signedSrc ? (
            <>
              <Image
                src={signedSrc}
                alt={draft.imageAlt || "Draft image"}
                fill
                className="object-cover w-full h-full"
                onError={() => setImgError("load error")}
                onLoad={() => setIsImageLoaded(true)}
              />
              {!isImageLoaded ? (
                <div className="absolute inset-0">
                  <div
                    className="skeleton-shimmer"
                    aria-label="Loading image"
                  />
                </div>
              ) : null}
            </>
          ) : (
            <div
              className={`bg-gray-200 flex items-center justify-center p-5 !absolute inset-0`}
            >
              <Image
                src="/images/placeholder-icon.png"
                alt="placeholder-icon"
                width={20}
                height={20}
                className="object-contain"
              />
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
};

export default DraftRow;
