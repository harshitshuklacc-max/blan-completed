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
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function BarcodesPage() {
  const barcodes = await prisma.barcode.findMany({
    include: { product: { select: { name: true, sku: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-white mb-2">Barcodes</h1>
      <p className="text-white/50 mb-8">{barcodes.length} barcode records in Neon PostgreSQL</p>

      {barcodes.length === 0 ? (
        <div className="glass-card p-12 text-center border-white/10">
          <p className="text-white/50">No barcodes yet. Add products to generate barcodes.</p>
        </div>
      ) : (
        <div className="glass-card border-white/10 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead className="text-white/60">Code</TableHead>
                <TableHead className="text-white/60">Type</TableHead>
                <TableHead className="text-white/60">Product</TableHead>
                <TableHead className="text-white/60">SKU</TableHead>
                <TableHead className="text-white/60">Primary</TableHead>
                <TableHead className="text-white/60">Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {barcodes.map((bc) => (
                <TableRow key={bc.id} className="border-white/10">
                  <TableCell className="text-white font-mono">{bc.code}</TableCell>
                  <TableCell><Badge variant="secondary">{bc.type}</Badge></TableCell>
                  <TableCell className="text-white">{bc.product.name}</TableCell>
                  <TableCell className="text-white/60">{bc.product.sku}</TableCell>
                  <TableCell>{bc.isPrimary ? "Yes" : "No"}</TableCell>
                  <TableCell className="text-white/60">{formatDateTime(bc.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
