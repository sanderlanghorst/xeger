/**
 * pick a number of pseudo random following items from the list
 * @param {Array<T>} list a list
 * @param {Number} number Number of items to pick from list
 * @returns {Array<T>} A randomly picked list (or the complete list if the list was shorter then the number)
 * @template T
 */
export function pick(list, number) {
	if (number >= list.length) return list;
	let result = [];
	if (number > 2) {
		result.push(list[0]);
		result.push(list[list.length - 1]);
	}
	while (result.length < number) {
		let rand = Math.floor(Math.random() * list.length);
		if (!result.some(r => r === list[rand])) {
			result.push(list[rand]);
		}
	}
	return result;
}

/**
 * Creates an array with integers from start with a number of numbers
 * @param {Number} start the first number
 * @param {Number} number the number of elements
 * @returns {Array<Number>} a list of numbers
 */
export function range(start, number) {
	return Array(number)
		.fill(0)
		.map((_, idx) => start + idx);
}

/**
 * creates a range of charcters
 * @param {string} start the starting character
 * @param {string} end the ending character
 * @returns {Array<Number>} a list of charcodes
 */
export function rangeChars(start, end) {
	return ((f, t) => range(f, t - f + 1))(
		start.charCodeAt(0),
		end.charCodeAt(0)
	);
}
