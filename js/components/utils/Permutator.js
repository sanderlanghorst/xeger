/// Imports

import { Size } from '../../Enums.js';
import { pick } from './Range.js';


const sizes = {
	addPick: {
		[Size.Small]: 0,
		[Size.Medium]: 1,
		[Size.Large]: 2,
		[Size.Insane]: 4
	},
	totalSize: {
		[Size.Small]: 3,
		[Size.Medium]: 6,
		[Size.Large]: 12,
		[Size.Insane]: 100
	}
}

/// Privat Methods


/**
 * 
 * @param {String} pre the preceding string
 * @param {Array<Array<String>>} list the list of permutables
 * @param {Symbol} size the size of the result
 * @returns {Array<String>}
 */
function innerPermute(pre, list){
	/**@type {Array<Array<String>>} */
	const result = [];

	if(list.length == 0)
		return [pre];

	const
		perlist = list[0];
	if(perlist.length == 0)
		perlist.push('');
	perlist.forEach((value) => {
		result.push(innerPermute(pre + value, list.slice(1, list.length)));
	});

	return result.flatMap(d => d);
}

/// Exports

/**
 * calculates all permutations of the collection
 * @param {Array<Array<String>>} list the list of lists
 * @param {Symbol} size the size of the result
 * @returns {Array<String>}
 */
export default function permute(list, size) {
	if(list.length <= 1)
		return innerPermute('', list);

	const 
		innerList = [],
		totalDimention = list.reduce((sum, value) => sum + value.length, 0),
		entropy = Math.ceil(totalDimention / list.length / list.length);

	for (let i = 0; i < list.length; i++) {
		innerList.push(pick(list[i], entropy + sizes.addPick[size]));
	}

	return pick(innerPermute('', innerList), sizes.totalSize[size]);
}