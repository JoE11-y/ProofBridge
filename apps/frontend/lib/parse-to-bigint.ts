// helper: convert exponential/inexact numeric strings to an integer string then to BigInt
export function toIntegerStringFromExponential(str: string): string {
  if (!/[eE]/.test(str)) return str
  const [base, expPart] = str.split(/[eE]/)
  const exp = Number(expPart)
  if (!Number.isFinite(exp)) throw new Error("Invalid exponent")
  const [intPart, fracPart = ""] = base.split(".")
  const digits = intPart + fracPart
  const decPlaces = fracPart.length
  const zerosToAdd = exp - decPlaces
  if (zerosToAdd >= 0) {
    return digits + "0".repeat(zerosToAdd)
  } else {
    // result would have a decimal point -> take integer portion (floor)
    const pos = digits.length + zerosToAdd
    return pos > 0 ? digits.slice(0, pos) : "0"
  }
}

export function parseToBigInt(
  value: string | number | bigint | undefined | null
): bigint {
  if (value === undefined || value === null) return BigInt("0")
  if (typeof value === "bigint") return value
  if (typeof value === "number") {
    // may lose precision for very large numbers, but numbers are usually safe here
    return BigInt(Math.floor(value))
  }
  // string case
  let s = value.trim().replace(/,/g, "")
  if (s === "") return BigInt("0")
  if (/[eE]/.test(s)) {
    s = toIntegerStringFromExponential(s)
  }
  if (s.includes(".")) {
    // drop fractional part (floor)
    s = s.split(".")[0] || "0"
  }
  return BigInt(s)
}
