import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  :root {
    /* Color tokens */
    --color-bg:             #1A1E22;
    --color-surface:        #242A30;
    --color-border:         #2E363F;
    --color-text-primary:   #F9FAFB;
    --color-text-secondary: rgba(249, 250, 251, 0.6);
    --color-accent-teal:    #2EC4B6;
    --color-accent-gold:    #D4A843;
    --color-accent-purple:  #8B5CF6;

    /* Typography tokens */
    --font-heading: var(--font-plus-jakarta-sans), system-ui, sans-serif;
    --font-body:    var(--font-inter), system-ui, sans-serif;

    /* Spacing scale (8px base) */
    --space-1:  0.25rem;
    --space-2:  0.5rem;
    --space-3:  0.75rem;
    --space-4:  1rem;
    --space-6:  1.5rem;
    --space-8:  2rem;
    --space-12: 3rem;
    --space-16: 4rem;
    --space-24: 6rem;

    /* Layout */
    --header-height: 80px;
  }

  /* Reset */
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    background-color: var(--color-bg);
    color: var(--color-text-primary);
    font-family: var(--font-body);
    line-height: 1.6;
    min-height: 100vh;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-heading);
    line-height: 1.2;
    font-weight: 700;
  }

  p, li {
    text-align: justify;
  }

  main {
    padding-top: var(--header-height);
  }

  /* Hide default cursor on desktop when custom cursor is active */
  @media (hover: hover) and (pointer: fine) {
    body { cursor: none; }
    a, button, input, textarea, select, [data-cursor-hover], [role="button"] { cursor: none; }
  }
`

export default GlobalStyle
