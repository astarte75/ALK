# Technology Stack

**Project:** Alkemia Capital Website (replica di hgcapital.com)
**Researched:** 2026-03-14
**Overall confidence:** HIGH (stack non negoziabile per progetto, verificato su fonti ufficiali)

---

## Recommended Stack

### Core Framework

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Next.js | 15.x (LTS) | Framework React SSR/SSG | Stesso stack di hgcapital.com. Nota: Next.js 16 e' uscito a ottobre 2025 con breaking changes significativi (async request APIs obbligatorie, Turbopack default, middleware rinominato). Usare 15.x per stabilita' e compatibilita' con l'ecosistema attuale |
| React | 18.x | UI library | Next.js 15 supporta React 18 Pages Router e React 19 App Router. React 18 e' piu' maturo per styled-components |
| TypeScript | 5.x | Type safety | Standard de facto per progetti premium. Contentful SDK e next-intl hanno tipi nativi |

**Nota su Next.js 16:** E' la versione corrente (marzo 2026) ma introduce breaking changes che rendono la migrazione non banale per progetti nuovi che usano librerie come styled-components. Iniziare su 15.x stabile con App Router e' la scelta pragmatica. La upgrade a 16 puo' avvenire dopo il lancio iniziale.

### CMS

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Contentful | SDK ^11.x (contentful npm) | Headless CMS per contenuti | Stesso CMS di hgcapital.com. Proven per siti PE/VC. Ottimo supporto Next.js App Router con server components |

**API da usare: REST API (Content Delivery API)**, non GraphQL.

Ragionamento: Il sito e' prevalentemente statico (SSG) con revalidation periodica. GraphQL di Contentful impone limiti di query size che complicano il rendering di rich text nested. REST e' piu' semplice da gestire, rate limits prevedibili, typing manuale ma mantenibile. GraphQL vale solo se serve live preview in real-time — funzionalita' non richiesta qui.

### Styling

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| styled-components | ^6.3.x | CSS-in-JS, component styling | Non negoziabile: stesso approccio di hgcapital.com (confermato da class hash patterns nel DOM). v6.3.0+ supporta React Server Components nativamente. Richiede registry SSR con `useServerInsertedHTML` per App Router |

**Nota critica:** Con styled-components v6.3+, i componenti stilizzati funzionano nei Server Components senza `use client`. Tuttavia la registry SSR va configurata nel root layout per evitare FOUC (Flash of Unstyled Content). Vedere sezione Pitfalls.

### Animazioni e Scroll

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| GSAP | ^3.14.x | Animazioni scroll-driven, timeline, ScrollTrigger | Standard industriale per animazioni premium. hgcapital.com usa animazioni timeline-based al scroll che richiedono ScrollTrigger. Bundle ~23KB gzip. Gratuito per uso commerciale |
| Lenis | ^1.3.x | Smooth scroll | Libreria leggera che sostituisce il comportamento di scroll nativo con inertia naturale. Si integra con GSAP ScrollTrigger via ticker RAF. darkroom.engineering (autori) la mantengono attivamente |

**Framer Motion: NON usare come alternativa principale.** Framer Motion e' ottimo per micro-animazioni UI component-level ma non per le animazioni scroll complesse che caratterizzano hgcapital.com. Loop RAF conflittuali con Lenis. GSAP + Lenis e' la combinazione standard per siti agency premium.

**Pattern di integrazione GSAP + Lenis:**
1. Lenis si inizializza in un Provider client-side con `use client`
2. Lenis ticker viene connesso a `gsap.ticker` per sync RAF
3. ScrollTrigger usa Lenis come scroller proxy
4. `ScrollTrigger.refresh()` dopo mount per alignment corretto

### Internazionalizzazione

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| next-intl | ^4.8.x | i18n IT + EN | Libreria de facto per Next.js App Router i18n. v4.0 (marzo 2025) ha API semplificata, TypeScript strict, GDPR compliance. Routing locale-based (`/it/`, `/en/`) con middleware integrato |

**Struttura routing:** `app/[locale]/layout.tsx` con middleware che rileva locale dal path. File di messaggi JSON per locale. `NextIntlClientProvider` nel root layout per client components.

### Video

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| @vimeo/player | ^2.x (via iframe + Player SDK) | Video hero homepage | hgcapital.com usa Vimeo. Il parametro `background=1` nell'iframe attiva autoplay, loop, mute automaticamente. Player SDK JS per controllo programmatico (play on scroll, pause off viewport) |

**Pattern per video hero:**
```
src="https://player.vimeo.com/video/[VIDEO_ID]?background=1&autoplay=1&loop=1&muted=1&dnt=1"
```
Il parametro `dnt=1` disabilita cookie tracking (importante per GDPR) e migliora Lighthouse. Il fallback e' un'immagine statica per mobile (dove autoplay non funziona in Safari iOS).

**react-player: NON usare.** Aggiunge overhead inutile per un use case di background video puro. L'iframe nativo di Vimeo con `background=1` e' la soluzione corretta e identica a hgcapital.com.

### Deployment

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Vercel | - | Hosting, CDN, CI/CD | Native Next.js support. Edge Network globale. Preview URLs per ogni PR. ISR (Incremental Static Regeneration) out-of-the-box |

---

## Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@contentful/rich-text-react-renderer` | ^15.x | Rendering rich text Contentful | Sempre per body articoli, bio team, descrizioni portfolio |
| `@contentful/rich-text-types` | ^16.x | Tipi TypeScript per rich text | Con TypeScript, sempre |
| `next-seo` | ^6.x | SEO meta tags, OG, Twitter cards | Alternativa a gestione manuale dei metadata. Semplifica OpenGraph e JSON-LD |
| `sharp` | latest | Image optimization (Next.js Image) | Richiesto da Next.js per `next/image` in produzione su Vercel |

