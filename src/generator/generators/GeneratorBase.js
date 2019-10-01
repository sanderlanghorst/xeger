///Imports

import { SelectorBase } from '/src/model/SelectorBase.js';

/**
 * Base component generator GeneratorBase
 */
export class GeneratorBase {
	/**
	 * the base definition for a generator
	 * @param {SelectorBase} selector the selector
	 * @param {Symbol} size the size
	 * @param {Symbol} diversity the diversity
	 * @return {Array<string>}
	 */
	Generate(selector, size, diversity) {
		throw 'Cannot call abstract method';
	}
}
