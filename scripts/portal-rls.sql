-- ============================================================
-- INVESTOR PORTAL RLS POLICIES
-- Run second. Enables RLS and creates policies.
-- Requires schema to exist (portal-schema.sql).
-- ============================================================

-- ============================================================
-- HELPER FUNCTION: get current investor ID from auth user
-- ============================================================
CREATE OR REPLACE FUNCTION get_investor_id()
RETURNS UUID AS $$
  SELECT id FROM investors WHERE auth_user_id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================================
-- ENABLE RLS ON ALL TABLES
-- ============================================================
ALTER TABLE funds ENABLE ROW LEVEL SECURITY;
ALTER TABLE investors ENABLE ROW LEVEL SECURITY;
ALTER TABLE fund_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE capital_calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE nav_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE investor_documents ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- FUNDS: readable by all authenticated users (reference data)
-- ============================================================
CREATE POLICY "Authenticated users can read funds"
  ON funds FOR SELECT
  TO authenticated
  USING (true);

-- ============================================================
-- INVESTORS: users can only read their own record
-- ============================================================
CREATE POLICY "Investors can read own record"
  ON investors FOR SELECT
  TO authenticated
  USING (auth_user_id = auth.uid());

-- ============================================================
-- FUND POSITIONS: users can only read their own positions
-- ============================================================
CREATE POLICY "Investors can read own positions"
  ON fund_positions FOR SELECT
  TO authenticated
  USING (investor_id = get_investor_id());

-- ============================================================
-- CAPITAL CALLS: users can only read their own calls
-- ============================================================
CREATE POLICY "Investors can read own capital calls"
  ON capital_calls FOR SELECT
  TO authenticated
  USING (investor_id = get_investor_id());

-- ============================================================
-- NAV HISTORY: users can only read their own NAV data
-- ============================================================
CREATE POLICY "Investors can read own NAV history"
  ON nav_history FOR SELECT
  TO authenticated
  USING (investor_id = get_investor_id());

-- ============================================================
-- INVESTOR DOCUMENTS: users can only read their own documents
-- ============================================================
CREATE POLICY "Investors can read own documents"
  ON investor_documents FOR SELECT
  TO authenticated
  USING (investor_id = get_investor_id());

-- ============================================================
-- STORAGE: private bucket for investor documents
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('investor-documents', 'investor-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: investors can read files in their own folder
-- Folder structure: investor-documents/{investor_id}/...
CREATE POLICY "Investors can read own document files"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'investor-documents'
    AND (storage.foldername(name))[1] = get_investor_id()::text
  );
