
export function cleanCPF(cpf: string): string {
  return cpf.replace(/\D/g, '')
}

export function formatCPF(cpf: string): string {
  const cleaned = cleanCPF(cpf)
  if (cleaned.length !== 11) return cpf // Retorna original se formato inválido
  
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}
