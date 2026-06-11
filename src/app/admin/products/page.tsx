import Link from "next/link";
import { getProducts } from "@/services/products";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const { products, total } = await getProducts({ limit: 50, status: "ALL" });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Products</h1>
          <p className="text-white/50 mt-1">{total} products in database</p>
        </div>
        <Link href="/admin/products/new">
          <Button variant="luxury" className="gap-2">
            <Plus className="h-4 w-4" /> Add Product
          </Button>
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="glass-card p-12 text-center border-white/10">
          <p className="text-white/50 mb-4">No products yet. Add your first product or import from BUSY PDF.</p>
          <Link href="/admin/products/new">
            <Button variant="luxury">Add Product</Button>
          </Link>
        </div>
      ) : (
        <div className="glass-card border-white/10 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-white/60">Name</TableHead>
                <TableHead className="text-white/60">SKU</TableHead>
                <TableHead className="text-white/60">Price</TableHead>
                <TableHead className="text-white/60">Stock</TableHead>
                <TableHead className="text-white/60">Status</TableHead>
                <TableHead className="text-white/60">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id} className="border-white/10">
                  <TableCell className="text-white font-medium">{product.name}</TableCell>
                  <TableCell className="text-white/60">{product.sku}</TableCell>
                  <TableCell className="text-white">{formatCurrency(product.sellingPrice.toNumber())}</TableCell>
                  <TableCell className="text-white/60">{product.inventory?.quantity ?? 0}</TableCell>
                  <TableCell>
                    <Badge variant={product.status === "ACTIVE" ? "success" : "secondary"}>
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Link href={`/admin/products/${product.id}`}>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
