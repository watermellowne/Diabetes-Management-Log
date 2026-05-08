import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "./ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { useInsulinLog } from "../hooks/useInsulinLog"
import { Plus } from "lucide-react"

const INSULIN_TYPES = ["Actrapid", "Lantus","Amaryl M", "Gliptus Plus"]

const schema = z.object({
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  glucoseReading: z.coerce.number().positive("Must be positive"),
  insulinType: z.string().min(1, "Insulin type is required"),
  insulinDose: z.coerce.number().positive("Must be positive"),
  notes: z.string(),
  activities: z.string(),
})

export default function LogForm() {
  const { createLog, isCreating } = useInsulinLog()
  const today = new Date().toISOString().split("T")[0]
  const now = new Date().toTimeString().slice(0, 5)
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { date: today, time: now, glucoseReading: "", insulinType: "", insulinDose: "", notes: "", activities: "" },
  })
  const onSubmit = (values) => {
    createLog(values, () => form.reset({ date: new Date().toISOString().split("T")[0], time: new Date().toTimeString().slice(0, 5), glucoseReading: "", insulinType: "", insulinDose: "", notes: "", activities: "" }))
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <FormField control={form.control} name="date" render={({ field }) => (<FormItem><FormLabel>Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="time" render={({ field }) => (<FormItem><FormLabel>Time</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="glucoseReading" render={({ field }) => (<FormItem><FormLabel>Glucose (mg/dL)</FormLabel><FormControl><Input type="number" step="0.1" placeholder="e.g. 120" {...field} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="insulinType" render={({ field }) => (
            <FormItem><FormLabel>Insulin Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
                <SelectContent>{INSULIN_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="insulinDose" render={({ field }) => (<FormItem><FormLabel>Dose (units)</FormLabel><FormControl><Input type="number" step="0.5" placeholder="e.g. 6" {...field} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="activities" render={({ field }) => (<FormItem><FormLabel>Activities</FormLabel><FormControl><Input placeholder="e.g. Morning walk" {...field} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="notes" render={({ field }) => (<FormItem className="col-span-2"><FormLabel>Notes</FormLabel><FormControl><Input placeholder="Any additional notes..." {...field} /></FormControl><FormMessage /></FormItem>)} />
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={isCreating}><Plus className="h-4 w-4 mr-2" />{isCreating ? "Adding..." : "Add Entry"}</Button>
        </div>
      </form>
    </Form>
  )
}
