/// Imports

import SelectorBase from './SelectorBase.js';
import {pick, range} from './utils/Range.js';
import { Size, Diversity } from '../Enums.js';
import permute from './utils/Permutator.js';

/// Privates

const
	diversityNumbers = {
		[Diversity.Simple] : 3,
		[Diversity.Random] : 6,
		[Diversity.Insane] : 20
	},
	sizeNumbers = {
		[Size.Small]: 3,
		[Size.Medium]: 6,
		[Size.Large]: 12,
		[Size.Insane]: 0
	}

/// Class

export default class Quantifier extends SelectorBase {
	
	/**
	 * Instanciates a Quantifier selector
	 * @param {Number} min the minimum occurance
	 * @param {Number} max the maximum occurance
	 */
	constructor(min, max){
		super();

		/** @type {Number} */
		this._min = parseInt(min, 10);

		/** @type {Number} */
		this._max = parseInt(max, 10);

		/** @type {Array<SelectorBase>} */
		this._component = null;
	}

	/// Properties

	/**
	 * @inheritdoc
	 */
	get Components(){
		return [_components];
	}

	/// Methods

	/**
	 * @inheritdoc
	 * adds a component to the group
	 * @param {SelectorBase} component the new component
	 */
	AddComponent(component){
		this._component = component;
	}

	/**
	 * GetSelection
	 * @param size {Symbol} the size
	 * @param diversity {Symbol} the diversity
	 * @returns {Array<String>} The array
	 */
	GetSelection(size, diversity){
		const
			pickNumber = diversityNumbers[diversity];
		let
			sizeNumber = sizeNumbers[size];
		
		if(size === Size.Insane){
			sizeNumber = this._max;
		}

		const
			numberOfResults = pick(range(this._min, (Math.min(sizeNumber, this._max - this._min) + 1)),
									pickNumber),
			results = numberOfResults
						.map(i => range(1, i)
									.map(_ => this._component.GetSelection(size, diversity)
									)),
			resultSets = results.flatMap(r => permute(r, size));
		return resultSets;
	}

	/**
	 * Makes the selector lazy
	 */
	MakeLazy() {
		this._max = Math.min(this._min + 1, this._max);
	}
}