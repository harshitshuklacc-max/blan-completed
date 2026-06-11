"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText } from "lucide-react";

export function BusyImportForm() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    addedCount: number;
    updatedCount: number;
    failedCount: number;
    skippedCount?: number;
    parsedCount?: number;
    totalLinesScanned?: number;
    errors: string[];
  } | null>(null);
  const [error, setError] = useState("");

  async function handleImport() {
    if (!file) return;
    setLoading(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/import/busy", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Import failed");
        if (data.parsedCount !== undefined) setResult(data);
        return;
      }

      setResult(data);
      setFile(null);
    } catch {
      setError("Connection error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="glass-card border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Upload className="h-5 w-5 text-red-500" />
          BUSY Software PDF Import
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-white/60 text-sm">
          Upload a BUSY stock/item list PDF. Only rows with a real product name, valid
          barcode, and price are imported. Headers, totals, and incomplete lines are skipped —
          no fake or placeholder products are created.
        </p>

        <div className="border-2 border-dashed border-white/10 rounded-lg p-8 text-center">
          <FileText className="h-12 w-12 text-white/20 mx-auto mb-4" />
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="text-white/60 text-sm"
          />
          {file && (
            <p className="text-white mt-2 text-sm">Selected: {file.name}</p>
          )}
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        {result && (
          <div className="glass-card p-4 border-white/10 space-y-2">
            <p className="text-green-400 font-medium">
              {result.parsedCount === 0 ? "No Valid Products Found" : "Import Complete"}
            </p>
            {result.parsedCount !== undefined && (
              <p className="text-white/60 text-sm">Valid products parsed: {result.parsedCount}</p>
            )}
            <p className="text-white/60 text-sm">Added: {result.addedCount}</p>
            <p className="text-white/60 text-sm">Updated: {result.updatedCount}</p>
            <p className="text-white/60 text-sm">Skipped (invalid): {result.skippedCount ?? 0}</p>
            <p className="text-white/60 text-sm">Failed: {result.failedCount}</p>
            {result.errors.length > 0 && (
              <div className="mt-2">
                <p className="text-red-400 text-sm font-medium">Errors:</p>
                {result.errors.map((err, i) => (
                  <p key={i} className="text-red-400/70 text-xs">{err}</p>
                ))}
              </div>
            )}
          </div>
        )}

        <Button
          variant="luxury"
          onClick={handleImport}
          disabled={!file || loading}
          className="w-full"
        >
          {loading ? "Importing..." : "Import PDF"}
        </Button>
      </CardContent>
    </Card>
  );
}
