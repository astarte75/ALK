-- ============================================================
-- INVESTOR PORTAL SEED DATA
-- Run third. Inserts test data.
-- Requires schema (portal-schema.sql) + RLS (portal-rls.sql).
--
-- IMPORTANT: Before running this script:
-- 1. Create a test user in Supabase Dashboard -> Authentication -> Users
-- 2. Replace the placeholder UUID below with the test user's auth UUID
-- ============================================================

-- ============================================================
-- FUNDS (3 sample funds)
-- ============================================================
INSERT INTO funds (id, name, slug, fund_type, vintage_year, currency, status) VALUES
  ('a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', 'Alkemia PE Fund I', 'alkemia-pe-fund-i', 'PE', 2020, 'EUR', 'active'),
  ('b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e', 'Alkemia VC Fund I', 'alkemia-vc-fund-i', 'VC', 2022, 'EUR', 'active'),
  ('c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f', 'Alkemia PIPE Fund I', 'alkemia-pipe-fund-i', 'PIPE', 2023, 'EUR', 'fundraising');

-- ============================================================
-- INVESTOR (1 sample investor)
-- TODO: Replace this UUID with the actual auth.users UUID from Supabase Dashboard
-- ============================================================
INSERT INTO investors (id, auth_user_id, full_name, email, company, fiscal_code, language) VALUES
  ('d4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f80', '7647908d-cb17-44eb-909a-c863941d2897', 'Marco Rossi', 'marco.rossi@example.com', 'Rossi Investimenti S.r.l.', 'RSSMRC80A01H501Z', 'it');

-- ============================================================
-- FUND POSITIONS (1 per fund for the sample investor)
-- ============================================================
INSERT INTO fund_positions (investor_id, fund_id, committed_capital, invested_capital, distributions, current_nav, nav_date) VALUES
  ('d4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f80', 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', 500000, 425000, 150000, 680000, '2025-12-31'),
  ('d4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f80', 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e', 250000, 175000, 25000, 210000, '2025-12-31'),
  ('d4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f80', 'c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f', 300000, 75000, 0, 78000, '2025-12-31');

-- ============================================================
-- CAPITAL CALLS (8 entries, mix of types)
-- ============================================================
INSERT INTO capital_calls (investor_id, fund_id, call_date, call_type, amount, description) VALUES
  -- PE Fund I calls
  ('d4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f80', 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', '2021-01-15', 'capital_call', 150000, 'Initial drawdown - first closing'),
  ('d4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f80', 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', '2021-07-01', 'capital_call', 125000, 'Second drawdown - portfolio acquisition'),
  ('d4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f80', 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', '2022-06-30', 'capital_call', 150000, 'Third drawdown - follow-on investment'),
  ('d4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f80', 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', '2023-12-15', 'distribution', 100000, 'Partial exit - TechCo S.p.A.'),
  ('d4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f80', 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', '2025-03-31', 'distribution', 50000, 'Dividend recapitalization'),
  -- VC Fund I calls
  ('d4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f80', 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e', '2022-04-01', 'capital_call', 100000, 'First closing drawdown'),
  ('d4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f80', 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e', '2023-01-15', 'capital_call', 75000, 'Second drawdown - Series A participation'),
  -- PIPE Fund I calls
  ('d4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f80', 'c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f', '2023-10-01', 'capital_call', 75000, 'Initial drawdown - PIPE investment');

-- ============================================================
-- NAV HISTORY (12 quarterly entries for PE Fund I, 2023-2025)
-- ============================================================
INSERT INTO nav_history (investor_id, fund_id, report_date, nav_value) VALUES
  ('d4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f80', 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', '2023-03-31', 480000),
  ('d4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f80', 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', '2023-06-30', 510000),
  ('d4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f80', 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', '2023-09-30', 530000),
  ('d4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f80', 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', '2023-12-31', 550000),
  ('d4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f80', 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', '2024-03-31', 570000),
  ('d4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f80', 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', '2024-06-30', 590000),
  ('d4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f80', 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', '2024-09-30', 620000),
  ('d4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f80', 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', '2024-12-31', 640000),
  ('d4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f80', 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', '2025-03-31', 650000),
  ('d4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f80', 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', '2025-06-30', 660000),
  ('d4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f80', 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', '2025-09-30', 670000),
  ('d4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f80', 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', '2025-12-31', 680000);

-- ============================================================
-- DOCUMENTS (2 sample document metadata entries)
-- ============================================================
INSERT INTO investor_documents (investor_id, fund_id, title, document_type, storage_path, file_size) VALUES
  ('d4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f80', 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', 'Report Trimestrale Q4 2025 - PE Fund I', 'quarterly_report', 'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f80/pe-fund-i/report-q4-2025.pdf', 2450000),
  ('d4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f80', 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', 'Lettera agli Investitori 2025 - PE Fund I', 'investor_letter', 'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f80/pe-fund-i/lettera-investitori-2025.pdf', 1200000);
