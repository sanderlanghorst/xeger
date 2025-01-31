/// Imports

import {SelectorBase} from './SelectorBase.js';
import { Size, Diversity } from '../Enums.js';
import { pick } from '../utils/Range.js';


/// Class

export class Or extends SelectorBase {
	
	constructor(){
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
	get Components(){
		return [this._left, this._right];
	}

	/// Methods

	/**
	 * @inheritdoc
	 * adds a component to the group
	 * @param {SelectorBase} component the new component
	 */
	AddComponent(component){
		if(this._left === null){
			this._left = component;
			return;
		}
		if(this._right === null){
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
	GetSelection(size, diversity){
		return [this._left.GetSelection(size, diversity),
				this._right.GetSelection(size, diversity)]
				.flatMap(m => m);
	}

	Generate(context){
		const el = pick(this.Components, 1)[0];
		return el.Generate(context);
	}


	/**
	 * Generates an Or component with the given elements
	 * @param {SelectorBase} a the first component
	 * @param {SelectorBase} b the second component
	 * @returns {Or}
	 */
	static With(a, b) {
		if(!a || !b) throw "Arguments should have a component";
		const or = new Or();
		or.AddComponent(a);
		or.AddComponent(b);
		return or;
	}
}