import {vec3} from 'gl-matrix';

export const Easing = {
    /**
     * Linear easing function.
     * @param t A value between 0 and 1 representing the progress of the animation.
     * @returns The same value as `t`, providing a linear progression.
     */
    Linear: (t: number): number => t,

    /**
     * Quadratic ease-in function.
     * @param t A value between 0 and 1 representing the progress of the animation.
     * @returns A value representing an accelerated (quadratic) progression from 0 to 1.
     */
    InQuad: (t: number): number => t * t,

    /**
     * Quadratic ease-out function.
     * @param t A value between 0 and 1 representing the progress of the animation.
     * @returns A value representing a decelerated (quadratic) progression from 0 to 1.
     */
    OutQuad: (t: number): number => 1 - (1 - t) * (1 - t),

    /**
     * Quadratic ease-in-out function.
     * @param t A value between 0 and 1 representing the progress of the animation.
     * @returns A value that accelerates in, then decelerates out, providing a smooth transition between motion states.
     */
    InOutQuad: (t: number): number =>
        t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,

    /**
     * Cubic ease-in function.
     * @param t A value between 0 and 1 representing the progress of the animation.
     * @returns A value representing an accelerated (cubic) progression from 0 to 1.
     */
    InCubic: (t: number): number => Math.pow(t, 3),
    /**
     * Cubic ease-out function.
     * @param t A value between 0 and 1 representing the progress of the animation.
     * @returns A value representing an decelerated (cubic) progression from 0 to 1.
     */
    OutCubic: (t: number): number => Math.pow(t - 1, 3) + 1,

    /**
     * Cubic ease-in-out function.
     * @param t A value between 0 and 1 representing the progress of the animation.
     * @returns A value that accelerates in, then decelerates out, providing a smooth transition between motion states.
     */
    InOutCubic: (t: number) => {
        if (t < 0.5) {
            return Math.pow(2 * t, 3) / 2;
        } else {
            return (Math.pow(2 * t - 2, 3) + 2) / 2;
        }
    },
};

/**
 * A function that takes a time value between 0 and 1 and returns an eased value between 0 and 1.
 * @param t The time value between 0 and 1.
 * @returns The eased value between 0 and 1.
 */
type EasingFunction = (t: number) => number;

/**
 * Performs linear interpolation with optional easing function on two numeric values
 * @param start Starting numeric value
 * @param end Ending numeric value
 * @param t Progress indicator between starting and ending numeric values, typically represented as a decimal within range [0,1]
 * @param easing Optional easing function to apply. Defaults to Easing.Linear if not provided or invalid type supplied
 * @return Interpolated result based on provided inputs
 */
export function lerp(
    start: number,
    end: number,
    t: number,
    easing: EasingFunction = Easing.Linear
) {
    if (typeof easing === 'function') {
        easing = getEasingFunction(easing);
    }

    return start * (1 - easing(t)) + end * easing(t);
}

export function lerpVec3(
    out: vec3,
    start: vec3,
    end: vec3,
    t: number,
    easing: EasingFunction = Easing.Linear
) {
    if (typeof easing === 'function') {
        easing = getEasingFunction(easing);
    }
    for (let i = 0; i < 3; i++) {
        out[i] = start[i] * (1 - easing(t)) + end[i] * easing(t);
    }

    return out;
}

/**
 * Returns the easing function based on the given type.
 * If the type is a function, it is returned as is.
 * If the type is not a function, the default linear easing function is returned.
 * @param type - The type of easing function to get.
 * @returns The easing function.
 */
function getEasingFunction(type: EasingFunction): EasingFunction {
    // Default to linear interpolation
    return typeof type === 'function' ? type : Easing.Linear;
}

/**
 * Clamps input value to provided minimum & maximum range
 * @param value Numeric input for clamping operation
 * @param min Minimum allowed result after clamping )
 * @param max Maximum allowed result after clamping
 * @return Resulting output within specified constraint range [min,max]
 */
export function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
}
