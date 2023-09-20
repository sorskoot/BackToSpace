/**
 * Utility class for random
 */
export class RNG {
    /**
     * Gets a random item from an array
     * @param array the array to get an item from
     * @returns the random item; null if the array is empty
     */
    static getItem<T>(array: T[]): T | null {
        if (!array.length) {
            return null;
        }
        return array[Math.floor(Math.random() * array.length)];
    }
}
