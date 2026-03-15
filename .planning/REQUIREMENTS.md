# Requirements: Alkemia Capital Website

**Defined:** 2026-03-14
**Core Value:** The site must look and feel indistinguishable in quality from hgcapital.com while being unmistakably Alkemia Capital in content and branding.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Foundation

- [x] **FOUND-01**: Site uses Next.js 15 App Router with SSR/SSG
- [x] **FOUND-02**: Styled Components v6 with proper SSR registry (no hydration mismatch)
- [x] **FOUND-03**: Dark premium theme implemented via CSS custom properties (not JS ThemeProvider)
- [x] **FOUND-04**: Contentful REST API integration with TypeScript types for all content models
- [x] **FOUND-05**: i18n support with next-intl (IT default without prefix, EN with /en/ prefix)
- [x] **FOUND-06**: Responsive design working from 320px to 2560px
- [ ] **FOUND-07**: Vercel deployment with CI/CD pipeline
- [x] **FOUND-08**: Contentful webhook for on-demand ISR (no time-based revalidation)

### Navigation & Layout

- [ ] **NAV-01**: Fixed header with Alkemia logo, navigation links, and hamburger menu on mobile
- [ ] **NAV-02**: Footer with legal links (Privacy, Cookie, Legal, Governance, Accessibility)
- [ ] **NAV-03**: Footer with social links (LinkedIn, X/Twitter)
- [x] **NAV-04**: Custom cursor element that scales on interactive elements

### Homepage

- [ ] **HOME-01**: Full-screen video hero with Vimeo embed, poster image fallback, muted autoplay
- [ ] **HOME-02**: Bold headline with split-text staggered reveal animation (GSAP SplitText)
- [ ] **HOME-03**: 4-5 full-height scroll sections with background video/images and text overlay
- [ ] **HOME-04**: Scroll-triggered fade/reveal animations on all sections (GSAP ScrollTrigger)
- [ ] **HOME-05**: Insights preview section showing latest 3 news articles as cards
- [ ] **HOME-06**: Animated stat counters (portfolio companies, AUM, years of experience)
- [ ] **HOME-07**: Newsletter signup strip
- [ ] **HOME-08**: Smooth scroll experience (Lenis)

### Portfolio

- [ ] **PORT-01**: Responsive portfolio grid (1col mobile / 2col tablet / 3col desktop)
- [ ] **PORT-02**: Filter by sector (ICT, Automotive & Mobility, Agri-tech, Food & Beverage)
- [ ] **PORT-03**: Filter by fund type (Private Equity, Venture Capital, PIPE)
- [ ] **PORT-04**: Company cards with logo, name, description, sector, year, fund type
- [ ] **PORT-05**: Individual company detail pages with full information
- [ ] **PORT-06**: Hover effects on cards (color transition, image zoom)

### Team

- [ ] **TEAM-01**: Responsive team grid with photos, names, and roles
- [ ] **TEAM-02**: Individual profile pages for each team member
- [ ] **TEAM-03**: Filter by role category (Partners, Investment Team, Operations)

### News & Insights

- [ ] **NEWS-01**: Card grid layout for news articles with image, date, title, excerpt
- [ ] **NEWS-02**: Chronological ordering (newest first)
- [ ] **NEWS-03**: Individual article pages with full content
- [ ] **NEWS-04**: Category filter (News, Insights)
- [ ] **NEWS-05**: Pagination or batch loading

### Investment Platforms

- [ ] **INVP-01**: Overview page explaining PE, VC, and PIPE strategies
- [ ] **INVP-02**: Individual sub-pages for each investment platform (PE, VC, PIPE)
- [ ] **INVP-03**: Fund detail sections within each platform (Amarone, Food Excellence I, Flexible Capital I, Sinergia Venture Fund, PIPE Fund)
- [ ] **INVP-04**: Fund metrics display (fund size, status, investment period)

### Società (About)

- [ ] **ABOUT-01**: Company description and history timeline (2005-2024)
- [ ] **ABOUT-02**: Mission statement section
- [ ] **ABOUT-03**: Approach and values sections
- [ ] **ABOUT-04**: Key statistics (years of experience, AUM, completed operations)

### Corporate Governance

- [ ] **GOV-01**: Board of Directors section with photos, names, roles (7 members)
- [ ] **GOV-02**: Board of Statutory Auditors section (3 members)
- [ ] **GOV-03**: Control Functions section (Audit, Compliance, AML, Risk, Internal Audit)
- [ ] **GOV-04**: Shareholder structure description

### Sostenibilità / ESG

