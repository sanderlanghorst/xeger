/// Imports

import { Size } from './Enums.js';

const totalSize = {
	[Size.Small]: 6,
	[Size.Medium]: 10,
	[Size.Large]: 20,
	[Size.Insane]: 100
};

/// Exports

/**
 * calculates all permutations of the collection
 * @param {Array<Array<String>>} list the list of lists
 * @param {Symbol} size the size of the result
 * @returns {Array<String>}
 */
export function permute(list, size) {
	const workingList = list
		.map(l => l.filter(i => i !== undefined || i !== ''))
		.filter(l => l.length > 0);
	if (!workingList.length) {
		return [];
	}
	if (workingList.length === 1) {
		return workingList.reduce((a, s) => `${a}${s}`);
	}

	let maxSize = workingList.reduce((a, s) => a * s.length, 1),
		skipSize = maxSize;

	const max = totalSize[size],
		sizeDiff = maxSize / Math.min(maxSize, max),
		output = [];

	skipSize = maxSize = Math.min(maxSize, max);

	for (let s = 0; s < workingList.length; s++) {
		skipSize = (skipSize * sizeDiff) / workingList[s].length / sizeDiff;

		for (let i = 0; i < maxSize; i++) {
			var p =
				Math.floor(i / skipSize) +
				Math.floor((Math.random() * 1.0) / skipSize);

			if (output[i] === undefined) output[i] = '';
			output[i] = output[i] + workingList[s][p % workingList[s].length];
		}
	}

	return output;
}
