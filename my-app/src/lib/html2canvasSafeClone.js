const COLOR_PROPS = [
  "color",
  "backgroundColor",
  "borderTopColor",
  "borderRightColor",
  "borderBottomColor",
  "borderLeftColor",
  "outlineColor",
  "textDecorationColor",
  "boxShadow",
  "textShadow",
]

const needsColorFix = (value) => /oklab|oklch|color-mix/i.test(value)

const getComputedValue = (value, prop) => {
  const temp = document.createElement("span")
  temp.style.position = "absolute"
  temp.style.left = "-9999px"

  if (prop === "backgroundColor") {
    temp.style.backgroundColor = value
  } else if (prop.startsWith("border")) {
    temp.style.borderColor = value
  } else if (prop === "outlineColor") {
    temp.style.outlineColor = value
  } else if (prop === "textDecorationColor") {
    temp.style.textDecorationColor = value
  } else if (prop === "boxShadow") {
    temp.style.boxShadow = value
  } else if (prop === "textShadow") {
    temp.style.textShadow = value
  } else {
    temp.style.color = value
  }

  document.body.appendChild(temp)
  const computed = getComputedStyle(temp)
  let result = computed.color

  if (prop === "backgroundColor") result = computed.backgroundColor
  if (prop.startsWith("border")) result = computed.borderTopColor
  if (prop === "outlineColor") result = computed.outlineColor
  if (prop === "textDecorationColor") result = computed.textDecorationColor
  if (prop === "boxShadow") result = computed.boxShadow
  if (prop === "textShadow") result = computed.textShadow

  temp.remove()
  return result
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
      for (const prop of COLOR_PROPS) {
        const value = computed[prop]
        if (!value || !needsColorFix(value)) continue
        clone.style[prop] = getComputedValue(value, prop)
      }
    }
  }
}
