/** @type {import('tailwindcss').Config} */
function withOpacityValue(variable) {
  return `var(${variable})`;
}
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        'primary-color': '#8B60F7',
        'primary-color-hover': '#A280F9',
        'primary-color-active': '#8256F2',
        'dark-caption': '#796F94',
        'dark-bgc-disable': '#211A34',
        'dark-border-default': '#231F30',
        'dark-bgc': '#0E0C15',
        'dark-bgc-hover': '#181327',
        'primary-bg': '#33245866',
        'primary-border': '#211938',
        'primary-border-hover': '#A280F9',
        'dark-border-shadow': '#252132',
        'dark-clickable': '#7B7782',
        'dark-hover-list': '#181327',
        'primary-border-active': '#8256F2',
        'card-bg': '#100D1B',
        'countdown-text': '#09001B',
        'view-more-border': '#FFFFFF1A',
        'dark-modal-bg': '#191624',
        'countdown-bg': '#0000007A',
        'error-border': '#BE283A',
        'nav-search-bg': '#18161E',
        'error-color': '#BE283A',
        'dark-link': '#1B76E2',
        'dark-loading-bg': 'rgba(0, 0, 0, 0.64)',
        'img-upload-bg': 'rgba(0, 0, 0, 0.8)',
      },
      backgroundImage: {
        card: "url('/symbolmarket/images/card.png')",
        query: "url('/symbolmarket/images/query.png')",
        'query-hover': "url('/symbolmarket/images/query-hover.png')",
        'query-active': "url('/symbolmarket/images/query-active.png')",
        'query-disabled': "url('/symbolmarket/images/query-disabled.png')",
        homepage: "url('/symbolmarket/images/bg-top-2x.png')",
        'search-pc': "url('/symbolmarket/images/search-pc.png')",
        'search-mobile': "url('/symbolmarket/images/search-mobile.png')",
        'search-pc-warning': "url('/symbolmarket/images/search-pc-warning.png')",
        'search-mobile-warning': "url('/symbolmarket/images/search-mobile-warning.png')",
        'card-default': "url('/symbolmarket/images/card-default.png')",
        'card-hover': "url('/symbolmarket/images/card-hover.png')",
        'card-active': "url('/symbolmarket/images/card-active.png')",
      },
      boxShadow: {
        dropMenu: '0px 6px 16px 0px rgba(0, 0, 0, 0.16)',
        inset: '0px -1px 0px 0px #252132 inset',
        'line-bot': '0px 1px 0px 0px #252132 inset',
        'tab-active': '0px -2px 0px 0px #8B60F7 inset',
      },
      fontSize: {
        min: [
          '0.75rem',
          {
            lineHeight: '18px',
            fontWeight: '400',
          },
        ],
      },
      screens: {
        pc: '1440px',
        min: '375px',
        pcMin: '500px',
        xs: '390px',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
