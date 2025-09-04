/**
 * Get value from localStorage with fallback
 * @param key - Storage key
 * @param fallback - Default value if key doesn't exist
 * @returns Parsed value or fallback
 */
export function getLocal<T>(key: string, fallback: T): T {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : fallback;
    } catch (error) {
        console.warn(`Failed to get localStorage item "${key}":`, error);
        return fallback;
    }
}

/**
 * Set value in localStorage
 * @param key - Storage key
 * @param value - Value to store
 */
export function setLocal<T>(key: string, value: T): void {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.warn(`Failed to set localStorage item "${key}":`, error);
    }
}
