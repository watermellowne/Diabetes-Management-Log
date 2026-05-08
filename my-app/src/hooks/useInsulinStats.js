import { useMemo } from "react"
import { useInsulinLog } from "./useInsulinLog"

const LOW_THRESHOLD = 70
const HIGH_THRESHOLD = 180

export function useInsulinStats() {
  const { logs, isLoading } = useInsulinLog()

  const stats = useMemo(() => {
    if (!logs || logs.length === 0) return null

    let glucoseSum = 0
    let glucoseCount = 0
    let minGlucose = Infinity
    let maxGlucose = -Infinity
    let lowAlerts = 0
    let highAlerts = 0

    const byDateMap = new Map()
    const byTypeMap = new Map()

    logs.forEach((log) => {
      const glucose = Number(log.glucoseReading)
      const dose = Number(log.insulinDose)

      if (Number.isFinite(glucose)) {
        glucoseSum += glucose
        glucoseCount += 1
        if (glucose < minGlucose) minGlucose = glucose
        if (glucose > maxGlucose) maxGlucose = glucose
        if (glucose < LOW_THRESHOLD) lowAlerts += 1
        if (glucose > HIGH_THRESHOLD) highAlerts += 1

        if (log.date) {
          const existing = byDateMap.get(log.date) ?? { date: log.date, sum: 0, count: 0, min: Infinity, max: -Infinity }
          existing.sum += glucose
          existing.count += 1
          if (glucose < existing.min) existing.min = glucose
          if (glucose > existing.max) existing.max = glucose
          byDateMap.set(log.date, existing)
        }
      }

      if (log.insulinType && Number.isFinite(dose)) {
        const existing = byTypeMap.get(log.insulinType) ?? { insulinType: log.insulinType, sum: 0, count: 0 }
        existing.sum += dose
        existing.count += 1
        byTypeMap.set(log.insulinType, existing)
      }
    })

    if (glucoseCount === 0) return null

    const byDate = Array.from(byDateMap.values())
      .map((entry) => ({
        date: entry.date,
        avgGlucose: entry.sum / entry.count,
        minGlucose: entry.min,
        maxGlucose: entry.max,
      }))
      .sort((a, b) => a.date.localeCompare(b.date))

    const byInsulinType = Array.from(byTypeMap.values()).map((entry) => ({
      insulinType: entry.insulinType,
      avgDose: entry.sum / entry.count,
    }))

    return {
      avgGlucose: glucoseSum / glucoseCount,
      minGlucose,
      maxGlucose,
      totalEntries: logs.length,
      lowAlerts,
      highAlerts,
      byDate,
      byInsulinType,
    }
  }, [logs])

  return { stats, isLoading }
}