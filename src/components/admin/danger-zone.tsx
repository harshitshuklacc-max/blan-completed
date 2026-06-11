"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertTriangle } from "lucide-react";

export function DangerZone() {
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [action, setAction] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleExecute() {
    if (confirmation !== "DELETE") {
      setError('Type "DELETE" to confirm');
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/admin/danger-zone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, confirmation, action }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Operation failed");
        return;
      }

      setSuccess(`Operation "${action}" completed successfully`);
      setPassword("");
      setConfirmation("");
    } catch {
      setError("Connection error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="border-red-500/30 bg-red-500/5">
      <CardHeader>
        <CardTitle className="text-red-400 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Danger Zone
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-white/60 text-sm">
          These actions are irreversible. All data is permanently deleted from Neon PostgreSQL.
          Admin password and DELETE confirmation required.
        </p>

        <div className="space-y-2">
          <Label>Action</Label>
          <Select value={action} onValueChange={setAction}>
            <SelectTrigger className="bg-white/5 border-white/10">
              <SelectValue placeholder="Select action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="delete_products">Delete All Products</SelectItem>
              <SelectItem value="delete_inventory">Delete All Inventory</SelectItem>
              <SelectItem value="delete_orders">Delete All Orders</SelectItem>
              <SelectItem value="factory_reset">Factory Reset</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Admin Password</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-white/5 border-white/10"
          />
        </div>

        <div className="space-y-2">
          <Label>Type DELETE to confirm</Label>
          <Input
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
            className="bg-white/5 border-white/10"
            placeholder="DELETE"
          />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}
        {success && <p className="text-green-400 text-sm">{success}</p>}

        <Button
          variant="destructive"
          onClick={handleExecute}
          disabled={!action || !password || loading}
        >
          {loading ? "Executing..." : "Execute"}
        </Button>
      </CardContent>
    </Card>
  );
}
