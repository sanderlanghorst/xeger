
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
	if(number > 2) {
		result.push(list[0]);
		result.push(list[list.length - 1]);
	}
	while(result.length < number){
		let rand = Math.floor(Math.random() * list.length);
		if(!result.some(r => r === list[rand])) {
			result.push(list[rand]);
		}
	}
	return result.sort((a,b) => a-b);
}

/**
 * Creates an array with integers from start with a number of numbers
 * @param {Number} start the first number
 * @param {Number} number the number of elements
 */
function range(start, number) {
	return Array(number).fill().map((_, idx) => start + idx)
}

export {
	pick,
	range
};

