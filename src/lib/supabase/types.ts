// Supabase Database types for the investor portal

export type Database = {
  public: {
    Tables: {
      investors: {
        Row: {
          id: string
          auth_user_id: string
          full_name: string
          email: string
          company: string | null
          fiscal_code: string | null
          language: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          auth_user_id: string
          full_name: string
          email: string
          company?: string | null
          fiscal_code?: string | null
          language?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          auth_user_id?: string
          full_name?: string
          email?: string
          company?: string | null
          fiscal_code?: string | null
          language?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      funds: {
        Row: {
          id: string
          name: string
          slug: string
          fund_type: 'PE' | 'VC' | 'PIPE'
          vintage_year: number | null
          currency: string
          status: 'active' | 'closed' | 'fundraising'
          irr: number | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          fund_type: 'PE' | 'VC' | 'PIPE'
          vintage_year?: number | null
          currency?: string
          status?: 'active' | 'closed' | 'fundraising'
          irr?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          fund_type?: 'PE' | 'VC' | 'PIPE'
          vintage_year?: number | null
          currency?: string
          status?: 'active' | 'closed' | 'fundraising'
          irr?: number | null
          created_at?: string
        }
        Relationships: []
      }
      fund_positions: {
        Row: {
          id: string
          investor_id: string
          fund_id: string
          committed_capital: number
          invested_capital: number
          distributions: number
          current_nav: number
          nav_date: string | null
          quota_class: string | null
          residual_commitment: number
          updated_at: string
        }
        Insert: {
          id?: string
          investor_id: string
          fund_id: string
          committed_capital?: number
          invested_capital?: number
          distributions?: number
          current_nav?: number
          nav_date?: string | null
          quota_class?: string | null
          residual_commitment?: number
          updated_at?: string
        }
        Update: {
          id?: string
          investor_id?: string
          fund_id?: string
          committed_capital?: number
          invested_capital?: number
          distributions?: number
          current_nav?: number
          nav_date?: string | null
          quota_class?: string | null
          residual_commitment?: number
          updated_at?: string
        }
        Relationships: []
      }
      capital_calls: {
        Row: {
          id: string
          investor_id: string
          fund_id: string
          call_date: string
          call_type: 'capital_call' | 'distribution' | 'recallable' | 'management_fee' | 'expense' | 'setup_cost'
          amount: number
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          investor_id: string
          fund_id: string
          call_date: string
          call_type: 'capital_call' | 'distribution' | 'recallable' | 'management_fee' | 'expense' | 'setup_cost'
          amount: number
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          investor_id?: string
          fund_id?: string
          call_date?: string
          call_type?: 'capital_call' | 'distribution' | 'recallable'
          amount?: number
          description?: string | null
          created_at?: string
        }
        Relationships: []
      }
      nav_history: {
        Row: {
          id: string
          investor_id: string
          fund_id: string
          report_date: string
          nav_value: number
          created_at: string
        }
        Insert: {
          id?: string
          investor_id: string
          fund_id: string
          report_date: string
          nav_value: number
          created_at?: string
        }
        Update: {
          id?: string
          investor_id?: string
          fund_id?: string
          report_date?: string
          nav_value?: number
          created_at?: string
        }
        Relationships: []
      }
      investor_documents: {
        Row: {
          id: string
          investor_id: string
          fund_id: string | null
          title: string
          document_type:
            | 'quarterly_report'
            | 'annual_report'
            | 'investor_letter'
            | 'tax_document'
            | 'capital_call_notice'
            | 'distribution_notice'
            | 'other'
          storage_path: string
          file_size: number | null
          uploaded_at: string
        }
        Insert: {
          id?: string
          investor_id: string
          fund_id?: string | null
          title: string
          document_type:
            | 'quarterly_report'
            | 'annual_report'
            | 'investor_letter'
            | 'tax_document'
            | 'capital_call_notice'
            | 'distribution_notice'
            | 'other'
          storage_path: string
          file_size?: number | null
          uploaded_at?: string
        }
        Update: {
          id?: string
          investor_id?: string
          fund_id?: string | null
          title?: string
          document_type?:
            | 'quarterly_report'
            | 'annual_report'
            | 'investor_letter'
            | 'tax_document'
            | 'capital_call_notice'
            | 'distribution_notice'
            | 'other'
          storage_path?: string
          file_size?: number | null
          uploaded_at?: string
        }
        Relationships: []
      }
      fund_holdings: {
        Row: {
          id: string
          fund_id: string
          name: string
          cost: number
          fair_value: number | null
          valuation_date: string | null
          created_at: string
        }
        Insert: {
          id?: string
          fund_id: string
          name: string
          cost?: number
          fair_value?: number | null
          valuation_date?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          fund_id?: string
          name?: string
          cost?: number
          fair_value?: number | null
          valuation_date?: string | null
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

// Convenience types
export type Investor = Database['public']['Tables']['investors']['Row']
export type Fund = Database['public']['Tables']['funds']['Row']
export type FundPosition = Database['public']['Tables']['fund_positions']['Row']
export type CapitalCall = Database['public']['Tables']['capital_calls']['Row']
export type NavHistory = Database['public']['Tables']['nav_history']['Row']
export type InvestorDocument = Database['public']['Tables']['investor_documents']['Row']
export type FundHolding = Database['public']['Tables']['fund_holdings']['Row']
