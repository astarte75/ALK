/**
 * Generate Excel templates for fund data import.
 *
 * Produces 4 .xlsx files in ./fund-data/:
 *   - amarone-dati.xlsx          (populated from Supabase for verification)
 *   - alkemia-food-excellence-i-dati.xlsx (populated from Supabase for verification)
 *   - sinergia-venture-fund-template.xlsx (empty, to be filled)
 *   - fondo-pipe-template.xlsx   (empty, to be filled)
 * Plus a README.md with completion instructions.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/generate-fund-templates.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as XLSX from 'xlsx'
import * as fs from 'fs'
import * as path from 'path'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const OUT_DIR = path.join(process.cwd(), 'fund-data')

const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

const POPULATED_FUNDS = [
  { slug: 'amarone', outFile: 'amarone-dati.xlsx' },
  { slug: 'alkemia-food-excellence-i', outFile: 'alkemia-food-excellence-i-dati.xlsx' },
]

const EMPTY_TEMPLATES = [
  {
    slug: 'sinergia-venture-fund',
    name: 'Sinergia Venture Fund',
    fundType: 'VC',
    outFile: 'sinergia-venture-fund-template.xlsx',
  },
  {
    slug: 'fondo-pipe',
    name: 'Fondo PIPE',
    fundType: 'PIPE',
    outFile: 'fondo-pipe-template.xlsx',
  },
]

type SheetRow = (string | number | null)[]

function makeFundoSheet(opts: {
  name: string
  slug: string
  fundType: string
  vintageYear: number | null
  currency: string
  status: string
  irr: number | null
}): SheetRow[] {
  return [
    ['Campo', 'Valore', 'Note'],
    ['Nome Fondo', opts.name, 'Nome completo esposto nel portale'],
    ['Slug', opts.slug, 'Identificativo URL (minuscolo, trattini). Deve coincidere con Contentful.'],
    ['Tipo', opts.fundType, 'PE | VC | PIPE'],
    ['Vintage Year', opts.vintageYear ?? '', 'Anno di costituzione'],
    ['Valuta', opts.currency, 'EUR'],
    ['Stato', opts.status, 'active | closed | fundraising'],
    ['IRR (decimale)', opts.irr ?? '', 'Es. -0.0255 per -2.55%. Lasciare vuoto se non disponibile.'],
  ]
}

function makeInvestitoriHeader(): SheetRow {
  return ['Nome Completo', 'Email (login)', 'Società', 'Codice Fiscale / P.IVA', 'Lingua (it/en)']
}

function makePosizioniHeader(): SheetRow {
  return [
    'Nome Investitore (come in foglio Investitori)',
    'Classe Quota',
    'Capitale Impegnato (€)',
    'Capitale Investito (€)',
    'Distribuzioni (€)',
    'NAV Corrente (€)',
    'Data NAV (YYYY-MM-DD)',
    'Impegno Residuo (€)',
  ]
}

function makeOperazioniHeader(): SheetRow {
  return [
    'Nome Investitore',
    'Data Operazione (YYYY-MM-DD)',
    'Tipo',
    'Importo (€)',
    'Descrizione',
  ]
}

function makeNavHeader(): SheetRow {
  return ['Nome Investitore', 'Data Report (YYYY-MM-DD)', 'NAV (€)']
}

function makeHoldingsHeader(): SheetRow {
  return ['Partecipata', 'Costo (€)', 'Fair Value (€)', 'Data Valutazione (YYYY-MM-DD)']
}

function istruzioniSheet(): SheetRow[] {
  return [
    ['ISTRUZIONI COMPILAZIONE — FONDO'],
    [''],
    ['Questo file contiene i dati necessari per importare un fondo nel portale investitori Alkemia.'],
    [''],
    ['FOGLI:'],
    ['  1. Fondo          — metadati del fondo (una sola riga dati)'],
    ['  2. Investitori    — anagrafica completa investitori (uno per riga)'],
    ['  3. Posizioni      — posizione attuale di ogni investitore nel fondo'],
    ['  4. Operazioni     — storico capital call, distribuzioni, management fee, ecc.'],
    ['  5. NAV Storico    — serie temporale NAV per investitore (alimenta il grafico)'],
    ['  6. Partecipazioni — portfolio del fondo (aziende target con costo + fair value)'],
    [''],
    ['REGOLE GENERALI:'],
    ['  • Le celle numeriche accettano solo numeri (no separatori migliaia). Usa il punto per i decimali.'],
    ['  • Le date devono essere in formato YYYY-MM-DD (es. 2025-12-31).'],
    ['  • Non modificare gli header (prima riga di ogni foglio).'],
    ['  • Il nome investitore deve essere IDENTICO in tutti i fogli (case-sensitive).'],
    ['  • Lo slug del fondo deve coincidere con lo slug su Contentful.'],
    [''],
    ['TIPI OPERAZIONE AMMESSI (colonna Tipo in foglio Operazioni):'],
    ['  capital_call     — richiamo di capitale per investimento'],
    ['  distribution     — distribuzione agli investitori'],
    ['  recallable       — distribuzione richiamabile'],
    ['  management_fee   — commissione di gestione'],
    ['  expense          — altre spese'],
    ['  setup_cost       — spese di istituzione'],
    ['  transfer         — trasferimento quote'],
    [''],
    ['COME IMPORTARE (una volta compilato):'],
    ['  1. Salva il file nella cartella ./fund-data/'],
    ['  2. Estendi scripts/import-fund-data.ts aggiungendo il fondo a FUND_CONFIGS'],
    ['  3. Lancia: npx tsx --env-file=.env.local scripts/import-fund-data.ts --dry-run'],
    ['  4. Verifica output, poi rilancia senza --dry-run per scrivere su Supabase'],
    [''],
    ['ATTENZIONE:'],
    ['  • Questo file contiene dati sensibili (anagrafiche investitori, importi).'],
    ['  • La cartella fund-data/ è gitignored. NON committare questi file.'],
  ]
}

function buildWorkbook(sheets: Record<string, SheetRow[]>): XLSX.WorkBook {
  const wb = XLSX.utils.book_new()
  for (const [name, rows] of Object.entries(sheets)) {
    const ws = XLSX.utils.aoa_to_sheet(rows)
    XLSX.utils.book_append_sheet(wb, ws, name)
  }
  return wb
}

async function generatePopulated(slug: string, outFile: string) {
  const { data: fund } = await sb.from('funds').select('*').eq('slug', slug).single()
  if (!fund) throw new Error(`Fund not found: ${slug}`)

  const { data: positions } = await sb
    .from('fund_positions')
    .select('*, investors(full_name, email, company, fiscal_code, language)')
    .eq('fund_id', fund.id)
    .order('investors(full_name)')

  const { data: calls } = await sb
    .from('capital_calls')
    .select('*, investors(full_name)')
    .eq('fund_id', fund.id)
    .order('call_date')

  const { data: navs } = await sb
    .from('nav_history')
    .select('*, investors(full_name)')
    .eq('fund_id', fund.id)
    .order('report_date')

  const { data: holdings } = await sb
    .from('fund_holdings')
    .select('*')
    .eq('fund_id', fund.id)

  const fondo = makeFundoSheet({
    name: fund.name,
    slug: fund.slug,
    fundType: fund.fund_type,
    vintageYear: fund.vintage_year,
    currency: fund.currency,
    status: fund.status,
    irr: fund.irr,
  })

  const investitori: SheetRow[] = [makeInvestitoriHeader()]
  const seen = new Set<string>()
  for (const p of positions ?? []) {
    const inv = (p as any).investors
    if (!inv || seen.has(inv.full_name)) continue
    seen.add(inv.full_name)
    investitori.push([
      inv.full_name,
      inv.email ?? '',
      inv.company ?? '',
      inv.fiscal_code ?? '',
      inv.language ?? 'it',
    ])
  }

  const posizioni: SheetRow[] = [makePosizioniHeader()]
  for (const p of positions ?? []) {
    const inv = (p as any).investors
    posizioni.push([
      inv?.full_name ?? '',
      p.quota_class ?? '',
      Number(p.committed_capital ?? 0),
      Number(p.invested_capital ?? 0),
      Number(p.distributions ?? 0),
      Number(p.current_nav ?? 0),
      p.nav_date ?? '',
      Number(p.residual_commitment ?? 0),
    ])
  }

  const operazioni: SheetRow[] = [makeOperazioniHeader()]
  for (const c of calls ?? []) {
    operazioni.push([
      (c as any).investors?.full_name ?? '',
      c.call_date ?? '',
      c.call_type,
      Number(c.amount),
      c.description ?? '',
    ])
  }

  const navStorico: SheetRow[] = [makeNavHeader()]
  for (const n of navs ?? []) {
    navStorico.push([
      (n as any).investors?.full_name ?? '',
      n.report_date,
      Number(n.nav_value),
    ])
  }

  const partecipazioni: SheetRow[] = [makeHoldingsHeader()]
  for (const h of holdings ?? []) {
    partecipazioni.push([
      h.name,
      Number(h.cost ?? 0),
      h.fair_value === null ? '' : Number(h.fair_value),
      h.valuation_date ?? '',
    ])
  }

  const wb = buildWorkbook({
    Fondo: fondo,
    Investitori: investitori,
    Posizioni: posizioni,
    Operazioni: operazioni,
    'NAV Storico': navStorico,
    Partecipazioni: partecipazioni,
    Istruzioni: istruzioniSheet(),
  })

  const outPath = path.join(OUT_DIR, outFile)
  XLSX.writeFile(wb, outPath)
  console.log(`  ✓ ${outFile}`)
  console.log(`      investitori: ${investitori.length - 1} · posizioni: ${posizioni.length - 1} · operazioni: ${operazioni.length - 1} · nav: ${navStorico.length - 1} · partecipazioni: ${partecipazioni.length - 1}`)
}

function generateEmpty(slug: string, name: string, fundType: string, outFile: string) {
  const fondo = makeFundoSheet({
    name,
    slug,
    fundType,
    vintageYear: null,
    currency: 'EUR',
    status: 'active',
    irr: null,
  })
  const wb = buildWorkbook({
    Fondo: fondo,
    Investitori: [makeInvestitoriHeader()],
    Posizioni: [makePosizioniHeader()],
    Operazioni: [makeOperazioniHeader()],
    'NAV Storico': [makeNavHeader()],
    Partecipazioni: [makeHoldingsHeader()],
    Istruzioni: istruzioniSheet(),
  })
  XLSX.writeFile(wb, path.join(OUT_DIR, outFile))
  console.log(`  ✓ ${outFile} (vuoto)`)
}

function writeReadme() {
  const readme = `# Fund Data Templates

Cartella per la gestione dei dati finanziari dei fondi prima dell'import in Supabase.

**⚠️ Questa cartella contiene dati sensibili (anagrafiche investitori, capital call, NAV).**
È gitignored — non committare.

## File presenti

| File | Stato | Uso |
|------|-------|-----|
| \`amarone-dati.xlsx\` | Popolato da Supabase | Verifica dati attualmente in portale |
| \`alkemia-food-excellence-i-dati.xlsx\` | Popolato da Supabase | Verifica dati attualmente in portale |
| \`sinergia-venture-fund-template.xlsx\` | Vuoto | Da compilare con dati storici Sinergia |
| \`fondo-pipe-template.xlsx\` | Vuoto | Da compilare con dati storici PIPE |

## Struttura dei fogli

Ogni file ha 7 fogli:

### 1. Fondo
Metadati del fondo (una riga dati):
- **Nome Fondo** — es. \`Sinergia Venture Fund\`
- **Slug** — identificativo URL (deve coincidere con Contentful: \`sinergia-venture-fund\`, \`fondo-pipe\`)
- **Tipo** — \`PE\`, \`VC\` o \`PIPE\`
- **Vintage Year** — anno di costituzione (numero)
- **Valuta** — \`EUR\`
- **Stato** — \`active\`, \`closed\` o \`fundraising\`
- **IRR** — decimale (es. \`-0.0255\` per -2.55%)

### 2. Investitori
Anagrafica. Una riga per investitore:
- Nome Completo (chiave usata nei fogli successivi — deve essere identica)
- Email (per il login; può essere aggiunta in fase successiva)
- Società
- Codice Fiscale / P.IVA
- Lingua (\`it\` o \`en\`)

### 3. Posizioni
Posizione attuale per investitore:
- Nome Investitore
- Classe Quota (es. \`A\`, \`A1\`, \`A2\`)
- Capitale Impegnato / Investito / Distribuzioni / NAV Corrente
- Data NAV
- Impegno Residuo

### 4. Operazioni
Storico capital call, distribuzioni, ecc. Una riga per operazione:
- Nome Investitore · Data · **Tipo** · Importo · Descrizione

**Tipi ammessi:**
- \`capital_call\` — richiamo per investimento
- \`distribution\` — distribuzione
- \`recallable\` — distribuzione richiamabile
- \`management_fee\` — commissione di gestione
- \`expense\` — altre spese
- \`setup_cost\` — spese di istituzione
- \`transfer\` — trasferimento quote

### 5. NAV Storico
Serie temporale del NAV per investitore (alimenta il grafico nel portale).
Una riga per ogni coppia (investitore, trimestre).

### 6. Partecipazioni
Portfolio del fondo (società partecipate):
- Partecipata · Costo · Fair Value · Data Valutazione

### 7. Istruzioni
Promemoria all'interno del file Excel.

## Regole

- **Date**: \`YYYY-MM-DD\` (es. \`2025-12-31\`)
- **Numeri**: niente separatori di migliaia, punto come decimale
- **Nomi investitori**: identici tra fogli (case-sensitive)
- **Non modificare gli header** (prima riga dei fogli)

## Workflow di import

Una volta compilati \`sinergia-venture-fund-template.xlsx\` e/o \`fondo-pipe-template.xlsx\`:

1. **Rinomina** il file rimuovendo \`-template\` (es. \`sinergia-venture-fund-dati.xlsx\`)
2. **Estendi** \`scripts/import-fund-data.ts\` aggiungendo il fondo a \`FUND_CONFIGS\` (attualmente hardcoded per Amarone/AFEX)
3. **Dry-run**: \`npx tsx --env-file=.env.local scripts/import-fund-data.ts --dry-run\`
4. **Verifica** output
5. **Import reale**: \`npx tsx --env-file=.env.local scripts/import-fund-data.ts\`
6. Verifica nel portale investitori con il test user admin (credenziali in \`.env.test\`)

## Rigenerare i file popolati

Per aggiornare \`amarone-dati.xlsx\` e \`alkemia-food-excellence-i-dati.xlsx\` con l'ultimo stato di Supabase:

\`\`\`bash
npx tsx --env-file=.env.local scripts/generate-fund-templates.ts
\`\`\`

Sovrascrive i file esistenti.
`
  fs.writeFileSync(path.join(OUT_DIR, 'README.md'), readme)
  console.log('  ✓ README.md')
}

async function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true })

  console.log('Generating fund data templates in ./fund-data/\n')

  console.log('Populated (from Supabase):')
  for (const { slug, outFile } of POPULATED_FUNDS) {
    await generatePopulated(slug, outFile)
  }

  console.log('\nEmpty templates:')
  for (const { slug, name, fundType, outFile } of EMPTY_TEMPLATES) {
    generateEmpty(slug, name, fundType, outFile)
  }

  console.log('\nDocs:')
  writeReadme()

  console.log(`\n✅ Done. Files in ${OUT_DIR}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
