/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,ts}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#CC2504',
          dark: '#A31D03',
          light: '#E83A1A',
        },
        club: {
          dark: '#272420',
          mid: '#4D463D',
          beige: '#E3DFD8',
          light: '#F5F2EE',
        },
        // Verd de marca per a la modalitat "caminada" (abans bg-green-700 solt)
        forest: {
          DEFAULT: '#2F6B3C',
          dark: '#245430',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      // Escala d'elevació semàntica (en lloc de shadow-sm/md/lg ad-hoc)
      boxShadow: {
        card: '0 1px 2px rgba(39, 36, 32, 0.04), 0 2px 8px rgba(39, 36, 32, 0.06)',
        'card-hover': '0 4px 12px rgba(39, 36, 32, 0.08), 0 12px 28px rgba(39, 36, 32, 0.12)',
        overlay: '0 12px 40px rgba(39, 36, 32, 0.22)',
      },
      // Radis coherents: card per a targetes, pill per a etiquetes
      borderRadius: {
        card: '1rem',
        pill: '9999px',
      },
      transitionTimingFunction: {
        'out-soft': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};
