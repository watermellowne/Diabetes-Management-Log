import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card"
import { Separator } from "../components/ui/separator"
import LogForm from "../components/LogForm"
import LogTable from "../components/LogTable"
import { ClipboardList } from "lucide-react"

export default function LogPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2"><ClipboardList className="h-6 w-6 text-primary" />Insulin Log</h1>
        <p className="text-muted-foreground text-sm mt-1">Record your daily glucose readings and insulin doses.</p>
      </div>
      <Card className="border shadow-sm">
        <CardHeader className="pb-3"><CardTitle className="text-base font-semibold">New Entry</CardTitle><CardDescription>Safety alerts trigger automatically: Low &lt;70 mg/dL, High &gt;180 mg/dL.</CardDescription></CardHeader>
        <CardContent><LogForm /></CardContent>
      </Card>
      <Separator />
      <Card className="border shadow-sm">
        <CardHeader className="pb-3"><CardTitle className="text-base font-semibold">Log History</CardTitle><CardDescription>All your recorded entries, most recent first.</CardDescription></CardHeader>
        <CardContent><LogTable /></CardContent>
      </Card>
    </div>
  )
}
