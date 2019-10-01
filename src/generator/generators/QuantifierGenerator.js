import { GeneratorBase } from './GeneratorBase.js';
import { SelectorBase } from '/src/model/SelectorBase.js';

export class QuantifierGenerator extends GeneratorBase {
	constructor() {
		super();
	}

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
