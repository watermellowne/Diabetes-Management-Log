import { createContext, useCallback, useContext, useEffect, useState, createElement } from "react"
import { useToast } from "./use-toast"

const InsulinLogContext = createContext(null)
const STORAGE_KEY = "insulin-log-entries"

const loadStoredLogs = () => {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function InsulinLogProvider({ children }) {
  const { toast } = useToast()
  const [logs, setLogs] = useState(() => loadStoredLogs())
  const [isLoading, setIsLoading] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(logs))
    } catch {
      // Ignore storage failures (private mode, quota, etc.)
    }
  }, [logs])

  const createLog = useCallback((data, onSuccess) => {
    setIsCreating(true)
    // API call would go here
    setTimeout(() => {
      setLogs(prev => [...prev, { ...data, id: Date.now() }])
      setIsCreating(false)
      toast({ title: "Entry created successfully" })
      if (onSuccess) onSuccess()
    }, 500)
  }, [toast])

  const updateLog = useCallback((id, data, onSuccess) => {
    setIsUpdating(true)
    // API call would go here
    setTimeout(() => {
      setLogs(prev => prev.map(log => log.id === id ? { ...log, ...data } : log))
      setIsUpdating(false)
      toast({ title: "Entry updated successfully" })
      if (onSuccess) onSuccess()
    }, 500)
  }, [toast])

  const deleteLog = useCallback((id, onSuccess) => {
    setIsDeleting(true)
    // API call would go here
    setTimeout(() => {
      setLogs(prev => prev.filter(log => log.id !== id))
      setIsDeleting(false)
      toast({ title: "Entry deleted successfully" })
      if (onSuccess) onSuccess()
    }, 500)
  }, [toast])

  const value = { logs, isLoading, createLog, updateLog, deleteLog, isCreating, isUpdating, isDeleting }

  return createElement(InsulinLogContext.Provider, { value }, children)
}

export function useInsulinLog() {
  const context = useContext(InsulinLogContext)
  if (!context) throw new Error("useInsulinLog must be used within InsulinLogProvider")
  return context
}