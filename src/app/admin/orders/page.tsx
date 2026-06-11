import { getOrders } from "@/services/orders";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const dynamic = "force-dynamic";

const statusVariant: Record<string, "default" | "success" | "warning" | "secondary" | "destructive"> = {
  PENDING: "warning",
  CONFIRMED: "default",
  PACKED: "default",
  SHIPPED: "default",
  DELIVERED: "success",
  CANCELLED: "destructive",
  RETURNED: "secondary",
  REFUNDED: "secondary",
};

export default async function AdminOrdersPage() {
  const { orders, total } = await getOrders({ limit: 50 });

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-white mb-2">Orders</h1>
      <p className="text-white/50 mb-8">{total} total orders</p>

      {orders.length === 0 ? (
        <div className="glass-card p-12 text-center border-white/10">
          <p className="text-white/50">No orders yet</p>
        </div>
      ) : (
        <div className="glass-card border-white/10 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead className="text-white/60">Order #</TableHead>
                <TableHead className="text-white/60">Customer</TableHead>
                <TableHead className="text-white/60">Channel</TableHead>
                <TableHead className="text-white/60">Total</TableHead>
                <TableHead className="text-white/60">Status</TableHead>
                <TableHead className="text-white/60">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} className="border-white/10">
                  <TableCell className="text-white font-medium">{order.orderNumber}</TableCell>
                  <TableCell className="text-white/60">
                    {order.customer
                      ? `${order.customer.firstName} ${order.customer.lastName || ""}`
                      : "Walk-in"}
                  </TableCell>
                  <TableCell className="text-white/60">{order.channel}</TableCell>
                  <TableCell className="text-white">{formatCurrency(order.grandTotal.toNumber())}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[order.status] || "secondary"}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-white/60">{formatDateTime(order.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
