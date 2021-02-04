/// Imports

import SelectorBase from './SelectorBase.js';
import permute from './utils/Permutator.js';
import ResultContext from '../results/ResultContext.js';
import Enumerator from '../results/Enumerator.js';

/// Private methods


/// Class

export default class Group extends SelectorBase {

	constructor() {
		super();

		/** @type {Array<SelectorBase>} */
		this._components = [];

		/** @type {Boolean} */
		this._isNonCapturing = false;
	}

	/// Properties

	/**
	 * Indicates whether this group is non-capturing
	 */
	get IsNonCapturing() {
		return this._isNonCapturing;
	}

	/**
	 * @inheritdoc
	 */
	get Components() {
		return this._components;
	}

	/// Methods

	/**
	 * @inheritdoc
	 * adds a component to the group
	 * @param {SelectorBase} component the new component
	 */
	AddComponent(component) {
		this._components.push(component);
	}

	/**
	 * GetSelection
	 * @param size {Symbol} the size
	 * @param diversity {Symbol} the diversity
	 * @returns {Array<String>} The array
	 */
	GetSelection(size, diversity) {
		const
			selection = this._components.map(c => c.GetSelection(size, diversity)),
			result = permute(selection, size);
		return result;
	}

	/**
	 * gets the result enumerator
	 * @param {ResultContext} resultContext the result context
	 * @param {Number} fraction the result fraction
	 * @returns {Enumerator}
	 */
	GetEnumerator(resultContext, fraction) {
		return new GroupEnumerator(this, resultContext, fraction || 1)
	}
}

class GroupEnumerator extends Enumerator {

	/**
	 * 
	 * @param {Group} group the group
	 * @param {ResultContext} resultContext the result context
	 * @param {Number} fraction the fraction
	 */
	constructor(group, resultContext, fraction) {
		super(resultContext, fraction);
		this._group = group;

		this._enumerators = group.Components.map(c => c.GetEnumerator(resultContext, 1.0 / group.Components.length));
		const enums = this._enumerators.slice();
		this._minResults = enums.reduce((v,e) => v * e.MinResults, 1);
		this._maxResults = enums.reduce((v,e) => v * e.MaxResults, 1);
	}

	/**
	 * @inheritdoc
	 */
	GetNext() {
		if (super.GetNext()) {
			this._enumerators.forEach(e => e.GetNext());
			this._currentValue = this._enumerators.reduce((v, e, i) => v + e.CurrentValue, "");
			return true;
		}

		return false;
	}
}