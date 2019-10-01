/// Imports

import { SelectorBase } from './SelectorBase.js';

/// Class

export class Or extends SelectorBase {
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
		return [
			this._left.GetSelection(size, diversity),
			this._right.GetSelection(size, diversity)
		].flatMap(m => m);
	}
}
