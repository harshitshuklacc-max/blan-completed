import prisma from "@/lib/db";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const dynamic = "force-dynamic";

export default async function InvoicesPage() {
  const invoices = await prisma.invoice.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { _count: { select: { items: true } } },
  });

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-white mb-2">Invoices</h1>
      <p className="text-white/50 mb-8">{invoices.length} invoices stored in Neon PostgreSQL</p>

      {invoices.length === 0 ? (
        <div className="glass-card p-12 text-center border-white/10">
          <p className="text-white/50">No invoices yet. Complete a POS or online sale to generate invoices.</p>
        </div>
      ) : (
        <div className="glass-card border-white/10 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead className="text-white/60">Invoice #</TableHead>
                <TableHead className="text-white/60">Customer</TableHead>
                <TableHead className="text-white/60">Channel</TableHead>
                <TableHead className="text-white/60">Items</TableHead>
                <TableHead className="text-white/60">Total</TableHead>
                <TableHead className="text-white/60">Payment</TableHead>
                <TableHead className="text-white/60">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((inv) => (
                <TableRow key={inv.id} className="border-white/10">
                  <TableCell className="text-white font-medium">{inv.invoiceNumber}</TableCell>
                  <TableCell className="text-white/60">{inv.customerName || "Walk-in"}</TableCell>
                  <TableCell><Badge variant="secondary">{inv.channel}</Badge></TableCell>
                  <TableCell className="text-white/60">{inv._count.items}</TableCell>
                  <TableCell className="text-white">{formatCurrency(inv.grandTotal.toNumber())}</TableCell>
                  <TableCell className="text-white/60">{inv.paymentMethod}</TableCell>
                  <TableCell className="text-white/60">{formatDateTime(inv.invoiceDate)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
