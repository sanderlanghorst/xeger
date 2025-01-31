/**
 * Base component SelectorBase
 * 
 * @typedef {Object} SelectorBase
 */

import {GenerationContext} from "./GenerationContext.js";

export class SelectorBase {
	
	/// Properties

	/**
	 * Gets the components of the element
	 * @returns {Array<SelectorBase>}
	 */
	get Components(){
		throw "Cannot call abstract method";
	}

	/// Methods

	/**
	 * adds a component to the group
	 * @param {SelectorBase} component the new component
	 */
	AddComponent(component){
		throw "Cannot call abstract method";
	}

	/**
	 * GetSelection
	 * @param size {Symbol} the size
	 * @param diversity {Symbol} the diversity
	 * @returns {Array<String>} The array
	 */
	GetSelection(size, diversity){
		throw "Cannot call abstract method";
	}

	/**
	 * generates the next output
	 * @param {GenerationContext} context the context
	 */
	Generate(context){
		throw "Cannot call abstract method";
	}
}