import { BusyImportForm } from "@/components/admin/busy-import-form";
import prisma from "@/lib/db";
import { formatDateTime } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function ImportPage() {
  const logs = await prisma.busyImportLog.findMany({
    include: { admin: { select: { username: true } } },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl font-bold text-white">BUSY PDF Import</h1>
      <BusyImportForm />

      {logs.length > 0 && (
        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Import History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-white/10">
                  <TableHead className="text-white/60">File</TableHead>
                  <TableHead className="text-white/60">Added</TableHead>
                  <TableHead className="text-white/60">Updated</TableHead>
                  <TableHead className="text-white/60">Failed</TableHead>
                  <TableHead className="text-white/60">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id} className="border-white/10">
                    <TableCell className="text-white">{log.fileName}</TableCell>
                    <TableCell className="text-green-400">{log.addedCount}</TableCell>
                    <TableCell className="text-blue-400">{log.updatedCount}</TableCell>
                    <TableCell className="text-red-400">{log.failedCount}</TableCell>
                    <TableCell className="text-white/60">{formatDateTime(log.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
