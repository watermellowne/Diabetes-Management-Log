const needsColorFix = (value) => /oklab|oklch|color-mix/i.test(value)

const getFallbackValue = (prop) => {
  const lower = prop.toLowerCase()
  if (lower.includes("shadow") || lower.includes("background-image")) return "none"
  if (lower === "fill" || lower === "stroke") return "currentColor"
  if (lower.includes("color") || lower.includes("background") || lower.includes("border") || lower.includes("outline")) {
    return "transparent"
  }
  return "initial"
}

const createResolver = (computed) => {
  const temp = document.createElement("span")
  temp.style.position = "absolute"
  temp.style.left = "-9999px"

  for (let i = 0; i < computed.length; i += 1) {
    const prop = computed[i]
    if (!prop.startsWith("--")) continue
    const value = computed.getPropertyValue(prop)
    if (value) temp.style.setProperty(prop, value)
  }

  document.body.appendChild(temp)

  return {
    resolve(prop, value) {
      try {
        temp.style.setProperty(prop, value)
        return getComputedStyle(temp).getPropertyValue(prop).trim()
      } catch {
        return ""
      }
    },
    cleanup() {
      temp.remove()
    },
  }
}

export const createColorSafeOnClone = () => {
  return (clonedDoc) => {
    const originalNodes = Array.from(document.querySelectorAll("*"))
    const clonedNodes = Array.from(clonedDoc.querySelectorAll("*"))

    for (let i = 0; i < clonedNodes.length; i += 1) {
      const original = originalNodes[i]
      const clone = clonedNodes[i]
      if (!original || !clone) continue

      const computed = getComputedStyle(original)
      const resolver = createResolver(computed)

      for (let j = 0; j < computed.length; j += 1) {
        const prop = computed[j]
        if (prop.startsWith("--")) continue
        const value = computed.getPropertyValue(prop)
        if (!value || !needsColorFix(value)) continue

        const resolved = resolver.resolve(prop, value)
        const safeValue = resolved && !needsColorFix(resolved) ? resolved : getFallbackValue(prop)
        clone.style.setProperty(prop, safeValue, computed.getPropertyPriority(prop))
      }

      resolver.cleanup()
    }
  }
}
