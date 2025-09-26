"use client";
import React from "react";
import { Toaster, ToastBar, ToasterProps } from "react-hot-toast";

/**
 * Global toaster provider. Import `toast` from 'react-hot-toast' directly or
 * re-export from this module for convenience.
 */
const ToasterProvider = (props: Partial<ToasterProps>) => {
  return (
    <Toaster
      position={props.position || "bottom-right"}
      toastOptions={{
        duration: 3500,
        style: { fontSize: "13px", borderRadius: "10px", padding: "10px 14px" },
        success: { style: { background: "#0f766e", color: "white" } },
        error: { style: { background: "#b91c1c", color: "white" } },
      }}
      gutter={8}
    >
      {(t) => (
        <ToastBar toast={t} style={{ ...t.style, animation: "fadeIn 0.3s" }}>
          {({ icon, message }) => (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {icon}
              <div>{message}</div>
            </div>
          )}
        </ToastBar>
      )}
    </Toaster>
  );
};

export default ToasterProvider;
