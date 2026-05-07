import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ReferenceArea, Legend } from "recharts"
import { useInsulinStats } from "../hooks/useInsulinStats"
import { Skeleton } from "./ui/skeleton"

export default function GlucoseChart() {
  const { stats, isLoading } = useInsulinStats()
  if (isLoading) return <Skeleton className="h-72 w-full" />
  if (!stats || stats.byDate.length === 0) return <div className="h-72 flex items-center justify-center text-muted-foreground text-sm">No data available yet.</div>
  const data = stats.byDate.map((d) => ({ date: d.date, avg: Math.round(d.avgGlucose * 10) / 10, min: d.minGlucose, max: d.maxGlucose }))
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(231 20% 90%)" />
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(231 20% 40%)" }} tickLine={false} axisLine={{ stroke: "hsl(231 20% 88%)" }} />
        <YAxis domain={[40, "auto"]} tick={{ fontSize: 11, fill: "hsl(231 20% 40%)" }} tickLine={false} axisLine={false} unit=" mg/dL" width={75} />
        <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid hsl(231 20% 90%)", fontSize: "12px" }} formatter={(v, n) => [`${v} mg/dL`, n]} />
        <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }} />
        <ReferenceArea y1={70} y2={180} fill="hsl(231 33% 56% / 0.06)" />
        <ReferenceLine y={70} stroke="hsl(38 92% 50%)" strokeDasharray="4 4" label={{ value: "70", fontSize: 10, fill: "hsl(38 92% 40%)" }} />
        <ReferenceLine y={180} stroke="hsl(0 84% 60%)" strokeDasharray="4 4" label={{ value: "180", fontSize: 10, fill: "hsl(0 84% 50%)" }} />
        <Line type="monotone" dataKey="avg" name="Avg Glucose" stroke="hsl(231 33% 56%)" strokeWidth={2.5} dot={{ r: 4, fill: "hsl(231 33% 56%)", strokeWidth: 0 }} activeDot={{ r: 6 }} />
        <Line type="monotone" dataKey="min" name="Min Glucose" stroke="hsl(142 71% 45%)" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
        <Line type="monotone" dataKey="max" name="Max Glucose" stroke="hsl(0 84% 60%)" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}
