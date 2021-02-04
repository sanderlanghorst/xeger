/// Imports

import SelectorBase from './SelectorBase.js';
import { pick, range } from './utils/Range.js';
import { Size, Diversity } from '../Enums.js';
import permute from './utils/Permutator.js';
import ResultContext from '../results/ResultContext.js';
import Enumerator from '../results/Enumerator.js';
import { Floor, Round } from '../utils/Numbers.js';

/// Privates

const
	diversityNumbers = {
		[Diversity.Simple]: 6,
		[Diversity.Random]: 10,
		[Diversity.Insane]: 20
	},
	sizeNumbers = {
		[Size.Small]: 0.1,
		[Size.Medium]: 0.5,
		[Size.Large]: 0.8,
		[Size.Insane]: 1
	}

/// Class

export default class Quantifier extends SelectorBase {

	/**
	 * Instanciates a Quantifier selector
	 * @param {Number} min the minimum occurance
	 * @param {Number} max the maximum occurance
	 */
	constructor(min, max) {
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
	get Components() {
		return [this._component];
	}

	/// Methods

	/**
	 * @inheritdoc
	 * adds a component to the group
	 * @param {SelectorBase} component the new component
	 */
	AddComponent(component) {
		this._component = component;
	}

	/**
	 * GetSelection
	 * @param size {Symbol} the size
	 * @param diversity {Symbol} the diversity
	 * @returns {Array<String>} The array
	 */
	GetSelection(size, diversity) {
		const
			pickNumber = diversityNumbers[diversity],
			sizeNumber = sizeNumbers[size];

		const
			numberOfResults = pick(
				range(this._min, this._max - this._min + 1)
					.map(i => ((i - this._min) * sizeNumber) + this._min),
				pickNumber),
			results = [];

		for (let nor of numberOfResults) {
			const subResults = [['']];
			for (let n = 0; n < nor; n++) {
				subResults.push(this._component.GetSelection(size, diversity));
			}
			results.push(subResults);
		}
		const resultSets = results.flatMap(r => permute(r, size));
		return resultSets;
	}

	/**
	 * Makes the selector lazy
	 */
	MakeLazy() {
		this._max = Math.min(this._min + 1, this._max);
	}


	/**
	 * gets the result enumerator
	 * @param {ResultContext} resultContext the result context
	 * @param {Number} fraction the result fraction
	 * @returns {Enumerator}
	 */
	GetEnumerator(resultContext, fraction) {
		return new QuantifiedEnumerator(this, resultContext, fraction || 1)
	}
}


class QuantifiedEnumerator extends Enumerator {

	/**
	 * 
	 * @param {Quantifier} quantifier the group
	 * @param {ResultContext} resultContext the result context
	 * @param {Number} fraction the fraction
	 */
	constructor(quantifier, resultContext, fraction) {
		super(resultContext, fraction);
		this._quantifier = quantifier;

		this._enumerator = quantifier.Components[0].GetEnumerator(resultContext, fraction / quantifier._max);

		this._minResults = this._enumerator.MinResults * (quantifier._min == 0 ? 1 : quantifier._min);
		this._maxResults = this._enumerator.MaxResults * quantifier._max;
	}

	/**
	 * @inheritdoc
	 */
	GetNext() {
		if (super.GetNext()) {
			const
				pickNumber = diversityNumbers[this._context.Diversity],
				sizeNumber = sizeNumbers[this._context.Size];

			const
				numberOfResults = pick(
					range(this._quantifier._min, this._quantifier._max - this._quantifier._min + 1)
						.map(i => Round(((i - this._quantifier._min) * sizeNumber) + this._quantifier._min)),
					pickNumber),
				results = [],
				selected = Floor(this._position * Math.random() * numberOfResults.length);

			for (var i = 0; i < numberOfResults[selected]; i++) {
				this._enumerator.GetNext();
				results.push(this._enumerator.CurrentValue);
			}

			this._currentValue = results.reduce((v, e) => v + e, '');
			return true;
		}

		return false;
	}
}