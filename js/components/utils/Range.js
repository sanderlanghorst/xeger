
/**
 * pick a number of pseudo random following items from the list
 * @param {Array<any>} list a list
 * @param {Number} number Number of items to pick from list
 * @returns {Array<any>} A randomly picked list (or the complete list if the list was shorter then the number)
 */
function pick(list, number){
	if(number >= list.length)
		return list;
	let 
		c = 0,
		s = list.length / number,
		result = [];
	for(let i =0; i < number; i++){
		c += Math.floor(Math.random() * s);
		result.push(list[c]);
	}
	return result;
}

/**
 * Creates an array with integers from start with a number of numbers
 * @param {Number} start the first number
 * @param {Number} number the last number
 */
function range(start, number) {
	return Array(number).fill().map((_, idx) => start + idx)
}

export {
	pick,
	range
};

