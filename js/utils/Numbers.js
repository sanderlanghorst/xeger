
/**
 * rounds the number
 * @param {Number} number a number
 */
export function Floor(number) {
    return number << 0;
}
export function Round(number) {
    return (number > 0 ? number + 0.5 : number - 0.5) << 0;
}