/// Imports

import SelectorBase from './SelectorBase.js';
import {pick, range} from './utils/Range.js';
import { Size, Diversity } from '../Enums.js';

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
		let
			pickNumber = diversityNumbers[diversity],
			sizeNumber = sizeNumbers[size];
		
		if(size === Size.Insane){
			sizeNumber = this._max;
		}

		let
			numberOfResults = pick(range(this._min, (Math.min(sizeNumber, this._max)+1) - this._min),
									pickNumber),
			resultSets = numberOfResults		
						.map(i => range(1, i)
									.flatMap(_ => pick(this._component.GetSelection(size, diversity), 1)
									)
									.join(''));
		return resultSets;
	}
}