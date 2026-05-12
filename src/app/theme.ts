export const APP_NAME = 'TimeKeeper';
export const APP_ADMIN_NAME = `${APP_NAME} Admin`;
export const APP_ORGANIZATION = 'Bicol University College of Science';
export const APP_SYSTEM_NAME = `${APP_NAME} System`;
export const APP_RECIPIENT_LABEL = `To: ${APP_NAME}`;

export const palette = {
  mauve: '#C38EB4',
  lightPink: '#E1C8D7',
  lightBlue: '#86A8CF',
  darkBlueGrey: '#26425A',
  darkPage: '#0B1929',
  darkCard: '#162A5C',
  darkTab: '#1F3A5F',
  disabled: '#5A7BA8',
  darkBubble: '#0F2050',
  approved: '#16a34a',
  rejected: '#dc2626',
};

export const appTheme = {
  light: {
    pageBackground: palette.lightPink,
    navBackground: palette.mauve,
    navBorder: 'rgba(38,66,90,0.14)',
    cardBackground: 'rgba(255,255,255,0.34)',
    surfaceBackground: 'rgba(255,255,255,0.44)',
    tabStripBackground: 'rgba(255,255,255,0.26)',
    bubbleBackground: 'rgba(255,255,255,0.32)',
    text: palette.darkBlueGrey,
    mutedText: 'rgba(38,66,90,0.76)',
    faintText: 'rgba(38,66,90,0.5)',
    border: 'rgba(38,66,90,0.12)',
    brandAccent: palette.mauve,
    actionAccent: palette.lightBlue,
    pendingAccent: palette.mauve,
    disabledAction: 'rgba(38,66,90,0.24)',
    cardShadow: '0 20px 60px rgba(38,66,90,0.16)',
  },
  dark: {
    pageBackground: palette.darkPage,
    navBackground: palette.darkBlueGrey,
    navBorder: 'rgba(134,168,207,0.22)',
    cardBackground: palette.darkCard,
    surfaceBackground: palette.darkCard,
    tabStripBackground: palette.darkTab,
    bubbleBackground: palette.darkBubble,
    text: '#F8FAFC',
    mutedText: 'rgba(255,255,255,0.76)',
    faintText: 'rgba(255,255,255,0.42)',
    border: 'rgba(134,168,207,0.18)',
    brandAccent: palette.lightBlue,
    actionAccent: palette.mauve,
    pendingAccent: palette.lightBlue,
    disabledAction: palette.disabled,
    cardShadow: '0 24px 60px rgba(0,0,0,0.4)',
  },
} as const;
