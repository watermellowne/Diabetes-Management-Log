import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog"
import { Button } from "./ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { useInsulinLog } from "../hooks/useInsulinLog"

const INSULIN_TYPES = ["Actrapid", "Lantus"]
const schema = z.object({
  date: z.string().min(1), time: z.string().min(1),
  glucoseReading: z.coerce.number().positive(), insulinType: z.string().min(1),
  insulinDose: z.coerce.number().positive(), notes: z.string(), activities: z.string(),
})

export default function EditModal({ log, open, onClose }) {
  const { updateLog, isUpdating } = useInsulinLog()
  const form = useForm({ resolver: zodResolver(schema), defaultValues: { date: "", time: "", glucoseReading: 0, insulinType: "", insulinDose: 0, notes: "", activities: "" } })
  useEffect(() => { if (log) form.reset({ date: log.date, time: log.time, glucoseReading: log.glucoseReading, insulinType: log.insulinType, insulinDose: log.insulinDose, notes: log.notes, activities: log.activities }) }, [log, form])
  const onSubmit = (values) => { if (!log) return; updateLog(log.id, values, () => onClose()) }
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader><DialogTitle>Edit Entry</DialogTitle></DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="date" render={({ field }) => (<FormItem><FormLabel>Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="time" render={({ field }) => (<FormItem><FormLabel>Time</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="glucoseReading" render={({ field }) => (<FormItem><FormLabel>Glucose (mg/dL)</FormLabel><FormControl><Input type="number" step="0.1" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="insulinType" render={({ field }) => (
                <FormItem><FormLabel>Insulin Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
                    <SelectContent>{INSULIN_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                  </Select><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="insulinDose" render={({ field }) => (<FormItem><FormLabel>Dose (units)</FormLabel><FormControl><Input type="number" step="0.5" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="activities" render={({ field }) => (<FormItem><FormLabel>Activities</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="notes" render={({ field }) => (<FormItem className="col-span-2"><FormLabel>Notes</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit" disabled={isUpdating}>{isUpdating ? "Saving..." : "Save Changes"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
