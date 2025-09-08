import React, { useRef, useState } from "react";
import type { CareersAccordionSettings } from "@/types/careersAccordion";
import Link from "next/link";
import Icons from "@/utils/icons";
import Button from "../Button";

const CareersAccordion: React.FC<CareersAccordionSettings> = ({
  sections,
  arrowIcon = defaultArrow,
  applyLabel = "Apply now",
}) => {
  const [openSection, setOpenSection] = useState<number | null>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);

  return (
    <div className="careers-accordion bg-white font-sans">
      {sections.map((section, secIdx) => {
        const isOpen = openSection === secIdx;
        return (
          <div
            key={section.title}
            className="careers-accordion__section relative border-b-2 border-gray-300"
          >
            <button
              className="ff-manrope w-full bg-transparent border-none outline-none flex items-center justify-between py-8 text-[1.375rem] font-light cursor-pointer gap-0"
              onClick={() => setOpenSection(isOpen ? null : secIdx)}
              aria-expanded={isOpen}
            >
              <span className="flex-1 text-left font-normal tracking-tight leading-tight">
                {section.title}
              </span>
              <span className="flex-1 flex items-center gap-2 text-[#222] text-[1.0625rem] font-normal">
                <span className="w-[6px] h-[6px] rounded-full bg-[#222] inline-block" />
                <span className="">{section.type}</span>
              </span>
              <span
                className={`ml-4 transition-transform duration-200 flex items-center${
                  isOpen ? " rotate-180" : ""
                }`}
              >
                {arrowIcon}
              </span>
            </button>
            <div
              className={`will-change-max-height`}
              ref={(el) => {
                panelRefs.current[secIdx] = el;
              }}
              style={{
                maxHeight: isOpen
                  ? (panelRefs.current[secIdx]?.scrollHeight ?? 0) + 32 + "px"
                  : "0px",
                overflow: "hidden",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                padding: isOpen ? "0 0 32px 0" : "0",
              }}
            >
              <div className="ff-manrope text-lg font-light text-[#222]">
                {section.richText}
              </div>
              <div className="w-max mt-4 px-4 ms-auto">
                <Button
                  href=""
                  text={applyLabel}
                  icon={<Icons.ArrowRight className="h-3 mt-1" />}
                  variant="link-with-icon"
                  color="black"
                />
              </div>
            </div>
            <div
              className={`careers-accordion__divider absolute left-0 right-0 bottom-0 h-[2px] bg-[#e5e5e5]${
                secIdx === sections.length - 1 ? " hidden" : ""
              }`}
            />
          </div>
        );
      })}
    </div>
  );
};

export default CareersAccordion;

const defaultArrow = (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8 10L12 14L16 10"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
