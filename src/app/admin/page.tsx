import { getDashboardStats, getRevenueChart } from "@/lib/analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, Users, TrendingUp } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [stats, revenueChart] = await Promise.all([
    getDashboardStats(),
    getRevenueChart(7),
  ]);

  const statCards = [
    { label: "Total Products", value: stats.totalProducts, icon: Package },
    { label: "Total Orders", value: stats.totalOrders, icon: ShoppingCart },
    { label: "Customers", value: stats.totalCustomers, icon: Users },
    { label: "Monthly Revenue", value: formatCurrency(stats.monthRevenue), icon: TrendingUp },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-white mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <Card key={stat.label} className="glass-card border-white/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-white/60">
                {stat.label}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Today&apos;s Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-red-500">{stats.todayOrders}</div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Low Stock Alert</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.lowStockProducts.length === 0 ? (
              <p className="text-white/50">All products are well stocked</p>
            ) : (
              <ul className="space-y-2">
                {stats.lowStockProducts.map((item) => (
                  <li key={item.id} className="flex justify-between text-sm">
                    <span className="text-white/70">{item.product.name}</span>
                    <span className="text-red-400">{item.quantity} left</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card border-white/10 mt-6">
        <CardHeader>
          <CardTitle className="text-white">Revenue (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {revenueChart.slice(-7).map((day) => (
              <div key={day.date} className="flex justify-between text-sm">
                <span className="text-white/60">{day.date}</span>
                <span className="text-white">{formatCurrency(day.revenue)}</span>
                <span className="text-white/40">{day.orders} orders</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
