import { SelectorBase } from '/src/model/SelectorBase.js';
import { Group } from '/src/model/Group.js';
import { CharacterSet } from '/src/model/CharacterSet.js';
import { Or } from '/src/model/Or.js';
import { Quantifier } from '/src/model/Quantifier.js';

import { GeneratorBase } from './generators/GeneratorBase.js';
import { GroupGenerator } from './generators/GroupGenerator.js';
import { CharacterSetGenerator } from './generators/CharacterSetGenerator.js';
import { OrGenerator } from './generators/OrGenerator.js';
import { QuantifierGenerator } from './generators/QuantifierGenerator.js';

export class GeneratorConfig {
	/**
	 * Constructs a generator configuration
	 * @param {Map<string,GeneratorBase>} map the generators, mapped to model name
	 */
	constructor(map) {
		this._map = map;
	}

	/**
	 * Gets the generator by selector
	 * @param {SelectorBase} selector the selector
	 * @returns {GeneratorBase}
	 */
	Get(selector) {
		return this._map.get(selector.constructor.name);
	}

	/**
	 * The default set of generators
	 * @returns {GeneratorConfig}
	 */
	static get Default() {
		return new GeneratorConfig(
			new Map([
				[Group.name, new GroupGenerator()],
				[CharacterSet.name, new CharacterSetGenerator()],
				[Or.name, new OrGenerator()],
				[Quantifier.name, new QuantifierGenerator()]
			])
		);
	}
}
