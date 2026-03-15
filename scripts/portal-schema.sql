-- ============================================================
-- INVESTOR PORTAL SCHEMA
-- Run first. Creates all tables and indexes.
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- FUNDS (reference data)
-- ============================================================
CREATE TABLE funds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  fund_type TEXT NOT NULL CHECK (fund_type IN ('PE', 'VC', 'PIPE')),
  vintage_year INT,
  currency TEXT NOT NULL DEFAULT 'EUR',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'closed', 'fundraising')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_funds_slug ON funds(slug);
CREATE INDEX idx_funds_status ON funds(status);

-- ============================================================
-- INVESTORS (linked to Supabase Auth users)
-- ============================================================
CREATE TABLE investors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_user_id UUID NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  fiscal_code TEXT,
  language TEXT NOT NULL DEFAULT 'it',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_investors_auth_user_id ON investors(auth_user_id);

-- ============================================================
-- FUND POSITIONS (investor's position in each fund)
-- ============================================================
CREATE TABLE fund_positions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  investor_id UUID NOT NULL REFERENCES investors(id) ON DELETE CASCADE,
  fund_id UUID NOT NULL REFERENCES funds(id) ON DELETE CASCADE,
  committed_capital NUMERIC NOT NULL DEFAULT 0,
  invested_capital NUMERIC NOT NULL DEFAULT 0,
  distributions NUMERIC NOT NULL DEFAULT 0,
  current_nav NUMERIC NOT NULL DEFAULT 0,
  nav_date DATE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(investor_id, fund_id)
);

CREATE INDEX idx_fund_positions_investor ON fund_positions(investor_id);
CREATE INDEX idx_fund_positions_fund ON fund_positions(fund_id);

-- ============================================================
-- CAPITAL CALLS (calls, distributions, recallable)
-- ============================================================
CREATE TABLE capital_calls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  investor_id UUID NOT NULL REFERENCES investors(id) ON DELETE CASCADE,
  fund_id UUID NOT NULL REFERENCES funds(id) ON DELETE CASCADE,
  call_date DATE NOT NULL,
  call_type TEXT NOT NULL CHECK (call_type IN ('capital_call', 'distribution', 'recallable')),
  amount NUMERIC NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_capital_calls_investor ON capital_calls(investor_id);
CREATE INDEX idx_capital_calls_fund ON capital_calls(fund_id);
CREATE INDEX idx_capital_calls_date ON capital_calls(call_date DESC);

-- ============================================================
-- NAV HISTORY (quarterly/periodic NAV snapshots)
-- ============================================================
CREATE TABLE nav_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  investor_id UUID NOT NULL REFERENCES investors(id) ON DELETE CASCADE,
  fund_id UUID NOT NULL REFERENCES funds(id) ON DELETE CASCADE,
  report_date DATE NOT NULL,
  nav_value NUMERIC NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(investor_id, fund_id, report_date)
);

CREATE INDEX idx_nav_history_investor ON nav_history(investor_id);
CREATE INDEX idx_nav_history_fund ON nav_history(fund_id);
CREATE INDEX idx_nav_history_date ON nav_history(report_date DESC);

-- ============================================================
-- INVESTOR DOCUMENTS (metadata, files stored in Supabase Storage)
-- ============================================================
CREATE TABLE investor_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  investor_id UUID NOT NULL REFERENCES investors(id) ON DELETE CASCADE,
  fund_id UUID REFERENCES funds(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  document_type TEXT NOT NULL CHECK (document_type IN (
    'quarterly_report', 'annual_report', 'investor_letter',
    'tax_document', 'capital_call_notice', 'distribution_notice', 'other'
  )),
  storage_path TEXT NOT NULL,
  file_size INT,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_investor_documents_investor ON investor_documents(investor_id);
CREATE INDEX idx_investor_documents_fund ON investor_documents(fund_id);
CREATE INDEX idx_investor_documents_type ON investor_documents(document_type);

-- ============================================================
-- TRIGGERS: auto-update updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_investors_updated_at
  BEFORE UPDATE ON investors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_fund_positions_updated_at
  BEFORE UPDATE ON fund_positions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
