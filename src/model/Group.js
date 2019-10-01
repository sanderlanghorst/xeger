/// Imports

import { SelectorBase } from './SelectorBase.js';
import { permute } from '/src/generator/Permutator.js';

/// Private methods

/// Class

export class Group extends SelectorBase {
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
		const selection = this._components.map(c =>
				c.GetSelection(size, diversity)
			),
			result = permute(selection, size);
		return result;
	}
}
