/// Imports

import SelectorBase from './SelectorBase.js';

/// Class

export default class Character extends SelectorBase {

	/**
	 * Creates a new instance of Character with a character
	 * @param {String} character the character
	 */
	constructor(character){
		super();
		/** @type {String} */
		this._character = character;
	}

	/// Properties
	get Character(){
		return this._character;
	}


	/// Methods

	/**
	 * GetSelection
	 * @param size {Symbol} the size
	 * @param diversity {Symbol} the diversity
	 * @returns {Array<String>} The array
	 */
	GetSelection(size, diversity){
		return [this._character];
	}
}