---

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Framework | Next.js 15 | Next.js 16 | Breaking changes (async APIs, Turbopack default, middleware rename). Ecosistema styled-components non ancora consolidato su v16 |
| Framework | Next.js 15 | Remix / Astro | hgcapital.com e' Next.js. Vincolo non negoziabile |
| CMS | Contentful | Sanity, Storyblok, Prismic | Contentful e' il CMS di HG Capital. Vincolo non negoziabile |
| Styling | styled-components | Tailwind CSS | hgcapital.com usa styled-components (confermato). Tailwind non replica il modello component-driven identico |
| Styling | styled-components | CSS Modules | Meno ergonomico per theming dinamico e dark palette. styled-components ThemeProvider e' ideale per design system premium |
| Animazioni | GSAP + Lenis | Framer Motion only | Framer Motion non ha ScrollTrigger equivalente per animazioni timeline-based. Loop RAF conflittuali con Lenis |
| i18n | next-intl | react-i18next / next-i18n-router | next-intl e' la scelta nativa per App Router. API piu' semplice, TypeScript built-in |
| Video | Vimeo iframe native | react-player | Overhead inutile. L'iframe nativo Vimeo con background=1 e' identico all'approccio di hgcapital.com |
| API Contentful | REST CDA | GraphQL | Complessita' non giustificata per sito statico SSG. Limiti di query size GraphQL problematici per rich text nested |

---

## Installation

```bash
# Core framework
npm install next@^15 react@^18 react-dom@^18
npm install -D typescript @types/react @types/react-dom @types/node

# Contentful CMS
npm install contentful
npm install @contentful/rich-text-react-renderer @contentful/rich-text-types

# Styling
npm install styled-components
# NON installare @types/styled-components - incluso in v6

# Animation & Scroll
npm install gsap lenis

# i18n
npm install next-intl

# SEO & Images
npm install next-seo
npm install -D sharp

# Dev tools
npm install -D eslint eslint-config-next prettier
```

**next.config.js - configurazioni critiche:**
```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true, // Abilita SSR per styled-components
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.ctfassets.net', // Contentful CDN
      },
    ],
  },
};

module.exports = nextConfig;
```

---

## Environment Variables

```bash
# Contentful (server-side only - NON usare NEXT_PUBLIC_)
CONTENTFUL_SPACE_ID=xxx
CONTENTFUL_ACCESS_TOKEN=xxx
CONTENTFUL_PREVIEW_ACCESS_TOKEN=xxx

# Public (client-side OK)
NEXT_PUBLIC_SITE_URL=https://alkemiacapital.com
```

**Regola critica:** Le API key Contentful non devono mai avere il prefisso `NEXT_PUBLIC_`. Vengono usate solo nei Server Components e nelle route handlers (server-side), mai esposte al client.

---

## Vercel Configuration

**vercel.json (opzionale ma consigliato):**
```json
{
  "regions": ["cdg1"],  // Paris, piu' vicino all'Italia
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" }
      ]
    }
  ]
}
```

**ISR (Incremental Static Regeneration):** Usare `revalidate` di 3600 secondi (1 ora) per pagine Contentful. Il contenuto editoriale non cambia abbastanza frequentemente da richiedere SSR puro.

---

## Sources

- [Next.js 15 Release Notes](https://nextjs.org/blog/next-15) — HIGH confidence
- [Next.js 16 Breaking Changes](https://nextjs.org/blog/next-16) — HIGH confidence
- [Upgrading Next.js to v16](https://nextjs.org/docs/app/guides/upgrading/version-16) — HIGH confidence
- [Contentful + Next.js App Router (official guide, 2025)](https://www.contentful.com/blog/integrate-contentful-next-js-app-router/) — HIGH confidence
- [Contentful GraphQL Pain Points](https://medium.com/@nicholasrussellconsulting/contentful-graphql-api-pain-points-with-next-js-why-i-resurrected-rest-6cfdf3537e4c) — MEDIUM confidence
- [styled-components v6.3 Next.js 15 App Router discussion](https://github.com/vercel/next.js/discussions/66820) — HIGH confidence
- [Next.js CSS-in-JS official docs](https://nextjs.org/docs/app/guides/css-in-js) — HIGH confidence
- [GSAP ScrollTrigger + Lenis pattern](https://devdreaming.com/blogs/nextjs-smooth-scrolling-with-lenis-gsap) — MEDIUM confidence
- [Lenis npm v1.3.18](https://www.npmjs.com/package/lenis) — HIGH confidence
- [next-intl v4.0 release announcement](https://next-intl.dev/blog/next-intl-4-0) — HIGH confidence
- [Vimeo background embed parameters](https://help.vimeo.com/hc/en-us/articles/12426285089681-About-embedding-background-and-Chromeless-videos) — HIGH confidence
- [Vercel environment variables docs](https://vercel.com/docs/environment-variables) — HIGH confidence

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Next.js (App Router, v15 vs v16) | HIGH | Fonte ufficiale Vercel/Next.js verificata |
| Contentful SDK e REST vs GraphQL | HIGH | Fonte ufficiale Contentful + esperienza community verificata |
| styled-components v6 + SSR | HIGH | Discussion ufficiale vercel/next.js + docs styled-components |
| GSAP + Lenis combo | MEDIUM | Multiple sources concordi ma pattern "best" in evoluzione per Next.js App Router |
| next-intl v4 | HIGH | Fonte ufficiale next-intl.dev verificata |
| Vimeo background video | HIGH | Fonte ufficiale Vimeo Help Center |
| Vercel deployment | HIGH | Fonte ufficiale Vercel docs |
