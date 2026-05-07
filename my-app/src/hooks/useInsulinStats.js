import { useState, useEffect } from "react"

export function useInsulinStats() {
  const [stats, setStats] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  return { stats, isLoading }
}