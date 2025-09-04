/**
 * Format a date into a short relative time string
 * @param date - Date string, number, or Date object
 * @returns Short relative time like "5h ago", "2m ago"
 */
export function formatRelative(date: string | number | Date): string {
    const now = new Date();
    const targetDate = new Date(date);
    const diffMs = now.getTime() - targetDate.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSeconds < 60) {
        return diffSeconds <= 5 ? 'now' : `${diffSeconds}s ago`;
    } else if (diffMinutes < 60) {
        return `${diffMinutes}m ago`;
    } else if (diffHours < 24) {
        return `${diffHours}h ago`;
    } else if (diffDays < 7) {
        return `${diffDays}d ago`;
    } else {
        return targetDate.toLocaleDateString();
    }
}

/**
 * Get the full formatted date string for tooltip
 * @param date - Date string, number, or Date object
 * @returns Full formatted date for tooltip
 */
export function formatFullDate(date: string | number | Date): string {
    return new Date(date).toLocaleString();
}
