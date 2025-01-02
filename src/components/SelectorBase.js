/**
 * Base component SelectorBase
 * 
 * @typedef {Object} SelectorBase
 */

export default class SelectorBase {
	
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
}