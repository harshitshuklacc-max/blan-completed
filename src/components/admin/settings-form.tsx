"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SettingsFormProps {
  settings: {
    storeName: string;
    storeAddress: string;
    storePhone: string;
    taxRate: number;
    invoicePrefix: string;
    invoiceRetentionDays: number;
    defaultBarcodeType: string;
    razorpayEnabled: boolean;
    codEnabled: boolean;
  };
}

export function SettingsForm({ settings }: SettingsFormProps) {
  const [form, setForm] = useState(settings);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSave() {
    setLoading(true);
    setSuccess(false);

    const entries = [
      { key: "store_name", value: form.storeName, group: "store" },
      { key: "store_address", value: form.storeAddress, group: "store" },
      { key: "store_phone", value: form.storePhone, group: "store" },
      { key: "tax_rate", value: form.taxRate, group: "tax" },
      { key: "invoice_prefix", value: form.invoicePrefix, group: "invoice" },
      { key: "invoice_retention_days", value: form.invoiceRetentionDays, group: "invoice" },
      { key: "default_barcode_type", value: form.defaultBarcodeType, group: "barcode" },
    ];

    try {
      for (const entry of entries) {
        await fetch("/api/admin/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(entry),
        });
      }
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="glass-card border-white/10">
      <CardHeader>
        <CardTitle className="text-white">Store Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Store Name</Label>
            <Input
              value={form.storeName}
              onChange={(e) => setForm({ ...form, storeName: e.target.value })}
              className="bg-white/5 border-white/10"
            />
          </div>
          <div className="space-y-2">
            <Label>Store Phone</Label>
            <Input
              value={form.storePhone}
              onChange={(e) => setForm({ ...form, storePhone: e.target.value })}
              className="bg-white/5 border-white/10"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Store Address</Label>
          <Input
            value={form.storeAddress}
            onChange={(e) => setForm({ ...form, storeAddress: e.target.value })}
            className="bg-white/5 border-white/10"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Tax Rate (%)</Label>
            <Input
              type="number"
              value={form.taxRate}
              onChange={(e) => setForm({ ...form, taxRate: parseFloat(e.target.value) || 0 })}
              className="bg-white/5 border-white/10"
            />
          </div>
          <div className="space-y-2">
            <Label>Invoice Prefix</Label>
            <Input
              value={form.invoicePrefix}
              onChange={(e) => setForm({ ...form, invoicePrefix: e.target.value })}
              className="bg-white/5 border-white/10"
            />
          </div>
          <div className="space-y-2">
            <Label>Invoice Retention (days)</Label>
            <Input
              type="number"
              value={form.invoiceRetentionDays}
              onChange={(e) => setForm({ ...form, invoiceRetentionDays: parseInt(e.target.value) || 365 })}
              className="bg-white/5 border-white/10"
            />
          </div>
        </div>

        {success && <p className="text-green-400 text-sm">Settings saved to database</p>}

        <Button variant="luxury" onClick={handleSave} disabled={loading}>
          {loading ? "Saving..." : "Save Settings"}
        </Button>
      </CardContent>
    </Card>
  );
}
