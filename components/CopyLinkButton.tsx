"use client";

import React, { useState } from "react";
import { Button } from "./Button";

export function CopyLinkButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error("Failed to copy URL:", e);
    }
  };

  return (
    <Button onClick={handleCopy} variant="secondary" className="py-1.5 px-4 text-xs font-semibold">
      {copied ? "Copied!" : "Copy Report Link"}
    </Button>
  );
}
