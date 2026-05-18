export const APP_NAME = 'TimeKeeper';
export const APP_ADMIN_NAME = `${APP_NAME} Admin`;
export const APP_ORGANIZATION = 'BSIT 1B';
export const APP_SYSTEM_NAME = `${APP_NAME} System`;
export const APP_RECIPIENT_LABEL = `To: ${APP_NAME}`;

export const palette = {
  mauve: '#C38EB4',
  lightPink: '#E1C8D7',
  lightBlue: '#86A8CF',
  darkBlueGrey: '#26425A',
  darkPage: '#0D1B2E',
  darkCard: '#162A5C',
  darkTab: '#1F3A5F',
  disabled: '#5A7BA8',
  darkBubble: '#0F2050',
  approved: '#16a34a',
  rejected: '#dc2626',
  // New design colors
  deepNavy: '#0D1B2E',
  navyMid: '#1A2B45',
  pinkLight: '#E8C5D8',
  pinkMid: '#D4A0C0',
  purple: '#8B3070',
};

export const appTheme = {
  light: {
    // Layout backgrounds
    pageBackground: '#F0D4E8',
    leftPanel: '#F8EBF4',
    rightPanel: '#E8C5D8',

    // Nav
    navBackground: 'transparent',
    navBorder: 'rgba(38,66,90,0.1)',
    navText: '#5C2A4A',

    // Brand title
    brandTitle: '#5C2A4A',
    brandStroke: 'rgba(92,42,74,0.4)',
    brandAccentTitle: '#E8526A',

    // Icons
    iconColor: '#5C2A4A',
    dividerLine: 'rgba(92,42,74,0.3)',

    // Cards / surfaces
    cardBackground: 'rgba(255,255,255,0.6)',
    surfaceBackground: 'rgba(255,255,255,0.55)',
    tabStripBackground: 'rgba(255,255,255,0.35)',
    bubbleBackground: 'rgba(255,255,255,0.4)',

    // Text
    text: palette.darkBlueGrey,
    mutedText: 'rgba(38,66,90,0.76)',
    faintText: 'rgba(38,66,90,0.5)',
    border: 'rgba(38,66,90,0.12)',

    // Accents
    brandAccent: palette.mauve,
    actionAccent: '#86A8CF',
    pendingAccent: palette.mauve,
    disabledAction: 'rgba(38,66,90,0.24)',
    cardShadow: '0 20px 60px rgba(38,66,90,0.16)',

    // Sidebar icons
    sideIconBg: 'rgba(92,42,74,0.12)',
    sideIconColor: '#5C2A4A',
    sideIconBorder: 'rgba(92,42,74,0.25)',
    sideMenuText: '#5C2A4A',

    // Slide dots
    dotActive: '#5C2A4A',
    dotInactive: 'rgba(92,42,74,0.3)',
    dotBorder: '#5C2A4A',

    // Developer note card
    noteTitle: '#5C2A4A',
    noteText: 'rgba(38,66,90,0.85)',
    noteAccent: '#E8526A',
  },
  dark: {
    // Layout backgrounds
    pageBackground: '#0D1B2E',
    leftPanel: '#0D1B2E',
    rightPanel: '#111F35',

    // Nav
    navBackground: 'transparent',
    navBorder: 'rgba(134,168,207,0.15)',
    navText: 'rgba(255,255,255,0.9)',

    // Brand title
    brandTitle: '#C8D8F0',
    brandStroke: 'rgba(200,216,240,0.25)',
    brandAccentTitle: '#86A8CF',

    // Icons
    iconColor: 'rgba(255,255,255,0.85)',
    dividerLine: 'rgba(255,255,255,0.12)',

    // Cards / surfaces
    cardBackground: palette.darkCard,
    surfaceBackground: palette.darkCard,
    tabStripBackground: palette.darkTab,
    bubbleBackground: palette.darkBubble,

    // Text
    text: '#F8FAFC',
    mutedText: 'rgba(255,255,255,0.76)',
    faintText: 'rgba(255,255,255,0.42)',
    border: 'rgba(134,168,207,0.18)',

    // Accents
    brandAccent: palette.lightBlue,
    actionAccent: palette.mauve,
    pendingAccent: palette.lightBlue,
    disabledAction: palette.disabled,
    cardShadow: '0 24px 60px rgba(0,0,0,0.45)',

    // Sidebar icons
    sideIconBg: 'rgba(134,168,207,0.14)',
    sideIconColor: 'rgba(255,255,255,0.85)',
    sideIconBorder: 'rgba(134,168,207,0.25)',
    sideMenuText: 'rgba(255,255,255,0.88)',

    // Slide dots
    dotActive: '#86A8CF',
    dotInactive: 'rgba(134,168,207,0.3)',
    dotBorder: '#86A8CF',

    // Developer note card
    noteTitle: '#C8D8F0',
    noteText: 'rgba(255,255,255,0.8)',
    noteAccent: '#86A8CF',
  },
} as const;
