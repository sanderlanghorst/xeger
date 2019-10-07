/// Imports

import { SelectorBase } from './SelectorBase.js';
import { Size, Diversity } from '/src/utils/Enums.js';
import { range, rangeChars, pick } from '/src/utils/Range.js';

const diversitySets = {
		[Diversity.Simple]: range(65, 26).concat(range(97, 26)), //65 'A'
		[Diversity.Random]: range(32, 95),
		[Diversity.Insane]: []
	},
	predefinedSets = {
		digits: rangeChars('0', '9'),
		whitespaces: [9, 10, 12, 13, 32],
		word: rangeChars('A', 'Z')
			.concat(rangeChars('a', 'z'))
			.concat(rangeChars('0', '9'))
			.concat(['_'.charCodeAt(0)])
	},
	sizes = {
		[Size.Small]: 3,
		[Size.Medium]: 6,
		[Size.Large]: 12,
		[Size.Insane]: 100
	};

/**
 * A character set
 */
export class CharacterSet extends SelectorBase {
	/**
	 * a characterset with a defined set
	 * @param {Array<Number>} set a defined set
	 */
	constructor(set) {
		super();

		this._set = set;
	}

	/// Properties

	/**@inheritdoc */
	get Components() {
		return [];
	}

	/**
	 * Gets a copy of the set
	 */
	get Set() {
		return this._set.slice();
	}

	/// Methods

	/**
	 * Generate
	 * @param {Symbol} size the size
	 * @param {Symbol} diversity the diversity
	 * @returns {Array<String>} The array
	 */
	Generate(size, diversity) {
		/**@type {Array<Number>} */
		const preSet = diversitySets[diversity],
			sub = this._set.filter(char => preSet.some(r => r === char)),
			result = sub.length ? sub : this._set;

		return pick(result, sizes[size]).map(r => String.fromCharCode(r));
	}

	/// Static Properties

	/**
	 * Gets the digit set
	 * @returns {Array<Number>} the charcodes of the digits
	 */
	static get DigitSet() {
		return predefinedSets.digits;
	}

	/**
	 * Gets the whitespace set
	 * @returns {Array<Number>} the charcodes of the whitespace characters
	 */
	static get WhitespaceSet() {
		return predefinedSets.whitespaces;
	}

	/**
	 * Gets the word set
	 * @returns {Array<Number>} the charcodes of the word-like characters
	 */
	static get WordSet() {
		return predefinedSets.word;
	}

	/// Static Methods

	/**
	 * Creates a new instance of Character with a character
	 * @param {String} character the character
	 */
	static FromCharacter(character) {
		return new CharacterSet([character.charCodeAt(0)]);
	}

	/**
	 * gets a characters set based on the predefined sets without this set
	 * @param {Array<Number>} set a negated character set
	 */
	static FromNegate(set) {
		// @ts-ignore
		return new CharacterSet(
			diversitySets[Diversity.Random].filter(p => !set.some(s => s === p))
		);
	}

	/**
	 * set a range
	 * @param {Number} from charcode
	 * @param {Number} to charcode
	 */
	static FromRange(from, to) {
		return new CharacterSet(range(from, to - from));
	}
}
