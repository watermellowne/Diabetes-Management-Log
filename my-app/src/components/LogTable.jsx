import { useState, useRef } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Skeleton } from "./ui/skeleton"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog"
import { Pencil, Trash2, FileDown, AlertTriangle } from "lucide-react"
import { useInsulinLog } from "../hooks/useInsulinLog"
import { useToast } from "../hooks/use-toast"
import { createColorSafeOnClone } from "../lib/html2canvasSafeClone"
import { downloadPdf } from "../lib/downloadPdf"
import EditModal from "./EditModal"

function SafetyBadge({ alert }) {
  if (!alert) return <span className="text-muted-foreground text-xs">Normal</span>
  if (alert === "low") return <Badge className="bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-100"><AlertTriangle className="h-3 w-3 mr-1" />Low</Badge>
  return <Badge className="bg-red-100 text-red-800 border-red-300 hover:bg-red-100"><AlertTriangle className="h-3 w-3 mr-1" />High</Badge>
}

function InsulinTypeBadge({ type }) {
  const colors = { "Actrapid": "bg-blue-100 text-blue-800 border-blue-200", "Lantus": "bg-purple-100 text-purple-800 border-purple-200"}
  return <Badge className={`${colors[type] ?? "bg-gray-100 text-gray-800 border-gray-200"} hover:opacity-90 font-normal`}>{type}</Badge>
}

export default function LogTable() {
  const { logs, isLoading, deleteLog, isDeleting } = useInsulinLog()
  const { toast } = useToast()
  const [editLog, setEditLog] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const tableRef = useRef(null)

  const handleExportPDF = async () => {
    if (!tableRef.current) return
    try {
      const { default: jsPDF } = await import("jspdf")
      const { default: html2canvas } = await import("html2canvas")
      const canvas = await html2canvas(tableRef.current, { scale: 1.5, useCORS: true, onclone: createColorSafeOnClone() })
      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [canvas.width, canvas.height] })
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height)
      downloadPdf(pdf, "insulin-log.pdf")
    } catch (error) {
      console.error("PDF export failed", error)
      toast({ title: "Export failed", description: "Unable to generate the PDF. Please try again." })
    }
  }

  if (isLoading) return <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <p className="text-sm text-muted-foreground">{logs.length} {logs.length === 1 ? "entry" : "entries"}</p>
        <Button variant="outline" size="sm" onClick={handleExportPDF}><FileDown className="h-4 w-4 mr-2" />Export PDF</Button>
      </div>
      <div ref={tableRef} className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              {["Date","Time","Glucose (mg/dL)","Insulin Type","Dose (units)","Activities","Notes","Safety Alert",""].map((h) => <TableHead key={h} className="font-semibold">{h}</TableHead>)}
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.length === 0 ? (
              <TableRow><TableCell colSpan={9} className="text-center text-muted-foreground py-12">No entries yet. Add your first reading above.</TableCell></TableRow>
            ) : logs.map((log) => (
              <TableRow key={log.id} className="hover:bg-muted/30 transition-colors">
                <TableCell className="font-medium">{log.date}</TableCell>
                <TableCell>{log.time}</TableCell>
                <TableCell><span className={log.safetyAlert === "low" ? "text-amber-700 font-semibold" : log.safetyAlert === "high" ? "text-red-700 font-semibold" : ""}>{log.glucoseReading}</span></TableCell>
                <TableCell><InsulinTypeBadge type={log.insulinType} /></TableCell>
                <TableCell>{log.insulinDose}</TableCell>
                <TableCell className="max-w-37.5 truncate" title={log.activities}>{log.activities || <span className="text-muted-foreground">—</span>}</TableCell>
                <TableCell className="max-w-45 truncate" title={log.notes}>{log.notes || <span className="text-muted-foreground">—</span>}</TableCell>
                <TableCell><SafetyBadge alert={log.safetyAlert} /></TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditLog(log)}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => setDeleteId(log.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <EditModal log={editLog} open={!!editLog} onClose={() => setEditLog(null)} />
      <AlertDialog open={deleteId !== null} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete Entry</AlertDialogTitle><AlertDialogDescription>This will permanently remove this log entry. This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteId !== null && deleteLog(deleteId, () => setDeleteId(null))} disabled={isDeleting} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">{isDeleting ? "Deleting..." : "Delete"}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
