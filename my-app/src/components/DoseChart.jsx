import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { useInsulinStats } from "../hooks/useInsulinStats"
import { Skeleton } from "./ui/skeleton"

const TYPE_COLORS = {
  "Rapid-acting": "hsl(217 91% 60%)",
  "Long-acting": "hsl(262 52% 60%)",
  "NPH": "hsl(142 71% 45%)",
  "Pre-mixed": "hsl(25 95% 53%)",
}

export default function DoseChart() {
  const { stats, isLoading } = useInsulinStats()
  if (isLoading) return <Skeleton className="h-64 w-full" />
  if (!stats || stats.byInsulinType.length === 0) return <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">No data available yet.</div>
  const data = stats.byInsulinType.map((t) => ({ type: t.insulinType, avgDose: Math.round(t.avgDose * 10) / 10 }))
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(231 20% 90%)" vertical={false} />
        <XAxis dataKey="type" tick={{ fontSize: 11, fill: "hsl(231 20% 40%)" }} tickLine={false} axisLine={{ stroke: "hsl(231 20% 88%)" }} angle={-15} textAnchor="end" interval={0} />
        <YAxis tick={{ fontSize: 11, fill: "hsl(231 20% 40%)" }} tickLine={false} axisLine={false} unit=" u" width={45} />
        <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid hsl(231 20% 90%)", fontSize: "12px" }} formatter={(v, n) => n === "avgDose" ? [`${v} units`, "Avg Dose"] : [v, n]} />
        <Bar dataKey="avgDose" name="avgDose" radius={[4, 4, 0, 0]}>
          {data.map((entry) => <Cell key={entry.type} fill={TYPE_COLORS[entry.type] ?? "hsl(231 33% 56%)"} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
