import { useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { FileDown, LineChart as LineChartIcon, BarChart2 } from "lucide-react"
import GlucoseChart from "../components/GlucoseChart"
import DoseChart from "../components/DoseChart"
import StatsCards from "../components/StatsCards"
import { downloadPdf } from "../lib/downloadPdf"
import { useToast } from "../hooks/use-toast"

export default function ChartsPage() {
  const chartsRef = useRef(null)
  const { toast } = useToast()
  const handleExportPDF = async () => {
    if (!chartsRef.current) return
    try {
      const { default: jsPDF } = await import("jspdf")
      const { toPng } = await import("html-to-image")
      const { width, height } = chartsRef.current.getBoundingClientRect()
      const pixelRatio = Math.min(2, window.devicePixelRatio || 1)
      const exportWidth = Math.ceil(width * pixelRatio)
      const exportHeight = Math.ceil(height * pixelRatio)
      const imgData = await toPng(chartsRef.current, { cacheBust: true, pixelRatio, backgroundColor: "#ffffff" })
      const orientation = exportWidth >= exportHeight ? "landscape" : "portrait"
      const pdf = new jsPDF({ orientation, unit: "px", format: [exportWidth, exportHeight] })
      pdf.addImage(imgData, "PNG", 0, 0, exportWidth, exportHeight)
      downloadPdf(pdf, "insulin-charts.pdf")
    } catch (error) {
      console.error("PDF export failed", error)
      toast({ title: "Export failed", description: "Unable to generate the PDF. Please try again." })
    }
  }
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2"><LineChartIcon className="h-6 w-6 text-primary" />Analytics</h1>
          <p className="text-muted-foreground text-sm mt-1">Visual overview of your glucose trends and insulin usage.</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleExportPDF}><FileDown className="h-4 w-4 mr-2" />Export PDF</Button>
      </div>
      <div ref={chartsRef} className="space-y-6">
        <StatsCards />
        <Card className="border shadow-sm">
          <CardHeader className="pb-2"><CardTitle className="text-base font-semibold flex items-center gap-2"><LineChartIcon className="h-4 w-4 text-primary" />Glucose Readings Over Time</CardTitle><CardDescription>Shaded area = normal range (70–180 mg/dL). Dashed lines show thresholds.</CardDescription></CardHeader>
          <CardContent><GlucoseChart /></CardContent>
        </Card>
        <Card className="border shadow-sm">
          <CardHeader className="pb-2"><CardTitle className="text-base font-semibold flex items-center gap-2"><BarChart2 className="h-4 w-4 text-primary" />Average Dose by Insulin Type</CardTitle><CardDescription>Average units administered per insulin type across all entries.</CardDescription></CardHeader>
          <CardContent><DoseChart /></CardContent>
        </Card>
      </div>
    </div>
  )
}
