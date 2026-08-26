import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Jost:wght@300;400;500&display=swap');

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    font-family: 'Jost', sans-serif;
    background: #fafaf8;
    color: #0a0a0a;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
    line-height: 1.5;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button {
    cursor: pointer;
    border: none;
    background: none;
    font-family: inherit;
  }

  img {
    display: block;
    max-width: 100%;
  }

  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
  }

  ::-webkit-scrollbar {
    width: 4px;
  }
  ::-webkit-scrollbar-track {
    background: #f0efe9;
  }
  ::-webkit-scrollbar-thumb {
    background: #9a9890;
  }
`;

export const theme = {
  colors: {
    black: '#0a0a0a',
    white: '#fafaf8',
    off: '#f0efe9',
    border: '#e2e0d8',
    muted: '#9a9890',
    green: '#22c55e',
    whatsapp: '#25D366',
    red: '#ef4444',
    redDark: '#dc2626',
    overlay: 'rgba(10, 10, 10, 0.6)',
  },
  fonts: {
    serif: "'Cormorant Garamond', Georgia, serif",
    sans: "'Jost', sans-serif",
  },
};

export default GlobalStyles;
