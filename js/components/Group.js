/// Imports

import SelectorBase from './SelectorBase.js';
import permute from './Permutator.js';

/// Private methods


/// Class

export default class Group extends SelectorBase {
	
	constructor(){
		super();
		/** @type {Array<SelectorBase>} */
		this._components = [];
	}

	/// Properties

	get Components(){
		return this._components;
	}

	/// Methods

	/**
	 * adds a component to the group
	 * @param {SelectorBase} component the new component
	 */
	AddComponent(component){
		this._components.push(component);
	}

	/**
	 * GetSelection
	 * @param size {Symbol} the size
	 * @param diversity {Symbol} the diversity
	 * @returns {Array<String>} The array
	 */
	GetSelection(size, diversity){
		const
			selection = this._components.map(c => c.GetSelection(size, diversity)),
			result = permute(selection);
		return result;
	}
}