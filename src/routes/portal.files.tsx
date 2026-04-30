import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Upload, FileText, Image as ImageIcon, Shield, Download, Eye, Loader2 } from "lucide-react";
import { PortalGate } from "@/components/portal/PortalGate";
import { sampleClient } from "@/data/sampleClient";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const Route = createFileRoute("/portal/files")({
  head: () => ({ meta: [{ title: "Files & Documents — AWH Client Portal" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <PortalGate>
      <FilesPage />
    </PortalGate>
  ),
});

function FilesPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = () => inputRef.current?.click();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      toast.success("File uploaded", { description: file.name });
      if (inputRef.current) inputRef.current.value = "";
    }, 1500);
  };

  const filterBy = (type?: string) =>
    type ? sampleClient.files.filter((f) => f.type === type) : sampleClient.files;

  return (
    <div className="space-y-6">
      <div
        onClick={handleUpload}
        className="cursor-pointer rounded-2xl border-2 border-dashed border-navy/20 bg-white px-6 py-10 text-center transition-colors hover:border-brand-red hover:bg-brand-red/5"
      >
        <input ref={inputRef} type="file" className="hidden" onChange={handleFile} />
        {uploading ? (
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-brand-red" />
        ) : (
          <Upload className="mx-auto h-8 w-8 text-navy/50" />
        )}
        <div className="mt-3 font-accent font-semibold text-navy">
          {uploading ? "Uploading…" : "Drag & drop your file here or click to browse"}
        </div>
        <div className="mt-1 text-xs text-navy/50">Supported: PDF, DOCX, JPG, PNG — Max 50MB</div>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="bg-white">
          <TabsTrigger value="all">All Files</TabsTrigger>
          <TabsTrigger value="Manuscript">Manuscripts</TabsTrigger>
          <TabsTrigger value="Contract">Contracts & NDAs</TabsTrigger>
          <TabsTrigger value="Cover">Design Files</TabsTrigger>
          <TabsTrigger value="Brief">Briefs</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4"><FileGrid files={filterBy()} /></TabsContent>
        <TabsContent value="Manuscript" className="mt-4"><FileGrid files={filterBy("Manuscript")} /></TabsContent>
        <TabsContent value="Contract" className="mt-4">
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-brand-red/10 px-4 py-3 text-sm text-brand-red">
            <Shield className="h-4 w-4" />
            <span className="font-semibold">Legally Binding Document</span>
          </div>
          <FileGrid files={filterBy("Contract")} />
        </TabsContent>
        <TabsContent value="Cover" className="mt-4"><FileGrid files={filterBy("Cover")} /></TabsContent>
        <TabsContent value="Brief" className="mt-4"><FileGrid files={filterBy("Brief")} /></TabsContent>
      </Tabs>
    </div>
  );
}

function FileGrid({ files }: { files: typeof sampleClient.files }) {
  if (files.length === 0) {
    return <div className="card-portal text-center text-sm text-navy/50">No files in this category yet.</div>;
  }
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {files.map((file, idx) => (
        <motion.div
          key={file.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.04 }}
          whileHover={{ x: 2 }}
          className="card-portal group relative flex items-center gap-4 overflow-hidden"
        >
          <div className="absolute left-0 top-0 bottom-0 w-0 bg-brand-red transition-all group-hover:w-1" />
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-navy/5 text-navy">
            {file.type === "Contract" ? <Shield className="h-5 w-5" /> :
             file.type === "Cover" ? <ImageIcon className="h-5 w-5" /> :
             <FileText className="h-5 w-5" />}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate font-accent text-sm font-semibold text-navy">{file.name}</div>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-navy/50">
              <span className="rounded-full bg-navy/5 px-2 py-0.5 font-semibold uppercase tracking-wider">
                {file.type}
              </span>
              <span>{file.uploadedBy}</span>
              <span>·</span>
              <span>{file.date}</span>
              <span>·</span>
              <span>{file.size}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.success("File downloaded", { description: file.name })}
              className="border-brand-red/30 text-brand-red hover:bg-brand-red hover:text-white"
            >
              <Download className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => toast.info("Preview unavailable in demo")}>
              <Eye className="h-3.5 w-3.5" />
            </Button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
