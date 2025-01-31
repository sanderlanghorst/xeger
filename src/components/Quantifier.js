/// Imports

import {SelectorBase} from './SelectorBase.js';
import {pick, range} from '../utils/Range.js';
import { Size, Diversity } from '../Enums.js';
import {permute} from '../utils/Permutator.js';

/// Privates

const
	diversityNumbers = {
		[Diversity.Simple] : 6,
		[Diversity.Random] : 10,
		[Diversity.Insane] : 20
	},
	sizeNumbers = {
		[Size.Small]: 0.1,
		[Size.Medium]: 0.5,
		[Size.Large]: 0.8,
		[Size.Insane]: 1
	}

/// Class

export class Quantifier extends SelectorBase {
	
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

		/** @type {SelectorBase} */
		this._component = null;
	}

	/// Properties

	/**
	 * @inheritdoc
	 */
	get Components(){
		return [this._component];
	}
	
	get Min(){
		return this._min;
	}
	
	get Max(){
		return this._max;
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
			pickNumber = diversityNumbers[diversity],
			sizeNumber = sizeNumbers[size];
		
		const
			numberOfResults = pick(
				range(this._min, this._max - this._min + 1)
					.map(i => ((i - this._min) * sizeNumber) + this._min),
				pickNumber),
			results = [];
			
		for(let nor of numberOfResults){
			const subResults = [['']];
			for(let n = 0; n < nor; n++){
				subResults.push(this._component.GetSelection(size, diversity));
			}
			results.push(subResults);
		}
		const resultSets = results.flatMap(r => permute(r, size));
		return resultSets;
	}

	Generate(context){
		const number = pick(range(this._min, this._max), 1)[0];
		const resultSet = [];
		for(let i=0; i < number; i++){
			resultSet.push(this._component.Generate(context));
		}
		return resultSet.reduce((p,c,i) => `${p}${c}`, '');
	}

	/**
	 * Makes the selector lazy
	 */
	MakeLazy() {
		this._max = Math.min(this._min + 1, this._max);
	}
}

export const Max = 100;