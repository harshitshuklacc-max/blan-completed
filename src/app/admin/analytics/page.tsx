import { getDashboardStats, getRevenueChart } from "@/lib/analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const [stats, chart] = await Promise.all([
    getDashboardStats(),
    getRevenueChart(30),
  ]);

  const maxRevenue = Math.max(...chart.map((d) => d.revenue), 1);

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-white mb-8">Analytics</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Products", value: stats.totalProducts },
          { label: "Orders", value: stats.totalOrders },
          { label: "Customers", value: stats.totalCustomers },
          { label: "Revenue (30d)", value: formatCurrency(stats.monthRevenue) },
        ].map((s) => (
          <Card key={s.label} className="glass-card border-white/10">
            <CardContent className="pt-6">
              <p className="text-white/50 text-sm">{s.label}</p>
              <p className="text-2xl font-bold text-white">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="glass-card border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Revenue — Last 30 Days</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-1 h-48">
            {chart.map((day) => (
              <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-red-600/80 rounded-t min-h-[2px]"
                  style={{ height: `${(day.revenue / maxRevenue) * 100}%` }}
                  title={`${day.date}: ${formatCurrency(day.revenue)}`}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-white/40">
            <span>{chart[0]?.date}</span>
            <span>{chart[chart.length - 1]?.date}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
