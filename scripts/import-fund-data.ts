/**
 * Import real fund data from Excel reports into Supabase.
 *
 * Usage:
 *   npx tsx scripts/import-fund-data.ts [--dry-run]
 *
 * Reads AMARONE_Report.xlsx and AFEX_Report.xlsx from ~/Downloads/
 * and imports funds, investors, positions, capital calls, NAV history,
 * and portfolio holdings into Supabase.
 *
 * --dry-run: prints what would be imported without writing to DB
 */

import { createClient } from '@supabase/supabase-js'
import * as XLSX from 'xlsx'
import * as path from 'path'
import * as os from 'os'
import * as crypto from 'crypto'

// ============================================================
// CONFIG
// ============================================================

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

const DRY_RUN = process.argv.includes('--dry-run')

const FUND_CONFIGS = [
  {
    file: path.join(os.homedir(), 'Downloads', 'AMARONE_Report.xlsx'),
    name: 'Amarone',
    slug: 'amarone',
    fund_type: 'PE' as const,
    vintage_year: 2023,
    status: 'active' as const,
  },
  {
    file: path.join(os.homedir(), 'Downloads', 'AFEX_Report.xlsx'),
    name: 'Alkemia Food Excellence I',
    slug: 'alkemia-food-excellence-i',
    fund_type: 'PE' as const,
    vintage_year: 2025,
    status: 'active' as const,
  },
]

// ============================================================
// HELPERS
// ============================================================

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function toNumber(val: unknown): number {
  if (val === null || val === undefined || val === '') return 0
  const n = Number(val)
  return isNaN(n) ? 0 : n
}

function toDateStr(val: unknown): string | null {
  if (!val) return null
  if (val instanceof Date) {
    return val.toISOString().split('T')[0]
  }
  if (typeof val === 'number') {
    // Excel serial date
    const d = XLSX.SSF.parse_date_code(val)
    return `${d.y}-${String(d.m).padStart(2, '0')}-${String(d.d).padStart(2, '0')}`
  }
  return String(val)
}

function quarterEndDate(quarterLabel: string): string {
  // "Q2 2023" -> "2023-06-30"
  const match = quarterLabel.match(/Q(\d)\s+(\d{4})/)
  if (!match) return ''
  const q = parseInt(match[1])
  const y = match[2]
  const ends: Record<number, string> = { 1: '03-31', 2: '06-30', 3: '09-30', 4: '12-31' }
  return `${y}-${ends[q]}`
}

// Map call description from Excel to call_type
function mapCallType(desc: string): string {
  const d = desc.toLowerCase()
  if (d.includes('richiamo impegni per invest')) return 'capital_call'
  if (d.includes('management fee')) return 'management_fee'
  if (d.includes('spese di istituzione')) return 'setup_cost'
  if (d.includes('altre spese')) return 'expense'
  if (d.includes('distribu')) return 'distribution'
  if (d.includes('arrot.')) return 'expense' // rounding adjustments
  return 'expense'
}

// ============================================================
// EXTRACTION
// ============================================================

interface InvestorRow {
  code: string
  name: string
  quota_class: string
  commitment: number
  called_cumulative: number
  residual: number
  provisions: number
  ctv_nominal: number
  ctv_nav: number
}

interface CashFlowRow {
  date: string
  investor_name: string
  amount: number
  type_desc: string
  call_type: string
}

interface NavQuarter {
  quarter_label: string
  date: string
  nav_value: number
}

interface HoldingRow {
  name: string
  cost: number
  fair_value: number | null
  valuation_date: string
}

