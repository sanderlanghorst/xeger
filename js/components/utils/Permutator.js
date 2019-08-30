/// Imports

import { Size } from '../../Enums.js';
import { pick } from './Range.js';


const sizes = {
	totalSize: {
		[Size.Small]: 3,
		[Size.Medium]: 6,
		[Size.Large]: 12,
		[Size.Insane]: 100
	}
}

/// Privat Methods


/// Exports

/**
 * calculates all permutations of the collection
 * @param {Array<Array<String>>} list the list of lists
 * @param {Symbol} size the size of the result
 * @returns {Array<String>}
 */
export default function permute(list, size) {
	const workingList = list.map(l => l.filter(i => i !== undefined || i !== '')).filter(l => l.length > 0);
	if(!workingList.length){
		return [];
	}
	if(workingList.length === 1){
		return workingList.reduce((a,s) => `${a}${s}`);
	}
	
	let maxSize = workingList.reduce((a, s) => a * s.length, 1);

	const
		max = sizes.totalSize[size],
		sizeDiff = maxSize / Math.min(maxSize, max),
		outputSize = maxSize = Math.min(maxSize, max),
		output = [];

	for(let s = 0; s < workingList.length; s++){

		maxSize = Math.ceil((maxSize * sizeDiff) / workingList[s].length / sizeDiff);
		for(let i = 0; i < outputSize; i++){
			var p = Math.floor(i / maxSize) + Math.round(Math.random() * outputSize);
			if(output[i] === undefined)
				output[i] = '';
			output[i] = output[i] + workingList[s][p % workingList[s].length];
		}
	}

	return output;
}