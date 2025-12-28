"use client";

import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("");

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setStatus("Generating secure URL & uploading...");

    try {
      const res = await fetch("/api/presigned", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: selectedFile.name,
          filetype: selectedFile.type,
        }),
      });

      const { url } = await res.json();
      console.log("Presigned URL:", url);

      await fetch(url, {
        method: "PUT",
        body: selectedFile,
        headers: {
          "Content-Type": selectedFile.type || "application/octet-stream",
        },
      });

      setStatus("Uploaded successfully! 🔥");
    } catch (err) {
      setStatus("Upload failed 😢");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="max-w-2xl w-full text-center space-y-12">
        {/* Title */}
        <div>
          <h1 className="text-6xl md:text-8xl font-bold text-white tracking-tighter">
            DropZone
          </h1>
          <p className="text-zinc-500 text-lg mt-4">
            by Krishnendu Sukumar
          </p>
        </div>

        {/* Upload Area */}
        <div className="space-y-8">
          <div className="relative">
            <input
              type="file"
              onChange={handleUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="border-4 border-dashed border-zinc-700 rounded-3xl h-64 flex items-center justify-center hover:border-zinc-500 transition-all duration-300 bg-zinc-950/50">
              <div className="space-y-4">
                <div className="text-6xl">📨</div>
                <p className="text-zinc-400 text-xl">
                  {file ? file.name : "Click or drop file here"}
                </p>
              </div>
            </div>
          </div>

          {/* Status */}
          {status && (
            <p
              className={`text-2xl font-semibold ${
                status.includes("success") ? "text-green-400" : "text-white"
              } animate-pulse`}
            >
              {status}
            </p>
          )}
        </div>

        {/* Footer */}
        <p className="text-zinc-600 text-sm">
          Direct S3 upload • Presigned URLs • Zero backend server
        </p>
      </div>
    </div>
  );
}