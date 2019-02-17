
/**
 * 
 * @param {String} pre the preceding string
 * @param {Array<Array<String>>} list the list of permutables
 * @returns {Array<String>}
 */
function innerPermute(pre, list){
	/**@type {Array<Array<String>>} */
	const result = [];

	if(list.length == 0)
		return [pre];

	const perlist = list[0];
	if(perlist.length == 0)
		perlist.push('');
	perlist.forEach((value) => {
		result.push(innerPermute(pre + value, list.slice(1, list.length)));
	});

	return result.flatMap(d => d);
}

/**
 * calculates all permutations of the collection
 * @param {Array<Array<String>>} list the list of lists
 * @returns {Array<String>}
 */
export default function permute(list){
	return innerPermute('', list);
}