function extractFundData(filePath: string, fundConfig: typeof FUND_CONFIGS[0]) {
  const wb = XLSX.readFile(filePath, { cellDates: true })

  // --- Dashboard: NAV history + IRR ---
  const dashSheet = wb.Sheets['Dashboard']
  const dashData = XLSX.utils.sheet_to_json<Record<string, unknown>>(dashSheet, { header: 1 })

  // Row 3 (index 2) = quarter headers, Row 4 (index 3) = NAV values
  const headers = dashData[2] as unknown[]
  const navRow = dashData[3] as unknown[]
  const calledRow = dashData[11] as unknown[] // Richiami Cumulati

  const navHistory: NavQuarter[] = []
  for (let i = 1; i < headers.length; i++) {
    const label = String(headers[i] || '')
    const nav = toNumber(navRow?.[i])
    if (label && nav > 0) {
      navHistory.push({
        quarter_label: label,
        date: quarterEndDate(label),
        nav_value: nav,
      })
    }
  }

  // --- IRR from Cash Flows & IRR sheet ---
  const irrSheet = wb.Sheets['Cash Flows & IRR']
  const irrData = XLSX.utils.sheet_to_json<Record<string, unknown>>(irrSheet, { header: 1 })
  const irr = toNumber((irrData[2] as unknown[])?.[1])

  // --- Investors ---
  const invSheet = wb.Sheets['Investitori']
  const invData = XLSX.utils.sheet_to_json<Record<string, unknown>>(invSheet, { header: 1 })

  const investors: InvestorRow[] = []
  for (let i = 3; i < invData.length; i++) {
    const row = invData[i] as unknown[]
    const name = row?.[1]
    if (!name || String(name) === 'TOTALE') continue
    investors.push({
      code: String(row[0] || ''),
      name: String(name),
      quota_class: String(row[2] || ''),
      commitment: toNumber(row[3]),
      called_cumulative: toNumber(row[4]),
      residual: toNumber(row[6]),
      provisions: toNumber(row[7]),
      ctv_nominal: toNumber(row[8]),
      ctv_nav: toNumber(row[9]),
    })
  }

  // Calculate total commitment for pro-rata NAV
  const totalCommitment = investors.reduce((sum, inv) => sum + inv.commitment, 0)

  // --- Cash Flows ---
  const cfSheet = wb.Sheets['Cash Flows & IRR']
  const cfData = XLSX.utils.sheet_to_json<Record<string, unknown>>(cfSheet, { header: 1 })

  const cashFlows: CashFlowRow[] = []
  for (let i = 7; i < cfData.length; i++) {
    const row = cfData[i] as unknown[]
    const date = row?.[0]
    const investor = row?.[1]
    const amount = toNumber(row?.[2])
    const typeDesc = String(row?.[3] || '')

    if (!date || !investor || typeDesc === 'Terminal') continue

    cashFlows.push({
      date: toDateStr(date) || '',
      investor_name: String(investor),
      amount,
      type_desc: typeDesc,
      call_type: mapCallType(typeDesc),
    })
  }

  // --- Portfolio Holdings ---
  const pfSheet = wb.Sheets['Portafoglio & Fair Value']
  const pfData = XLSX.utils.sheet_to_json<Record<string, unknown>>(pfSheet, { header: 1 })

  const holdings: HoldingRow[] = []
  // Last quarter columns (rightmost data)
  const pfHeaders = pfData[2] as unknown[]
  const pfSubheaders = pfData[3] as unknown[]

  // Find the last quarter's cost/fair value columns
  let lastCostCol = -1
  let lastFvCol = -1
  for (let i = pfSubheaders.length - 1; i >= 0; i--) {
    if (String(pfSubheaders[i]).toLowerCase() === 'fair value' && lastFvCol === -1) lastFvCol = i
    if (String(pfSubheaders[i]).toLowerCase() === 'costo' && lastCostCol === -1) lastCostCol = i
    if (lastCostCol >= 0 && lastFvCol >= 0) break
  }

  // Get last quarter label for valuation_date
  let lastQuarter = ''
  for (let i = pfHeaders.length - 1; i >= 0; i--) {
    const h = String(pfHeaders[i] || '')
    if (h.match(/Q\d\s+\d{4}/)) { lastQuarter = h; break }
  }

  for (let i = 4; i < pfData.length; i++) {
    const row = pfData[i] as unknown[]
    const name = row?.[0]
    if (!name || String(name).toLowerCase().includes('inserire')) continue
    const cost = toNumber(row?.[lastCostCol])
    const fv = row?.[lastFvCol] ? toNumber(row[lastFvCol]) : null
    if (cost === 0 && !fv) continue
    holdings.push({
      name: String(name),
      cost,
      fair_value: fv && fv > 0 ? fv : null,
      valuation_date: lastQuarter ? quarterEndDate(lastQuarter) : '',
    })
  }

  // --- Last NAV for pro-rata calculation ---
  const lastNav = navHistory.length > 0 ? navHistory[navHistory.length - 1].nav_value : 0
  const lastNavDate = navHistory.length > 0 ? navHistory[navHistory.length - 1].date : null

  return {
    fund: {
      ...fundConfig,
      irr,
    },
    investors,
    cashFlows,
    navHistory,
    holdings,
    totalCommitment,
    totalCalledCumulative: toNumber(calledRow?.[calledRow.length - 1]),
    lastNav,
    lastNavDate,
  }
}

// ============================================================
// IMPORT
// ============================================================

