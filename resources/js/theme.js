/**
 * SkillHub Color Theme Reference
 * ===============================
 * All colors are defined in: resources/css/app.css (@theme block)
 * Change colors THERE — this file is only a reference for developers.
 *
 * Base color: #F6EEDE / rgb(246, 238, 222)
 *
 * USAGE IN JSX:
 *   Backgrounds:  bg-cream-100, bg-cream-50, bg-cream-200
 *   Brand/CTAs:   bg-brand-600, text-brand-600, hover:bg-brand-700
 *   Accent:       bg-accent-500, text-accent-600
 *   Success:      bg-success-500, text-success-600, bg-success-50
 *   Danger:       bg-danger-600, text-danger-600, bg-danger-50
 *   Sidebar:      bg-sidebar, bg-sidebar-light, hover:bg-sidebar-hover
 */

const colors = {
    /* Cream — Page backgrounds & warm surfaces */
    cream: {
        50:  '#FDFBF7', // Lightest — cards, elevated surfaces on cream
        100: '#F6EEDE', // BASE — page backgrounds, main bg
        200: '#EFE5D0', // Borders, dividers on cream
        300: '#E5D7BC', // Hover states on cream
        400: '#D4C19E', // Muted icons on cream
        500: '#BFA87A', // Strong muted elements
    },

    /* Brand — Primary actions, links, navigation */
    brand: {
        50:  '#EEF2FF', // Light bg — selected items, focus rings
        100: '#E0E7FF', // Light bg — hover states
        200: '#C7D2FE', // Borders — active indicators
        300: '#A5B4FC', // Icons — light mode
        400: '#818CF8', // Icons — medium emphasis
        500: '#6366F1', // Default — links, icons
        600: '#4F46E5', // PRIMARY — buttons, active states
        700: '#4338CA', // Hover — button hover
        800: '#3730A3', // Dark — gradient end
        900: '#312E81', // Darkest — hero gradient end
    },

    /* Accent — Secondary highlights, badges, tags */
    accent: {
        50:  '#FFFBEB', // Light bg
        100: '#FEF3C7', // Badge bg
        200: '#FDE68A', // Light border
        300: '#FCD34D', // Icon
        400: '#FBBF24', // Medium emphasis
        500: '#F59E0B', // Default
        600: '#D97706', // Hover
    },

    /* Success — Positive states, confirmations, active badges */
    success: {
        50:  '#ECFDF5', // Light bg — success messages
        100: '#D1FAE5', // Badge bg
        200: '#A7F3D0', // Light border
        500: '#10B981', // Default — icons, dots
        600: '#059669', // Buttons, strong emphasis
        700: '#047857', // Hover
    },

    /* Danger — Errors, deletions, destructive actions */
    danger: {
        50:  '#FFF1F2', // Light bg — error messages
        100: '#FFE4E6', // Badge bg
        500: '#F43F5E', // Default — icons
        600: '#E11D48', // Buttons — delete, remove
        700: '#BE123C', // Hover
    },

    /* Sidebar — Dark navigation panel */
    sidebar: {
        bg:    '#1E293B', // Sidebar background
        light: '#334155', // User card bg, hover
        hover: '#475569', // Hover on items
    },
};

/**
 * Common class patterns for quick reference:
 */
const patterns = {
    pageBackground:     'bg-cream-100',
    cardBackground:    'bg-cream-50',
    cardBorder:        'border-cream-200',
    primaryButton:     'bg-brand-600 hover:bg-brand-700 text-white',
    primaryLink:       'text-brand-600 hover:text-brand-700',
    primaryGradient:   'from-brand-600 to-brand-800',
    heroGradient:      'from-brand-600 via-brand-700 to-brand-900',
    sidebar:           'bg-sidebar',
    sidebarActive:     'bg-brand-600 text-white',
    sidebarHover:      'hover:bg-sidebar-light hover:text-white text-slate-300',
    successBadge:      'bg-success-100 text-success-700',
    dangerBadge:       'bg-danger-100 text-danger-700',
    accentBadge:       'bg-accent-100 text-accent-600',
    inputFocus:        'focus:ring-brand-100 focus:border-brand-500',
    inputFocusRing:    'focus:ring-4 focus:ring-brand-100 focus:border-brand-500',
};

export { colors, patterns };
export default colors;
