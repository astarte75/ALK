# Feature Landscape

**Domain:** Premium PE/VC corporate website (replica of hgcapital.com for Alkemia Capital)
**Researched:** 2026-03-14
**Reference:** hgcapital.com (live analysis) + MVP Design 2025 trends + TBH Creative PE requirements

---

## Table Stakes

Features users expect. Missing = the site feels amateurish or incomplete for institutional audiences.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Fixed navigation header with logo | Every corporate site has one; disorienting without it | Low | Sticky on scroll, collapses to hamburger on mobile |
| Full-screen video hero (homepage) | Standard at top PE/VC tier; HG uses it, Blackstone uses it | Medium | Vimeo embed, poster image fallback, muted/autoplay |
| Scroll-triggered fade/reveal animations | HG uses split-text reveals, fade-in blocks; absence signals low budget | Medium | GSAP ScrollTrigger or Framer Motion; must feel smooth not jarring |
| Portfolio grid with filtering | Core purpose of a PE site; investors scan portfolios | Medium | Filter by sector, status; search; responsive 1/2/3 col grid |
| Team grid with profile pages | LP due diligence always starts with team | Medium | Photo + name + role; filterable by team/location |
| News/Insights section | Establishes thought leadership; expected by all PE audiences | Medium | Card grid, categories (Insights/News/Podcast), chronological |
| ESG/Responsible Investing page | Required by SFDR; investors expect it; reputational baseline | Low | Stats, framework diagram, downloadable PDF reports |
| Contact page with office locations | Basic; every firm has this | Low | Phone + email per office; no map required but expected |
| Responsive design (mobile-first) | 30-40% of B2B visitors are on mobile; Google ranking factor | Medium | Must work at 320px through 2560px |
| Footer with legal links | GDPR/legal requirement; trust signal | Low | Privacy, Cookie Notice, Legal, Governance, Accessibility |
| Cookie consent banner (GDPR compliant) | Legal requirement in EU/Italy (Garante enforcement active) | Low | Equal prominence Accept/Reject; no dark patterns; blocks non-essential cookies pre-consent |
| Privacy Notice page | GDPR mandatory | Low | Last-updated date; data controller; contact details |
| Cookie Notice page | GDPR mandatory | Low | Categories: essential, functional, analytics |
| SEO basics (meta tags, OG, canonical) | Organic visibility; critical for "Alkemia Capital" branded searches | Low | next-seo or built-in Next.js metadata API |
| Lighthouse 90+ performance | Fast load = credibility signal; Vercel + Next.js makes this achievable | Medium | Image optimization, lazy loading, code splitting |
| WCAG 2.1 AA accessibility | HG has an accessibility page; EU standard; growing legal exposure | Medium | Keyboard nav, alt text, color contrast, focus indicators |

---

## Differentiators

Features that set a premium site apart. Not universally expected, but they signal top-tier quality.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Custom cursor element | Immediate luxury signal; HG uses a scaling cursor on interaction | Low | CSS/JS only; subtle not gimmicky |
| Split-text hero animation | Creates cinematic feel; HG's signature 2-second staggered reveal | Medium | GSAP SplitText or custom; requires careful perf tuning |
| Multi-section video scroll narrative (homepage) | HG's 5 fullscreen video sections tell a story; no competitor does this as well | High | Multiple Vimeo embeds, lazy loaded, mobile image fallbacks |
| Glassmorphism / noise texture overlays | Adds depth and premium texture; HG uses backdrop-blur + noise SVG | Low-Medium | CSS only; careful with performance on low-end devices |
| Insights masonry grid with category filter | More sophisticated than a plain blog list; signals editorial investment | Medium | Variable card sizes; filter by Insights/News/Podcast |
| Podcast content type | Differentiates from firms that only publish articles | Low | Same card system; embed or link to external player |
| ESG resource library with chronological PDFs | Shows historical commitment; LPs validate consistency over time | Low | Dropdown or accordion; Contentful PDF asset management |
| Culture/Life at [Firm] page | Talent acquisition signal; shows firm has an identity beyond returns | Medium | Photo-heavy, narrative structure, benefits grid, awards carousel |
| D&I sub-page | Expected by institutional LPs; signals governance maturity | Low | Qualitative content; leader quote; linked from culture page |
| Governance page | Required for Italian SGR regulated entities (Alkemia = SGR) | Low | Board composition, committee structure, internal controls |
| Investment Platforms section (PE/VC/PIPE) | Alkemia has 3 distinct strategies; must explain each clearly | Medium | Sub-pages or tabs per platform with fund details |
| i18n (Italian + English) | Alkemia targets both Italian and international investors | High | next-intl from day one; dual-language URL structure; CMS content in both languages |
| Newsletter subscription | Low-friction engagement; HG uses it site-wide | Low | Email input + CTA; can integrate Mailchimp/similar |
| Stat counters / key metrics | "18 portfolio companies", "€X AUM" — social proof without claims | Low | Animated number counters on scroll; content from Contentful |
| Dark premium theme with custom palette | HG uses #1A1E22 + #F8495E; Alkemia needs own equivalent | Low | Design decision, not dev complexity; CSS variables/tokens |
| Funds detail pages | Alkemia has 5 named funds; detail pages build LP confidence | Medium | Fund name, strategy, size, vintage, status |

