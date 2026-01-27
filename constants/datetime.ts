// Zora African Market Design Tokens - Date & Time Constants

/**
 * Time Calculations
 * Constants for time-related calculations
 */
export const TimeConstants = {
    // Milliseconds conversions
    milliseconds: {
        perSecond: 1000,
        perMinute: 1000 * 60,
        perHour: 1000 * 60 * 60,
        perDay: 1000 * 60 * 60 * 24,
        perWeek: 1000 * 60 * 60 * 24 * 7,
        perMonth: 1000 * 60 * 60 * 24 * 30, // Approximate
        perYear: 1000 * 60 * 60 * 24 * 365, // Approximate
    },

    // Days
    days: {
        perWeek: 7,
        perMonth: 30,  // Approximate
        perYear: 365,  // Approximate
    },

    // Common periods
    periods: {
        veryNew: 30,   // 30 days - very new items
        recent: 90,    // 90 days - recent items
        quarter: 90,   // 90 days - quarter
        halfYear: 180, // 180 days - half year
        year: 365,     // 365 days - year
    },
} as const;

/**
 * Date Format Patterns
 * Format strings for displaying dates
 */
export const DateFormats = {
    // Display formats
    display: {
        short: 'MMM d, yyyy',        // Oct 24, 2023
        medium: 'MMMM d, yyyy',      // October 24, 2023
        long: 'EEEE, MMMM d, yyyy', // Tuesday, October 24, 2023
        dateOnly: 'MMM d',          // Oct 24
        monthYear: 'MMMM yyyy',     // October 2023
    },

    // Time formats
    time: {
        short: 'h:mm a',      // 10:30 AM
        medium: 'h:mm:ss a', // 10:30:45 AM
        military: 'HH:mm',    // 14:30
    },

    // Combined date and time
    dateTime: {
        short: 'MMM d, yyyy h:mm a',     // Oct 24, 2023 10:30 AM
        medium: 'MMMM d, yyyy h:mm a',   // October 24, 2023 10:30 AM
        long: 'EEEE, MMMM d, yyyy h:mm a', // Tuesday, October 24, 2023 10:30 AM
    },

    // Relative time
    relative: {
        today: 'Today',
        yesterday: 'Yesterday',
        tomorrow: 'Tomorrow',
        thisWeek: 'This week',
        lastWeek: 'Last week',
        thisMonth: 'This month',
        lastMonth: 'Last month',
    },
} as const;

/**
 * Month Names
 * Full and abbreviated month names
 */
export const MonthNames = {
    full: [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December',
    ],
    short: [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ],
} as const;

/**
 * Day Names
 * Full and abbreviated day names
 */
export const DayNames = {
    full: [
        'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
    ],
    short: [
        'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat',
    ],
} as const;

/**
 * Relative Time Thresholds
 * Thresholds for displaying relative time (e.g., "2 hours ago")
 */
export const RelativeTimeThresholds = {
    justNow: 60 * 1000,        // 1 minute - "just now"
    minutes: 60 * 60 * 1000,  // 1 hour - "X minutes ago"
    hours: 24 * 60 * 60 * 1000, // 24 hours - "X hours ago"
    days: 7 * 24 * 60 * 60 * 1000, // 7 days - "X days ago"
    weeks: 30 * 24 * 60 * 60 * 1000, // 30 days - "X weeks ago"
    months: 365 * 24 * 60 * 60 * 1000, // 365 days - "X months ago"
} as const;

export default {
    time: TimeConstants,
    formats: DateFormats,
    months: MonthNames,
    days: DayNames,
    relative: RelativeTimeThresholds,
};
