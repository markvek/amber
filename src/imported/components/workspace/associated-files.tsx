"use client";

import { useState } from "react";
import { FileText, UploadCloud } from "lucide-react";

import { cn } from "@/lib/utils";

export type FileEntry = { name: string; meta: string };

function formatSize(bytes: number) {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${bytes} B`;
}

export function AssociatedFiles({ initialFiles }: { initialFiles: FileEntry[] }) {
  const [files, setFiles] = useState(initialFiles);
  const [dragOver, setDragOver] = useState(false);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = [...e.dataTransfer.files].map((f) => ({
      name: f.name,
      meta: `${formatSize(f.size)} · just added`,
    }));
    if (dropped.length) setFiles((prev) => [...prev, ...dropped]);
  };

  return (
    <div className="col-span-2 rounded-xl p-5 ring-1 ring-foreground/10 md:col-span-4">
      <p className="text-sm font-medium">Associated files</p>
      <ul className="mt-3 divide-y divide-border">
        {files.map((file, i) => (
          <li key={`${file.name}-${i}`} className="flex items-center gap-3 py-2 text-sm">
            <FileText className="size-4 shrink-0 text-muted-foreground" />
            <span className="min-w-0 flex-1 truncate font-medium">{file.name}</span>
            <span className="shrink-0 text-xs text-muted-foreground">{file.meta}</span>
          </li>
        ))}
      </ul>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={cn(
          "mt-3 flex flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed px-4 py-6 text-center transition-colors",
          dragOver
            ? "border-border-accent bg-muted/50 text-accent"
            : "text-muted-foreground"
        )}
      >
        <UploadCloud className="size-5" />
        <p className="text-sm font-medium">Drag files here to attach</p>
      </div>
    </div>
  );
}
