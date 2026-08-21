export interface ParsedSolanaPay {
  recipient: string;
  amount: number;
  label?: string;
  message?: string;
  memo?: string;
}

export function parseSolanaPayUrl(urlStr: string): ParsedSolanaPay | null {
  if (!urlStr || typeof urlStr !== 'string') return null;

  const trimmed = urlStr.trim();
  
  // Format: solana:<recipient>?amount=<amount>&label=<label>&message=<message>&memo=<memo>
  if (!trimmed.startsWith('solana:')) {
    // If it's a raw base58 public key or plain string URL, try parsing fallback
    if (trimmed.length >= 32 && trimmed.length <= 44 && !trimmed.includes(' ')) {
      return {
        recipient: trimmed,
        amount: 0.025,
        label: 'Comercio Local Huajuapan',
        message: 'Pago de Consumo Local',
      };
    }
    return null;
  }

  try {
    const withoutScheme = trimmed.slice(7); // Remove 'solana:'
    const [recipient, queryString] = withoutScheme.split('?');

    if (!recipient) return null;

    const params = new URLSearchParams(queryString || '');

    const amount = parseFloat(params.get('amount') || '0.025');
    const label = params.get('label') ? decodeURIComponent(params.get('label')!) : 'Comercio Huajuapan';
    const message = params.get('message') ? decodeURIComponent(params.get('message')!) : 'Pago por Solana Pay';
    const memo = params.get('memo') ? decodeURIComponent(params.get('memo')!) : undefined;

    return {
      recipient,
      amount: isNaN(amount) ? 0.025 : amount,
      label,
      message,
      memo,
    };
  } catch (err) {
    console.warn('Could not parse Solana Pay URL:', err);
    return null;
  }
}
