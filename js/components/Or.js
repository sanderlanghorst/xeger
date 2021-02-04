/// Imports

import SelectorBase from './SelectorBase.js';
import { Size, Diversity } from '../Enums.js';

import ResultContext from '../results/ResultContext.js';
import Enumerator from '../results/Enumerator.js';

/// Class

export default class Or extends SelectorBase {

	constructor() {
		super();

		/** @type {SelectorBase} */
		this._left = null;

		/** @type {SelectorBase} */
		this._right = null;
	}

	/// Properties

	/**
	 * @inheritdoc
	 */
	get Components() {
		return [this._left, this._right];
	}

	/// Methods

	/**
	 * @inheritdoc
	 * adds a component to the group
	 * @param {SelectorBase} component the new component
	 */
	AddComponent(component) {
		if (this._left === null) {
			this._left = component;
			return;
		}
		if (this._right === null) {
			this._right = component;
			return;
		}
		this._left = component;
		this._right = null;
	}

	/**
	 * GetSelection
	 * @param size {Symbol} the size
	 * @param diversity {Symbol} the diversity
	 * @returns {Array<String>} The array
	 */
	GetSelection(size, diversity) {
		return [this._left.GetSelection(size, diversity),
		this._right.GetSelection(size, diversity)]
			.flatMap(m => m);
	}


	/**
	 * gets the result enumerator
	 * @param {ResultContext} resultContext the result context
	 * @param {Number} fraction the result fraction
	 * @returns {Enumerator}
	 */
	GetEnumerator(resultContext, fraction) {
		return new OrEnumerator(this, resultContext, fraction || 1)
	}
}

class OrEnumerator extends Enumerator {

	/**
	 * 
	 * @param {Or} or the or component
	 * @param {ResultContext} resultContext the result context
	 * @param {Number} fraction the fraction
	 */
	constructor(or, resultContext, fraction) {
		super(resultContext, fraction);
		this._or = or;

		this._enumerators = or.Components.map(c => c.GetEnumerator(resultContext, 0.5));
		const enums = this._enumerators.slice();
		this._minResults = enums.reduce((v, e) => v + e.MinResults, 1);
		this._maxResults = enums.reduce((v, e) => v + e.MaxResults, 1);
	}

	/**
	 * @inheritdoc
	 */
	GetNext() {
		if (super.GetNext()) {
			if (Math.random() < 0.5 && this._enumerators[0].GetNext()) {
				this._currentValue = this._enumerators[0]._currentValue;
				return true;
			}
			else if (this._enumerators[1].GetNext()) {
				this._currentValue = this._enumerators[1]._currentValue;
				return true;
			}
		}

		return false;
	}
}