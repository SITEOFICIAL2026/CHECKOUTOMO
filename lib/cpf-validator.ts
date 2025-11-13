/**
 * Validates a Brazilian CPF number
 * Returns true if valid, false otherwise
 */
export function isValidCPF(cpf: string): boolean {
  // Remove any non-numeric characters
  const cleanCPF = cpf.replace(/\D/g, "")

  // Check if it has exactly 11 digits
  if (cleanCPF.length !== 11) {
    return false
  }

  // Check if all digits are the same (invalid CPF)
  if (/^(\d)\1{10}$/.test(cleanCPF)) {
    return false
  }

  // Calculate first verification digit
  let sum = 0
  let remainder = 0

  for (let i = 1; i <= 9; i++) {
    sum += Number.parseInt(cleanCPF.substring(i - 1, i)) * (11 - i)
  }

  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) {
    remainder = 0
  }

  if (remainder !== Number.parseInt(cleanCPF.substring(9, 10))) {
    return false
  }

  // Calculate second verification digit
  sum = 0
  for (let i = 1; i <= 10; i++) {
    sum += Number.parseInt(cleanCPF.substring(i - 1, i)) * (12 - i)
  }

  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) {
    remainder = 0
  }

  if (remainder !== Number.parseInt(cleanCPF.substring(10, 11))) {
    return false
  }

  return true
}
