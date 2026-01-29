/**
 * 🕐 TIMEZONE UTILITIES
 * 
 * Todas as datas são salvas com o fuso horário de São Paulo (UTC-3)
 * para facilitar a visualização no dashboard e banco de dados.
 */

/**
 * Retorna a data/hora atual no formato ISO com timezone de São Paulo
 * Exemplo: "2026-01-29T01:10:10.000-03:00"
 */
export function nowBrazil(): string {
  return new Date().toLocaleString('sv-SE', { 
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3
  }).replace(' ', 'T').replace(',', '.') + '-03:00'
}

/**
 * Alternativa simples: retorna Date ajustado para São Paulo
 * Útil para comparações de data
 */
export function nowBrazilDate(): Date {
  // Pega o horário UTC e subtrai 3 horas
  const now = new Date()
  return new Date(now.getTime() - (3 * 60 * 60 * 1000))
}

/**
 * Formata uma data UTC para exibição no Brasil
 * @param dateString - Data em formato ISO (UTC)
 * @returns Data formatada para Brasil "DD/MM/YYYY HH:mm"
 */
export function formatDateBrazil(dateString: string | Date): string {
  const date = new Date(dateString)
  return date.toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * Retorna timestamp ISO simples (sem timezone explícito, mas em horário BR)
 * Para usar com Supabase que espera formato específico
 */
export function nowISO(): string {
  const now = new Date()
  // Ajusta para São Paulo (UTC-3)
  const spTime = new Date(now.getTime() - (3 * 60 * 60 * 1000))
  return spTime.toISOString().replace('Z', '+00:00')
}