---

## Anti-Features

Features to explicitly NOT build for this project.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Gated investor portal | Out of scope per PROJECT.md; complex auth/security overhead | Link to external IR platform (FIS, Investor Portal SaaS) if needed later |
| Blog commenting system | Not a media company; comments add moderation burden with zero PE value | Insights are read-only; engagement via newsletter or contact |
| Interactive financial calculators | Not a retail finance product; would confuse positioning | Static fund performance stats in Contentful |
| Real-time chat widget | Devalues institutional positioning; distracts from form | Contact page with email/phone; discreet and professional |
| Social media feed embeds | External feeds break; slow load; undermines editorial control | Link icons to LinkedIn/X in footer only |
| E-commerce / payment flows | Out of scope; not applicable to PE fundraising | |
| WordPress/Elementor | Out of scope per PROJECT.md; current Alkemia stack being replaced | Next.js + Contentful only |
| User accounts / login (beyond external IR) | Out of scope; security burden disproportionate to benefit | |
| AI chatbot | Not established at HG-tier; introduces unpredictable brand risk | |
| Heavy third-party tracking beyond analytics | Italian Garante active enforcement; reputational risk for a financial firm | Minimal analytics (GA4 or privacy-first alternative); documented in Cookie Notice |

---

## Feature Dependencies

```
Video hero → Vimeo integration → Performance budget planning (lazy load)
Portfolio grid → Contentful content model (Company type) → Filtering logic
Team grid → Contentful content model (Person type) → Individual profile pages
Insights section → Contentful content model (Article/Podcast/News types) → Category filter
i18n → next-intl setup → Contentful multi-locale content → All pages affected
ESG page → PDF asset management in Contentful → Resource library component
Culture page → Photography assets → Image optimization pipeline
Cookie consent → GDPR-compliant implementation → Blocks analytics until consent
Analytics → Cookie consent → Privacy Notice update
Governance page → Legal/board content → Contentful content model (Governance type)
Funds pages → Contentful content model (Fund type) → Investment Platforms section
Scroll animations → GSAP/Framer Motion → Performance budget (must not block LCP)
Dark theme → CSS design tokens → All components
```

---

## HG Capital Page-by-Page Feature Inventory

Documented from live site analysis (2026-03-14).

### Homepage
- Full-screen video hero with poster fallback (2560x1440px)
- Bold headline + subtitle + CTA button
- Scroll indicator dots with pulse animation
- 4-5 full-height scroll sections (each with background video + copy + CTA)
- Insights carousel (3 featured cards)
- Newsletter signup strip
- Custom cursor (scales on hover)
- Split-text reveal animations (2s duration, staggered)
- Fade transitions (1.5s)

### Portfolio (`/portfolio/`)
- Responsive grid: 1col mobile / 2col tablet / 3col desktop
- Filters: category dropdown, status selector, text search, A-Z sort, clear all
- Cards: logo, company name, short description, founded year, partnership date, country
- Full-card clickable link overlay
- Color transitions on hover (0.15s cubic-bezier)

