'use client'

import dynamic from 'next/dynamic'

// Recharts requires browser — dynamic import with SSR disabled
const NavChart = dynamic(() => import('@/components/portal/NavChart'), { ssr: false })

interface NavChartClientProps {
  data: { date: string; nav: number }[]
  locale: string
  currency: string
}

export default function NavChartClient(props: NavChartClientProps) {
  return <NavChart {...props} />
}
