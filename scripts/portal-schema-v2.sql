-- Portal Schema v2: Extended fields for fund positions, funds, capital calls, and fund holdings
-- Run this migration after portal-schema.sql

-- Add quota_class and residual_commitment to fund_positions
ALTER TABLE fund_positions ADD COLUMN IF NOT EXISTS quota_class TEXT;
ALTER TABLE fund_positions ADD COLUMN IF NOT EXISTS residual_commitment NUMERIC NOT NULL DEFAULT 0;

-- Add irr to funds
ALTER TABLE funds ADD COLUMN IF NOT EXISTS irr NUMERIC;

-- Expand call_type to include management_fee, expense, setup_cost
-- Drop and recreate the check constraint
ALTER TABLE capital_calls DROP CONSTRAINT IF EXISTS capital_calls_call_type_check;
ALTER TABLE capital_calls ADD CONSTRAINT capital_calls_call_type_check
  CHECK (call_type IN ('capital_call', 'distribution', 'recallable', 'management_fee', 'expense', 'setup_cost'));

-- New table: fund_holdings (portfolio companies within each fund)
CREATE TABLE IF NOT EXISTS fund_holdings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fund_id UUID NOT NULL REFERENCES funds(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  cost NUMERIC NOT NULL DEFAULT 0,
  fair_value NUMERIC,
  valuation_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_fund_holdings_fund ON fund_holdings(fund_id);

-- Enable RLS on fund_holdings (readable by all authenticated users, like funds)
ALTER TABLE fund_holdings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read fund holdings"
  ON fund_holdings FOR SELECT
  TO authenticated
  USING (true);