async function main() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('Missing SUPABASE env vars. Run with: npx tsx --env-file=.env.local scripts/import-fund-data.ts')
    process.exit(1)
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

  console.log(DRY_RUN ? '🔍 DRY RUN MODE\n' : '🚀 IMPORTING DATA\n')

  // Collect all unique investor names across funds for deduplication
  const allInvestorNames = new Map<string, { name: string; classes: string[] }>()

  const fundDatasets = FUND_CONFIGS.map((config) => {
    console.log(`📄 Reading ${config.name} from ${config.file}...`)
    const data = extractFundData(config.file, config)
    console.log(`   ${data.investors.length} investors, ${data.cashFlows.length} cash flows, ${data.navHistory.length} NAV quarters, ${data.holdings.length} holdings`)
    console.log(`   IRR: ${(data.fund.irr * 100).toFixed(2)}%, Last NAV: €${data.lastNav.toLocaleString('it-IT')}`)

    for (const inv of data.investors) {
      const key = inv.name.trim().toUpperCase()
      if (!allInvestorNames.has(key)) {
        allInvestorNames.set(key, { name: inv.name.trim(), classes: [] })
      }
      allInvestorNames.get(key)!.classes.push(inv.quota_class)
    }

    return data
  })

  console.log(`\n👥 ${allInvestorNames.size} unique investors across all funds`)

  if (DRY_RUN) {
    console.log('\n--- DRY RUN: No changes written ---')
    for (const [key, inv] of allInvestorNames) {
      console.log(`  ${inv.name} (classes: ${inv.classes.join(', ')})`)
    }
    for (const data of fundDatasets) {
      console.log(`\n📊 ${data.fund.name}:`)
      for (const inv of data.investors) {
        const proRataNav = data.totalCommitment > 0
          ? (inv.commitment / data.totalCommitment) * data.lastNav
          : 0
        const navDisplay = inv.ctv_nav > 0 ? inv.ctv_nav : proRataNav
        console.log(`  ${inv.name}: commitment €${inv.commitment.toLocaleString()} | called €${inv.called_cumulative.toLocaleString()} | NAV €${Math.round(navDisplay).toLocaleString()}`)
      }
    }
    process.exit(0)
  }

  // --- Step 1: Clean test data ---
  console.log('\n🗑️  Cleaning test data...')
  await supabase.from('investor_documents').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('nav_history').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('capital_calls').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('fund_positions').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('fund_holdings').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('investors').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('funds').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  console.log('   ✓ Test data cleared')

  // --- Step 2: Create funds ---
  console.log('\n📁 Creating funds...')
  const fundIdMap = new Map<string, string>()

  for (const data of fundDatasets) {
    const { data: fund, error } = await supabase
      .from('funds')
      .upsert({
        name: data.fund.name,
        slug: data.fund.slug,
        fund_type: data.fund.fund_type,
        vintage_year: data.fund.vintage_year,
        currency: 'EUR',
        status: data.fund.status,
        irr: data.fund.irr,
      }, { onConflict: 'slug' })
      .select('id')
      .single()

    if (error) {
      console.error(`   ✗ Error creating fund ${data.fund.name}:`, error.message)
      continue
    }
    fundIdMap.set(data.fund.slug, fund.id)
    console.log(`   ✓ ${data.fund.name} (${fund.id})`)
  }

  // --- Step 3: Create investors (no auth, no email) ---
  console.log('\n👥 Creating investors...')
  const investorIdMap = new Map<string, string>() // key: uppercase name -> id

  for (const [key, inv] of allInvestorNames) {
    const { data: investor, error } = await supabase
      .from('investors')
      .insert({
        full_name: inv.name,
        email: null,
        auth_user_id: null,
        language: 'it',
      })
      .select('id')
      .single()

    if (error) {
      console.error(`   ✗ Error creating investor ${inv.name}:`, error.message)
      continue
    }
    investorIdMap.set(key, investor.id)
  }
  console.log(`   ✓ ${investorIdMap.size} investors created`)

  // --- Step 4: Create fund positions ---
  console.log('\n💰 Creating fund positions...')
  let posCount = 0

  for (const data of fundDatasets) {
    const fundId = fundIdMap.get(data.fund.slug)
    if (!fundId) continue

    for (const inv of data.investors) {
      const investorId = investorIdMap.get(inv.name.trim().toUpperCase())
      if (!investorId) {
        console.error(`   ✗ Investor not found: ${inv.name}`)
        continue
      }

      // Calculate pro-rata NAV if CTV NAV is 0
      let currentNav = inv.ctv_nav
      if (currentNav === 0 && data.totalCommitment > 0 && data.lastNav > 0) {
        currentNav = (inv.commitment / data.totalCommitment) * data.lastNav
      }

      const residual = inv.commitment - inv.called_cumulative

      const { error } = await supabase.from('fund_positions').insert({
        investor_id: investorId,
        fund_id: fundId,
        committed_capital: inv.commitment,
        invested_capital: inv.called_cumulative,
        distributions: 0,
        current_nav: Math.round(currentNav * 100) / 100,
        nav_date: data.lastNavDate,
        quota_class: inv.quota_class,
        residual_commitment: residual > 0 ? residual : 0,
      })

      if (error) {
        console.error(`   ✗ Position error ${inv.name} / ${data.fund.name}:`, error.message)
      } else {
        posCount++
      }
    }
  }
  console.log(`   ✓ ${posCount} fund positions created`)

  // --- Step 5: Import cash flows as capital_calls ---
  console.log('\n📋 Importing capital calls...')
  let callCount = 0

  for (const data of fundDatasets) {
    const fundId = fundIdMap.get(data.fund.slug)
    if (!fundId) continue

    // Batch insert for performance
    const callRows = []
    for (const cf of data.cashFlows) {
      const investorId = investorIdMap.get(cf.investor_name.trim().toUpperCase())
      if (!investorId) {
        console.error(`   ✗ Investor not found for call: ${cf.investor_name}`)
        continue
      }

      callRows.push({
        investor_id: investorId,
        fund_id: fundId,
        call_date: cf.date,
        call_type: cf.call_type,
        amount: cf.amount,
        description: cf.type_desc,
      })
    }

    // Insert in batches of 50
    for (let i = 0; i < callRows.length; i += 50) {
      const batch = callRows.slice(i, i + 50)
      const { error } = await supabase.from('capital_calls').insert(batch)
      if (error) {
        console.error(`   ✗ Batch insert error (${data.fund.name}):`, error.message)
      } else {
        callCount += batch.length
      }
    }
  }
  console.log(`   ✓ ${callCount} capital calls imported`)

  // --- Step 6: Import NAV history (per investor, pro-rata from fund NAV) ---
  console.log('\n📈 Importing NAV history...')
  let navCount = 0

  for (const data of fundDatasets) {
    const fundId = fundIdMap.get(data.fund.slug)
    if (!fundId || data.navHistory.length === 0) continue

    const navRows = []
    for (const inv of data.investors) {
      const investorId = investorIdMap.get(inv.name.trim().toUpperCase())
      if (!investorId) continue

      const shareRatio = data.totalCommitment > 0 ? inv.commitment / data.totalCommitment : 0

      for (const nq of data.navHistory) {
        navRows.push({
          investor_id: investorId,
          fund_id: fundId,
          report_date: nq.date,
          nav_value: Math.round(nq.nav_value * shareRatio * 100) / 100,
        })
      }
    }

    // Insert in batches of 100
    for (let i = 0; i < navRows.length; i += 100) {
      const batch = navRows.slice(i, i + 100)
      const { error } = await supabase.from('nav_history').insert(batch)
      if (error) {
        console.error(`   ✗ NAV batch error (${data.fund.name}):`, error.message)
      } else {
        navCount += batch.length
      }
    }
  }
  console.log(`   ✓ ${navCount} NAV history entries imported`)

  // --- Step 7: Import portfolio holdings ---
  console.log('\n🏢 Importing portfolio holdings...')
  let holdCount = 0

  for (const data of fundDatasets) {
    const fundId = fundIdMap.get(data.fund.slug)
    if (!fundId) continue

    for (const h of data.holdings) {
      const { error } = await supabase.from('fund_holdings').insert({
        fund_id: fundId,
        name: h.name,
        cost: h.cost,
        fair_value: h.fair_value,
        valuation_date: h.valuation_date || null,
      })

      if (error) {
        console.error(`   ✗ Holding error ${h.name}:`, error.message)
      } else {
        holdCount++
      }
    }
  }
  console.log(`   ✓ ${holdCount} portfolio holdings imported`)

  // --- Summary ---
  console.log('\n✅ Import complete!')
  console.log(`   Funds: ${fundIdMap.size}`)
  console.log(`   Investors: ${investorIdMap.size}`)
  console.log(`   Positions: ${posCount}`)
  console.log(`   Capital calls: ${callCount}`)
  console.log(`   NAV history: ${navCount}`)
  console.log(`   Holdings: ${holdCount}`)
}

main().catch(console.error)
