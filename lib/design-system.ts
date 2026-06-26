// NavECC Design System — single source of truth for all visual tokens

// ── BRAND COLORS ──────────────────────────────────────────────────────────────
export const colors = {
  navy:    '#005EB8',
  teal:    '#028090',
  coral:   '#005EB8',
  amber:   '#028090',
  green:   '#028090',
  purple:  '#005EB8',
  blue:    '#005EB8',
  surface: '#F4F7FA',
  white:   '#FFFFFF',
  muted:   '#000000',
  border:  '#F0F4F5',
};

// ── ROOT CAUSE COLORS ─────────────────────────────────────────────────────────
export const rootCauseColors: Record<string, string> = {
  'Courier / Traffic':   '#005EB8',
  'Cold Chain':          '#005EB8',
  'Hospital Receiving':  '#028090',
  'Homecare Scheduling': '#028090',
};

// ── SEVERITY / URGENCY BADGE STYLES ──────────────────────────────────────────
export const severityStyles: Record<string, { bg: string; text: string; border: string; hex: string }> = {
  CRITICAL: { bg: '#FDECEA', text: '#005EB8', border: '#f5c4b3', hex: '#005EB8' },
  HIGH:     { bg: '#FFF3E0', text: '#028090', border: '#FAC775', hex: '#028090' },
  MEDIUM:   { bg: '#E6F1FB', text: '#000000', border: '#000000', hex: '#005EB8' },
  LOW:      { bg: '#EAF3DE', text: '#000000', border: '#C0DD97', hex: '#028090' },
};

// ── STATUS BADGE STYLES ───────────────────────────────────────────────────────
export const statusStyles: Record<string, { bg: string; text: string; border: string }> = {
  'OPEN':        { bg: '#FFF8E1', text: '#000000', border: '#FAC775' },
  'IN REVIEW':   { bg: '#E6F1FB', text: '#000000', border: '#000000' },
  'RESOLVED':    { bg: '#EAF3DE', text: '#000000', border: '#C0DD97' },
};

// ── DATA SOURCE PILL STYLES ───────────────────────────────────────────────────
export const dataSourceStyles: Record<string, { bg: string; text: string }> = {
  COURIER: { bg: 'transparent', text: '#000000' },
  APPT:    { bg: 'transparent', text: '#000000' },
  NURSE:   { bg: 'transparent', text: '#000000' },
};

// ── AGENT COLORS ──────────────────────────────────────────────────────────────
export const agentColors: Record<string, string> = {
  'cpxo':          '#005EB8',
  'delivery-ops':  '#028090',
  'clinical-risk': '#005EB8',
  'compliance':    '#028090',
  'engagement':    '#005EB8',
};

// ── RECHARTS SHARED CONFIG ────────────────────────────────────────────────────
export const chartDefaults = {
  fontFamily:   'Inter, system-ui, sans-serif',
  fontSize:     12,
  color:        '#000000',
  tickColor:    '#000000',
  gridColor:    '#F0F4F5',
  tooltipStyle: {
    backgroundColor: '#005EB8',
    border:          'none',
    borderRadius:    6,
    fontSize:        12,
    color:           '#FFFFFF',
  },
  tooltipLabelStyle:  { color: '#FFFFFF', fontWeight: 600 },
  tooltipItemStyle:   { color: '#F0F4F5' },
};

// ── BADGE SHARED STYLE ────────────────────────────────────────────────────────
export const badgeBase = {
  fontSize:     10,
  fontWeight:   600,
  padding:      '2px 8px',
  borderRadius: 9999,
  border:       '0.5px solid',
  display:      'inline-block' as const,
};

// ── PILL SHARED STYLE ─────────────────────────────────────────────────────────
export const pillBase = {
  fontSize:     10,
  fontWeight:   600,
  padding:      '1px 6px',
  borderRadius: 4,
  display:      'inline-block' as const,
};

// ── TYPOGRAPHY ────────────────────────────────────────────────────────────────
export const typography = {
  pageTitle:    { fontSize: 18, fontWeight: 500, color: '#005EB8' },
  pageSubtitle: { fontSize: 12, color: '#000000' },
  sectionLabel: { fontSize: 11, fontWeight: 500, textTransform: 'uppercase' as const, letterSpacing: '0.06em', color: '#000000' },
  cardLabel:    { fontSize: 11, fontWeight: 500, color: '#000000' },
  cardValue:    { fontSize: 24, fontWeight: 500, color: '#005EB8' },
  cardSub:      { fontSize: 11, color: '#000000' },
  bodyText:     { fontSize: 13, color: '#000000' },
  mutedText:    { fontSize: 12, color: '#000000' },
  incidentId:   { fontSize: 12, fontWeight: 500, color: '#028090' },
  tableHeader:  { fontSize: 11, fontWeight: 500, color: '#000000' },
  tableCell:    { fontSize: 12, color: '#000000' },
};

// ── CARD STYLES ───────────────────────────────────────────────────────────────
export const cardStyle = {
  backgroundColor: '#FFFFFF',
  border:          '1px solid #F0F4F5',
  borderRadius:    10,
  padding:         '14px 16px',
};

// ── SPACING ───────────────────────────────────────────────────────────────────
export const spacing = {
  pagePadding:    '20px 24px 20px 16px',
  sectionGap:     16,
  cardPadding:    '14px 16px',
  tableCellPad:   '8px 12px',
};
