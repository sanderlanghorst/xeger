import { SelectorBase } from '/src/model/SelectorBase.js';
import { GeneratorConfig } from './GeneratorConfig.js';

/**
 * Generates
 * @param {Array<SelectorBase>} selectors
 * @param {Symbol} size the size
 * @param {Symbol} diversity the diversity
 * @returns {IterableIterator<string>} the result
 */
function* InternalGenerate(selectors, size, diversity) {
	//TODO:black magic
}

export class Generator {
	/**
	 * creates a generator instance based on the model
	 * @param {SelectorBase} model the parsed model
	 * @param {GeneratorConfig} config the generator configuration
	 */
	constructor(model, config) {
		this._model = model;
		this._config = config;
	}

	/**
	 * Generates output for the given model
	 * @return {Array<String>}
	 */
	Generate(size, diversity) {
		return Array.from(InternalGenerate([this._model], size, diversity));
	}
}
