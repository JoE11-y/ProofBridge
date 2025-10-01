export const truncateString = (
  address: string | null | undefined,
  head = 4,
  tail = 4
): string => {
  if (!address) return ""
  const addr = address.trim()
  if (addr.length <= head + tail + 3) return addr // short enough, return as-is

  // preserve 0x prefix if present
  const prefix = addr.startsWith("0x") ? "0x" : ""
  const core = prefix ? addr.slice(2) : addr
  const start = core.slice(0, Math.max(0, head - (prefix ? 0 : 0)))
  const end = core.slice(-tail)
  return `${prefix}${start}…${end}`
}
