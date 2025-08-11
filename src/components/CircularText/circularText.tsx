"use client";
import React, { useEffect, useState } from "react";
import DoubleQuotes from "@/icons/double-quotes.svg";

interface CircularTextProps {
  textArray: string[];
  diameter: number;
  icon?: React.ReactNode;
  letterSpacing: number;
  startAngle?: number; // in degrees, where 0 = top, clockwise
  circularRef?: React.Ref<SVGSVGElement>;
}

const CircularText: React.FC<CircularTextProps> = ({
  textArray,
  diameter,
  icon,
  letterSpacing,
  startAngle = 0,
  circularRef,
}) => {
  const [fontSize, setFontSize] = useState(14);

  // Build seamless text
  const text = textArray.join(" - ") + " - ";
  const radius = diameter / 2 - 8;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let size = 12;
    ctx.font = `${size}px sans-serif`;
    const textWidth = ctx.measureText(text).width + letterSpacing * text.length;

    // Scale font size to perfectly fill circumference
    size = (circumference / textWidth) * size;
    setFontSize(size);
  }, [text, circumference, letterSpacing]);

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: diameter, height: diameter }}
    >
      <svg
        viewBox={`0 0 ${diameter + 40} ${diameter + 40}`}
        className="absolute w-full h-full z-10"
        ref={circularRef}
      >
        <defs>
          <path
            id="circlePath"
            d={`
              M ${(diameter + 40) / 2}, ${(diameter + 40) / 2}
              m -${radius},0
              a ${radius},${radius} 0 1,1 ${radius * 2},0
              a ${radius},${radius} 0 1,1 -${radius * 2},0
            `}
          />
        </defs>
        <g
          transform={`rotate(${startAngle}, ${(diameter + 40) / 2}, ${
            (diameter + 40) / 2
          })`}
        >
          <text
            fill="white"
            style={{
              fontSize: `${fontSize}px`,
              textTransform: "uppercase",
              letterSpacing: `${letterSpacing}px`,
            }}
          >
            <textPath href="#circlePath" startOffset="0%">
              {/* Repeat enough times to fill without gaps */}
              {text.repeat(3)}
            </textPath>
          </text>
        </g>
      </svg>

      {icon || <DoubleQuotes className="h-28" />}
    </div>
  );
};

export default CircularText;
