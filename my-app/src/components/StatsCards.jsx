import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Skeleton } from "./ui/skeleton"
import { Activity, TrendingDown, TrendingUp, AlertTriangle, BarChart2, Clipboard } from "lucide-react"
import { useInsulinStats } from "../hooks/useInsulinStats"

export default function StatsCards() {
  const { stats, isLoading } = useInsulinStats()
  if (isLoading) return <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-28" />)}</div>
  if (!stats) return null
  const cards = [
    { label: "Avg Glucose", value: `${stats.avgGlucose.toFixed(1)} mg/dL`, icon: Activity, color: "text-primary", bg: "bg-primary/10" },
    { label: "Min Glucose", value: `${stats.minGlucose} mg/dL`, icon: TrendingDown, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Max Glucose", value: `${stats.maxGlucose} mg/dL`, icon: TrendingUp, color: "text-rose-600", bg: "bg-rose-50" },
    { label: "Total Entries", value: stats.totalEntries, icon: Clipboard, color: "text-primary", bg: "bg-primary/10" },
    { label: "Low Alerts", value: stats.lowAlerts, icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "High Alerts", value: stats.highAlerts, icon: BarChart2, color: "text-red-600", bg: "bg-red-50" },
  ]
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
      {cards.map(({ label, value, icon: Icon, color, bg }) => (
        <Card key={label} className="border shadow-sm">
          <CardHeader className="pb-1 pt-4 px-4">
            <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center mb-2`}><Icon className={`h-4 w-4 ${color}`} /></div>
            <CardTitle className="text-xs font-medium text-muted-foreground">{label}</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4"><p className="text-xl font-bold text-foreground">{value}</p></CardContent>
        </Card>
      ))}
    </div>
  )
}
