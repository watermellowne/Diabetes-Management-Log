export const downloadPdf = (pdf, filename) => {
  if (!pdf) return
  const blob = pdf.output("blob")
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.style.display = "none"
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