- [ ] **ESG-01**: ESG policy overview with Environment, Social, Governance sections
- [ ] **ESG-02**: SFDR disclosure (Art. 3, 4, 5) full text
- [ ] **ESG-03**: Downloadable PDF documents (ESG policy, fund-specific SFDR disclosures)
- [ ] **ESG-04**: UN SDGs image/reference

### Contatti

- [x] **CONT-01**: Office locations for Milano and Padova with addresses and phone numbers
- [x] **CONT-02**: Contact form with request type selector (Investitore, Opportunità, Segreteria)
- [x] **CONT-03**: reCAPTCHA integration for spam protection

### Culture / Life at Alkemia

- [ ] **CULT-01**: Culture/values narrative page
- [ ] **CULT-02**: Photo-heavy layout showcasing team and offices

### Legal & Compliance

- [x] **LEGAL-01**: Cookie consent banner with equal prominence Accept/Reject (GDPR Italy)
- [x] **LEGAL-02**: Privacy Notice page with data controller info
- [x] **LEGAL-03**: Cookie Notice page with cookie categories
- [ ] **LEGAL-04**: Accessibility statement page

### Site Review & Layout Polish

- [ ] **REVIEW-01**: All pages render correctly at 320px, 768px, 1024px, 1440px, 2560px without layout breaks
- [ ] **REVIEW-02**: Typography hierarchy is consistent across all pages
- [ ] **REVIEW-03**: Navigation flows work end-to-end (every page reachable, no broken links)
- [ ] **REVIEW-04**: Visual consistency (card styles, section spacing, color usage, dark theme contrast)

### Investor Portal

- [ ] **PORTAL-01**: Login page at `/investitori` (IT) / `/en/investors` (EN) with authentication
- [ ] **PORTAL-02**: Personalized investor dashboard showing fund positions (fund name, committed capital, invested, distributions, NAV)
- [ ] **PORTAL-03**: Protected routes — unauthenticated users redirected to login, no fund data exposed without valid session
- [ ] **PORTAL-04**: Portal UI matches dark premium aesthetic of the rest of the site
- [ ] **PORTAL-05**: Secure session management (httpOnly cookies, CSRF protection, session expiry)
- [ ] **PORTAL-06**: Portal works in both Italian and English

### General Review & Refinements

- [ ] **REFINE-01**: All accumulated issues from Phase 6-7 reviews resolved
- [ ] **REFINE-02**: Content accurate and up-to-date in both languages
- [ ] **REFINE-03**: User flows work smoothly end-to-end (homepage → portfolio → detail, homepage → portal → dashboard)

### SEO & Performance

- [ ] **SEO-01**: Meta tags, Open Graph, and canonical URLs on all pages
- [ ] **SEO-02**: JSON-LD structured data (Organization, WebSite)
- [ ] **SEO-03**: XML sitemap auto-generation
- [ ] **SEO-04**: Lighthouse score 90+ on all metrics
- [ ] **SEO-05**: Image optimization via Next.js Image component + Contentful image API

### Accessibility

- [ ] **A11Y-01**: WCAG 2.1 AA color contrast compliance
- [ ] **A11Y-02**: Full keyboard navigation support
- [ ] **A11Y-03**: Screen reader compatible (proper ARIA labels, semantic HTML)
- [ ] **A11Y-04**: Focus indicators on all interactive elements

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Enhanced Features

- **V2-01**: Podcast content type with embedded player
- **V2-02**: Awards/recognition carousel
- **V2-03**: Global site search with autocomplete
- **V2-04**: Masonry/variable-size card layout for insights
- **V2-05**: Glassmorphism/noise texture overlays for visual depth
- ~~**V2-06**: Gated investor portal~~ — **Moved to v1 Phase 7**
- **V2-07**: Multi-office map integration (Google Maps embed)
- **V2-08**: Diversity & Inclusion sub-page

## Out of Scope

