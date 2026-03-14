# Alkemia Capital Website

## What This Is

A faithful replica of hgcapital.com adapted for Alkemia Capital (alkemiacapital.com). The site replicates HG Capital's layout, structure, animations, and premium dark aesthetic, but with Alkemia's content, branding, and a new dark-premium color palette. Built with the same tech stack (Next.js, Contentful, Styled Components) and deployed on Vercel.

## Core Value

The site must look and feel indistinguishable in quality from hgcapital.com — same level of polish, animations, and premium design — while being unmistakably Alkemia Capital in content and branding.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Faithful replication of HG Capital site structure and layout
- [ ] Next.js framework with SSR/SSG
- [ ] Contentful headless CMS for content management
- [ ] Styled Components for styling (matching HG approach)
- [ ] Dark premium theme with new Alkemia color palette
- [ ] Video hero on homepage, static images elsewhere (mix approach)
- [ ] Smooth scroll animations matching HG quality
- [ ] Italian + English (i18n) support
- [ ] Vercel deployment
- [ ] Responsive design (mobile-first)
- [ ] All Alkemia content integrated (from alkemiacapital-site.md)
- [ ] SEO optimization (meta tags, OG, structured data)

### Out of Scope

- WordPress/Elementor (current Alkemia stack) — rebuilding from scratch with modern stack
- Real-time chat or interactive tools — corporate brochure site
- E-commerce or payment functionality — not applicable
- User authentication / investor portal — separate system if needed
- Blog CMS with commenting — news section only, managed via Contentful

## Context

**Reference site:** hgcapital.com — a Next.js site using Contentful CMS, Styled Components, Vimeo video embeds, smooth scroll animations, and a dark (#1A1E22) theme with red (#F8495E) accent color.

**HG Capital site structure (to replicate):**
1. **Homepage** — Full-screen hero with video background, animated sections on scroll (AI transformation, Enduring legacies, Enterprise focus, Life at Hg), news carousel, footer
2. **Approach** — Company philosophy, stats ($180B portfolio), sub-pages: Creating Value, Responsible Investing
3. **Insights** — News articles, podcasts, thought leadership
4. **Portfolio** — Grid of portfolio companies with filtering
5. **Team** — Team member grid with individual profiles
6. **Life at Hg** — Culture page, sub-page: Diversity & Inclusion
7. **Investors** — Investor-facing information
8. **Contact Us** — Contact form, office locations
9. **Footer** — Legal, Privacy, Cookie, Governance, Modern Slavery, Accessibility

**Alkemia Capital content available:**
- Company info (Società): history from 2005, mission, approach, values
- Corporate Governance: board members (7 CdA + 3 Collegio Sindacale + control functions)
- Team: 15 members with photos and roles
- Investment Platforms: Private Equity, Venture Capital, PIPE
- Funds: Amarone, Food Excellence I, Flexible Capital I, Sinergia Venture Fund, PIPE
- Portfolio: 18 companies (Agricooltur, Casta Diva, Circle Group, Codemotion, Contents, Convivio, DHH, Ermes, Glickon, Hlpy, Izertis, Pakelo, Redelfi, Soplaya, etc.)
- News: multiple articles with images
- Sustainability/ESG: policy, SFDR disclosure
- Contacts: Milan (Piazzetta Pattari 7) and Padova (Piazza Cavour 4)

**Content source:** `alkemiacapital-site.md` in project root — full markdown export of current site

**Branding:** New dark-premium palette to be defined. Keep Alkemia logo but redesign color scheme for dark theme. HG uses #1A1E22 (dark bg) + #F8495E (red accent) — Alkemia needs equivalent distinctive palette.

**Section mapping:** To be decided later. Initial structure mirrors HG exactly, then content will be mapped to appropriate sections.

## Constraints

- **Tech Stack**: Next.js + Contentful + Styled Components + Vercel — non-negotiable, matches reference site
- **Fidelity**: Layout and UX must be visually comparable to hgcapital.com
- **i18n**: Architecture must support IT + EN from day one (next-intl or similar)
- **Performance**: Lighthouse score 90+ on all metrics
- **Accessibility**: WCAG 2.1 AA compliance (HG has an accessibility page)
- **Content**: All content from alkemiacapital-site.md must be accommodated

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Next.js as framework | Same as HG Capital, best SSR/SSG support, Vercel native | — Pending |
| Contentful as CMS | Same as HG Capital, proven for PE/VC sites, great Next.js integration | — Pending |
| Styled Components | Same as HG Capital (confirmed via class hash patterns), component-level styling | — Pending |
| Dark premium theme | User preference, matches PE/VC industry premium feel | — Pending |
| Vercel hosting | Native Next.js support, global CDN, easy CI/CD | — Pending |
| Video hero + static mix | Video only on homepage hero, images elsewhere for performance | — Pending |
| IT + EN bilingual | Expand reach to international investors | — Pending |

---
*Last updated: 2026-03-14 after initialization*
