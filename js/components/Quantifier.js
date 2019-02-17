/// Imports

import SelectorBase from './SelectorBase.js';
import {pick, range} from './utils/Range.js';
import { Size, Diversity } from '../Enums.js';
import permute from './utils/Permutator.js';

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
		let
			pickNumber = 1,
			sizeNumber = 1;
		switch(diversity){
			case Diversity.Simple:
				pickNumber = 3;
				break;

			case Diversity.Random:
				pickNumber = 6;
				break;

			case Diversity.Insane:
				pickNumber = 12;
				break;
		}
		switch(size){
			case Size.Small:
				sizeNumber = 3;
				break;

			case Size.Medium:
				sizeNumber = 6;
				break;

			case Size.Large:
				sizeNumber = 12;
				break;

			case Size.Insane:
				sizeNumber = this._max;
				break;
		}


		//TODO:fix just selection
		let
			numberOfResults = pick(range(this._min, (Math.min(sizeNumber, this._max)+1) - this._min),
									pickNumber),
			resultSets = numberOfResults		
						.map(i => range(1, i)
									.map(_ => pick(this._component.GetSelection(size, diversity), 1)
									)
									.flatMap(m => m)
									.join(''));
		return resultSets;
	}
}