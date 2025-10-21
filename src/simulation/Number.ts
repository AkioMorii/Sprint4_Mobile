export const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

// Aceita "1.234,56", "1234,56", "1234.56", "1234"
export function parseBRNumber(input: string | number | null | undefined): number {
  if (typeof input === 'number') return input;
  const s = String(input ?? '').trim();
  if (!s) return NaN;
  const cleaned = s.replace(/[^\d,.,,-]/g, '');
  const normalized = cleaned.replace(/\.(?=\d{3}(\D|$))/g, '').replace(',', '.');
  const n = Number(normalized);
  return Number.isFinite(n) ? n : NaN;
}

export const nonNegative = (n: number) => Number.isFinite(n) && n >= 0;
