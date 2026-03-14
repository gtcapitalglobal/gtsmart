// ============================================================
// GT Lands — Square Card Payment Processor
// Vercel Serverless Function
// Versão: 2.1 | 14/03/2026
// ============================================================
//
// Variáveis de ambiente necessárias no Vercel:
//   SQUARE_ACCESS_TOKEN  — Access Token de produção
//   SQUARE_LOCATION_ID   — Location ID do Square
// ============================================================

const SQUARE_API_BASE    = 'https://connect.squareup.com/v2';
const SQUARE_API_VERSION = '2024-12-18';

const MIN_AMOUNT_CENTS = 100;        // $1.00 mínimo
const MAX_AMOUNT_CENTS = 5000000;    // $50,000.00 máximo

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { sourceId, baseCents, lateCents, buyerEmail, note, prop, inst } = req.body || {};

    // Validações
    if (!sourceId)
        return res.status(400).json({ error: 'Missing card token' });

    const base = parseInt(baseCents) || 0;
    const late = parseInt(lateCents) || 0;

    if (base <= 0)
        return res.status(400).json({ error: 'Invalid base amount' });

    // Servidor recalcula o total — nunca confia no valor vindo do cliente
    const subtotal    = base + late;
    const fee         = Math.round(subtotal * 0.04);
    const totalCents  = subtotal + fee;

    if (totalCents < MIN_AMOUNT_CENTS)
        return res.status(400).json({ error: `Minimum payment is $${(MIN_AMOUNT_CENTS/100).toFixed(2)}` });

    if (totalCents > MAX_AMOUNT_CENTS)
        return res.status(400).json({ error: `Maximum payment is $${(MAX_AMOUNT_CENTS/100).toFixed(2)}` });

    const token      = process.env.SQUARE_ACCESS_TOKEN;
    const locationId = process.env.SQUARE_LOCATION_ID;

    if (!token || !locationId) {
        console.error('[Square] Missing credentials');
        return res.status(500).json({ error: 'Payment system not configured. Contact GT Lands.' });
    }

    const idempotencyKey = `gtlands-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    const noteText = note || `GT Lands — ${prop || 'Property'} — Installment #${inst || '?'}${late > 0 ? ' (+ Late Fee)' : ''}`;

    const body = {
        source_id:           sourceId,
        idempotency_key:     idempotencyKey,
        amount_money:        { amount: totalCents, currency: 'USD' },
        location_id:         locationId,
        note:                noteText,
        buyer_email_address: buyerEmail || undefined,
    };

    try {
        const response = await fetch(`${SQUARE_API_BASE}/payments`, {
            method: 'POST',
            headers: {
                'Square-Version':  SQUARE_API_VERSION,
                'Authorization':   `Bearer ${token}`,
                'Content-Type':    'application/json',
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        if (!response.ok) {
            const errMsg = data.errors?.[0]?.detail || 'Payment declined';
            console.error('[Square] Payment failed:', JSON.stringify(data.errors));
            return res.status(response.status).json({ success: false, error: errMsg });
        }

        const payment = data.payment;
        console.log(`[Square] OK: ${payment.id} — $${(totalCents/100).toFixed(2)} | ${prop} #${inst}`);

        return res.status(200).json({
            success:         true,
            squarePaymentId: payment.id,
            status:          payment.status,
            amountCharged:   totalCents,
            receiptUrl:      payment.receipt_url || null,
        });

    } catch (err) {
        console.error('[Square] Server error:', err);
        return res.status(500).json({ success: false, error: 'Server error. Please try again.' });
    }
}