| Feature | Reason |
|---------|--------|
| WordPress/Elementor | Replacing entirely with Next.js + Contentful |
| Blog commenting | Not a media company; zero PE value, moderation burden |
| Real-time chat widget | Devalues institutional positioning |
| E-commerce / payments | Not applicable to PE fundraising |
| ~~User accounts / login~~ | ~~Security burden~~ — **Now in scope for Investor Portal (Phase 7)** |
| AI chatbot | Unpredictable brand risk for financial firm |
| Social media feed embeds | Break easily, slow, undermine editorial control |
| Interactive financial calculators | Not a retail product; confuses positioning |
| Heavy third-party tracking | Italian Garante enforcement risk; reputational concern |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| FOUND-01 | Phase 1 | Complete |
| FOUND-02 | Phase 1 | Complete |
| FOUND-03 | Phase 1 | Complete |
| FOUND-04 | Phase 2 | Complete |
| FOUND-05 | Phase 1 | Complete |
| FOUND-06 | Phase 1 | Complete |
| FOUND-07 | Phase 1 | Pending |
| FOUND-08 | Phase 2 | Complete |
| NAV-01 | Phase 3 | Pending |
| NAV-02 | Phase 3 | Pending |
| NAV-03 | Phase 3 | Pending |
| NAV-04 | Phase 3 | Complete |
| HOME-01 | Phase 4 | Pending |
| HOME-02 | Phase 5 | Pending |
| HOME-03 | Phase 5 | Pending |
| HOME-04 | Phase 5 | Pending |
| HOME-05 | Phase 4 | Pending |
| HOME-06 | Phase 4 | Pending |
| HOME-07 | Phase 4 | Pending |
| HOME-08 | Phase 5 | Pending |
| PORT-01 | Phase 4 | Pending |
| PORT-02 | Phase 4 | Pending |
| PORT-03 | Phase 4 | Pending |
| PORT-04 | Phase 4 | Pending |
| PORT-05 | Phase 4 | Pending |
| PORT-06 | Phase 4 | Pending |
| TEAM-01 | Phase 4 | Pending |
| TEAM-02 | Phase 4 | Pending |
| TEAM-03 | Phase 4 | Pending |
| NEWS-01 | Phase 4 | Pending |
| NEWS-02 | Phase 4 | Pending |
| NEWS-03 | Phase 4 | Pending |
| NEWS-04 | Phase 4 | Pending |
| NEWS-05 | Phase 4 | Pending |
| INVP-01 | Phase 4 | Pending |
| INVP-02 | Phase 4 | Pending |
| INVP-03 | Phase 4 | Pending |
| INVP-04 | Phase 4 | Pending |
| ABOUT-01 | Phase 4 | Pending |
| ABOUT-02 | Phase 4 | Pending |
| ABOUT-03 | Phase 4 | Pending |
| ABOUT-04 | Phase 4 | Pending |
| GOV-01 | Phase 4 | Pending |
| GOV-02 | Phase 4 | Pending |
| GOV-03 | Phase 4 | Pending |
| GOV-04 | Phase 4 | Pending |
| ESG-01 | Phase 4 | Pending |
| ESG-02 | Phase 4 | Pending |
| ESG-03 | Phase 4 | Pending |
| ESG-04 | Phase 4 | Pending |
| CONT-01 | Phase 4 | Complete |
| CONT-02 | Phase 4 | Complete |
| CONT-03 | Phase 4 | Complete |
| CULT-01 | Phase 4 | Pending |
| CULT-02 | Phase 4 | Pending |
| LEGAL-01 | Phase 3 | Complete |
| LEGAL-02 | Phase 3 | Complete |
| LEGAL-03 | Phase 3 | Complete |
| LEGAL-04 | Phase 3 | Pending |
| REVIEW-01 | Phase 6 | Pending |
| REVIEW-02 | Phase 6 | Pending |
| REVIEW-03 | Phase 6 | Pending |
| REVIEW-04 | Phase 6 | Pending |
| PORTAL-01 | Phase 7 | Pending |
| PORTAL-02 | Phase 7 | Pending |
| PORTAL-03 | Phase 7 | Pending |
| PORTAL-04 | Phase 7 | Pending |
| PORTAL-05 | Phase 7 | Pending |
| PORTAL-06 | Phase 7 | Pending |
| REFINE-01 | Phase 8 | Pending |
| REFINE-02 | Phase 8 | Pending |
| REFINE-03 | Phase 8 | Pending |
| SEO-01 | Phase 9 | Pending |
| SEO-02 | Phase 9 | Pending |
| SEO-03 | Phase 9 | Pending |
| SEO-04 | Phase 9 | Pending |
| SEO-05 | Phase 9 | Pending |
| A11Y-01 | Phase 10 | Pending |
| A11Y-02 | Phase 10 | Pending |
| A11Y-03 | Phase 10 | Pending |
| A11Y-04 | Phase 10 | Pending |

**Coverage:**
- v1 requirements: 85 total (68 original + 17 new)
- Mapped to phases: 85
- Unmapped: 0

---
*Requirements defined: 2026-03-14*
*Last updated: 2026-03-15 after roadmap restructure — added REVIEW, PORTAL, REFINE requirements; renumbered SEO→Phase 9, A11Y→Phase 10*
