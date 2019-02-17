/// Imports

import SelectorBase from './SelectorBase.js';
import { Size, Diversity } from '../Enums.js';
import {pick, range} from './utils/Range.js';

/// Private methods

/**
 * Gets the sets
 * @param {Symbol} size the size
 * @param {Symbol} diversity 
 */
function getSets(size, diversity){
	let 
		result = [];
	
	switch(diversity){
		case Diversity.Simple:
			range('A'.charCodeAt(0), 'Z'.charCodeAt(0)).forEach(i => result.push(String.fromCharCode(i)));
			break;

		case Diversity.Random:
			range('0'.charCodeAt(0), 'z'.charCodeAt(0)).forEach(i => result.push(String.fromCharCode(i)));
			break;
		
		case Diversity.Insane:
			range(0, 255).forEach(c => result.push(String.fromCharCode(c)));
			break;
	}
	switch(size){
		case Size.Small:
			//max 3
			return pick(result, 3);
		case Size.Medium:
			//max 6
			return pick(result, 6);
		case Size.Large:
			//max 12
			return pick(result, 12);
		case Size.Insane:
			return result;
	}
}

/// Class

export default class Dot extends SelectorBase {

	/**
	 * Creates a new instance of Character with a character
	 * @param {String} character the character
	 */
	constructor(){
		super();
	}

	/// Properties
	
	/**@inheritdoc */
	get Components(){
		return [];
	}

	/// Methods

	/**
	 * GetSelection
	 * @param {Symbol} size  the size
	 * @param {Symbol} diversity the diversity
	 * @returns {Array<String>} The array
	 */
	GetSelection(size, diversity){
		return getSets(size, diversity);
	}
}