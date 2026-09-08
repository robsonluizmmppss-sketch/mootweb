"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { UploadCloud, Loader2 } from "lucide-react";

export function MediaUploader({ folder = "geral" }: { folder?: string }) {
  const router = useRouter();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [busy, setBusy] = React.useState(false);
  const [drag, setDrag] = React.useState(false);

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.set("file", file);
        fd.set("folder", folder);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Falha no upload");
      }
      toast.success("Upload concluído");
      router.refresh();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        upload(e.dataTransfer.files);
      }}
      className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-colors ${
        drag ? "border-primary/50 bg-primary/5" : "border-white/10 bg-white/[0.02]"
      }`}
    >
      {busy ? (
        <Loader2 className="size-6 animate-spin text-accent" />
      ) : (
        <UploadCloud className="size-6 text-muted-foreground" />
      )}
      <p className="mt-3 text-sm text-muted-foreground">
        Arraste arquivos aqui ou{" "}
        <button
          type="button"
          className="text-accent hover:underline"
          onClick={() => inputRef.current?.click()}
        >
          selecione
        </button>
      </p>
      <p className="mt-1 text-xs text-muted-foreground/60">
        PNG, JPG, WEBP, SVG, GIF, MP4, WEBM, PDF — até 15 MB
      </p>
      <input
        ref={inputRef}
        type="file"
        multiple
        hidden
        accept="image/*,video/mp4,video/webm,application/pdf"
        onChange={(e) => upload(e.target.files)}
      />
    </div>
  );
}