### Team (`/team/`)
- Responsive grid: 2col mobile / multi-col desktop
- Filters: team dropdown, location dropdown, sort
- Cards: photo, name, role, location
- Individual profile pages (linked from cards)

### Insights (`/insights/`)
- Masonry-style variable card grid
- Content types: Insights, News, Podcasts (filter buttons)
- Sort: Latest (default)
- Featured + companion card alternating layout
- Hover: image zoom (1.2x) + semi-transparent overlay
- No pagination; batch loading chronologically
- Global header search with autocomplete

### Approach (`/approach/`)
- Stats section ($180B portfolio)
- Sub-pages: Driving AI Transformation, Responsible Investing

### Responsible Investing (`/approach/responsible-investing/`)
- Hero with CTA to RI Report PDF
- Framework diagram (Sustainable Business Framework)
- 4 key stats (UNPRI rating, donations, Glassdoor, eNPS)
- Podcast feature
- Resource library: 20+ PDFs, chronological, with dates

### Life at Hg (`/life-at-hg/`)
- Narrative sections (culture, values x4, benefits)
- 11-item benefits grid with icons
- Awards carousel
- D&I sub-page
- Hg Foundation mention
- Employee testimonial
- Alternating light/dark section backgrounds

### Investors (`/investors/`)
- 3 investor categories: Listed (HGT), Wealth (family offices), Institutional
- Fund strategies summary (Saturn/Genesis/Mercury equivalent)
- CTA to external gated investor area (FIS)
- PDF download (RI Report)

### Contact Us (`/contact-us/`)
- Office locations (city, address, phone, email)
- City photography per office
- Newsletter subscription
- No contact form — direct email/phone preferred

### Footer
- Legal links: Privacy, Cookie Notice, Legal+Privacy, Governance, Modern Slavery, Accessibility
- Social: LinkedIn, X
- Cookie settings toggle

---

## MVP Recommendation

### Phase 1 — Core Shell (table stakes + structure)
1. Next.js app setup with i18n routing and dark theme tokens
2. Navigation (fixed header, hamburger mobile)
3. Homepage: video hero + 3 scroll sections (simplified from HG's 5) + insights preview
4. Footer with all legal links
5. Cookie consent banner (GDPR-compliant, blocks analytics)
6. Privacy Notice + Cookie Notice pages (static)
7. Contact page (offices + email)

### Phase 2 — Content Sections
8. Portfolio grid with Contentful integration + filtering
9. Team grid with profile pages + filtering
10. Insights section (articles + news; podcasts can wait)
11. About/Approach + ESG page with PDF downloads
12. Investment Platforms (PE/VC/PIPE) + Funds detail pages

### Phase 3 — Polish + Differentiators
13. Scroll animations (GSAP/Framer Motion — all pages)
14. Culture/Life at Alkemia page
15. Governance page (SGR regulatory requirement)
16. Newsletter integration
17. Stat counters, awards carousel
18. Accessibility audit (WCAG 2.1 AA)
19. SEO: structured data, OG tags, sitemap

### Defer
- Podcast content type (added to CMS model in Phase 2, front-end in Phase 3+)
- Gated investor portal (separate project/system)
- Custom cursor (low effort, add to Phase 3)

---

## Sources

- hgcapital.com live analysis (homepage, portfolio, team, insights, approach, responsible investing, life at hg, investors, contact) — HIGH confidence
- [2025 Top Ten Trends in Private Equity and Investment Banking Website Design — MVP Design](https://mvpdesign.com/blog/2025s-top-ten-trends-in-private-equity-and-investment-banking-website-design/) — MEDIUM confidence
- [Must-Haves for PE and Family Office Websites — TBH Creative](https://www.tbhcreative.com/blog/family-office-websites-and-private-equity-web-design/) — MEDIUM confidence
- [Italian Garante cookie consent enforcement — Didomi](https://www.didomi.io/blog/italian-garante-new-guidelines) — HIGH confidence
- PROJECT.md constraints and scope — HIGH confidence (primary source)
