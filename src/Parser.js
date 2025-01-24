/**
 * Parser
 */

/// Imports


import {CharacterSet, Min as CharacterSetMin, Max as CharacterSetMax} from './components/CharacterSet.js';
import {Group} from './components/Group.js';
import {SelectorBase} from './components/SelectorBase.js';
import {Or} from './components/Or.js';
import {Quantifier, Max as QuantifierMax} from './components/Quantifier.js';
import { range } from './utils/Range.js';


/// Private type

class ParseResult {

	///Constructor

	/**
	 * Instanciates a ParseResult
	 * @param {String} rest the string to be parsed
	 * @param {SelectorBase} currentComponent the current component
	 */
	constructor(rest, currentComponent){
		this._rest = rest;
		this._component = currentComponent;
	}

	/// Properties

	get Rest(){
		return this._rest;
	}
	/**
	 * @param {String} value
	 */
	set Rest(value){
		this._rest = value;
	}
	get Component(){
		return this._component;
	}
	/**
	 * @param {SelectorBase} value
	 */
	set Component(value){
		this._component = value;
	}
	
	///Methods

	/**
	 * adds a component to the result
	 * @param {SelectorBase} component the new component
	 */
	AddComponent(component) {
		this.Component.AddComponent(component);
	}

	/**
	 * Add a quantifier to the last component
	 * @param {Quantifier} quantifier the quantifier to apply on the last component
	 */
	AddQuantifier(quantifier) {
		const e = this.Component.Components.splice(this.Component.Components.length - 1, 1)[0];
		quantifier.AddComponent(e);
		this.AddComponent(quantifier);
	}
}

/// Private methods

/**
 * consumes the result
 * @param {ParseResult} result the result
 * @returns {String} the consumed character
 */
function consume(result) {
	const
		c = result.Rest.charAt(0);
	result.Rest = result.Rest.slice(1, result.Rest.length);
	return c;
}

/**
 * Gets the next character to parse
 * @param {ParseResult} result the result
 * @returns {String} the next character
 */
function peek(result) {
	return result.Rest.charAt(0);
}

/**
 * parses the escaped character
 * @param {ParseResult} result the current parsed result
 * @param {CharacterSet} the escaped set
 */
function ParseEscaped(result) {
	const
		char = consume(result);
	switch(char) {
		//shorthands
		case 'd':
			result.AddComponent(new CharacterSet(CharacterSet.DigitSet));
			break;

		case 'D':
			result.AddComponent(CharacterSet.FromNegate(CharacterSet.DigitSet));
			break;

		case 'w':
			result.AddComponent(new CharacterSet(CharacterSet.WordSet));
			break;

		case 'W':
			result.AddComponent(CharacterSet.FromNegate(CharacterSet.WordSet));
			break;

		case 's':
			result.AddComponent(new CharacterSet(CharacterSet.WhitespaceSet));
			break;

		case 'S':
			result.AddComponent(CharacterSet.FromNegate(CharacterSet.WhitespaceSet));
			break;

		case 'r':
			result.AddComponent(CharacterSet.FromCharacter('\r'));
			break;

		case 'n':
			result.AddComponent( CharacterSet.FromCharacter('\n'));
			break;

		case 't':
			result.AddComponent(CharacterSet.FromCharacter('\t'));
			break;

		case 'f':
			result.AddComponent(CharacterSet.FromCharacter('\f'));
			break;
			
		case 'c': //ASCII control character (A-Z)
			break;

		case 'x': { //ASCII character (01-FF)
			if(ParseHex(result, 2, false)) {
				return;
			}
			result.AddComponent(CharacterSet.FromCharacter(char));
			break;
		}

		case 'u': { //Unicode character (0000-FFFF)
			if(ParseHex(result, 4, true)) {
				return;
			}
			result.AddComponent(CharacterSet.FromCharacter(char));
			break;
		}

		default:
			result.AddComponent(CharacterSet.FromCharacter(char));
	}
}

/**
 * parses the input
 * @param {ParseResult} result the current parsed result
 */
function ParseGroup(result) {
	while(result.Rest.length) {
		const 
			char = consume(result);

		switch(char){
			case '(':{
				//new group
				const
					g = GetGroupStart(result);
				let
					r = new ParseResult(result.Rest, g);
				ParseGroup(r);
				result.Rest = r.Rest;
				result.AddComponent(r.Component);
				break;
			}

			case ')':
				//close group
				return;
			
			case '[':
				//character set
				ParseSet(result);
				break;

			case '|': {
				const
					or = new Or(),
					right = new Group();
				or.AddComponent(result.Component);
				result.Component = or;
				let
					r = new ParseResult(result.Rest, right);
				ParseGroup(r);
				result.Rest = r.Rest;
				or.AddComponent(r.Component);
				return;
			}

			case '.':
				result.AddComponent(CharacterSet.FromRange(CharacterSetMin, CharacterSetMax));
				break;

			case '*': 
				ParseQuantifier(result, 0, QuantifierMax);
				break;
			
			case '+':
				ParseQuantifier(result, 1, QuantifierMax);
				break;

			case '?':
				ParseQuantifier(result, 0, 1);
				break;
			
			case '{':
				ParseQuantifierRange(result);
				break;

			case '^':
			case '$':
				break;
			
			case '\\':
				ParseEscaped(result);
				break;

			default:
				//else a single character
				result.AddComponent(CharacterSet.FromCharacter(char));
				break;
		}
	}
}

/**
 * gets the start of a group
 * @param {ParseResult} result the current parsed result
 * @returns {Group} the created group
 */
function GetGroupStart(result) {
	const g = new Group();

	if (peek(result) === '?') {
		//non-capture or lookaround
		consume(result);
		switch(consume(result)){
			case ':':
				//non-capturing
				break;

			case '<': {
				//lookbehind
				//check ! or =
				switch(consume(result)) {
					case '=':
					//positive lookbehind
					break;

				case '!':
					//negative lookbehind
					break;
				}
				break;
			}

			case '=':
				//positive lookahead
				break;

			case '!':
				//negative lookahead
				break;
		}
	}
	return g;
}

/**
 * Parse a hexadecimal number from the string
 * @param {ParseResult} result the current parsed result
 * @param {Number} maxNumber the maximum number of characters to parse for a hexadecimal number
 * @param {Boolean} isExact the maximum number must be reached
 * @returns {Boolean} whether the parse has succeeded
 */
function ParseHex(result, maxNumber, isExact) {
	const seperateResult = new ParseResult(result.Rest, result.Component)
	let parsed = '';
	for(let i = 0; i < maxNumber; i++) {
		if(!Number.isNaN(parseInt(peek(seperateResult), 16))) {
			parsed += consume(seperateResult);
		} else {
			break;
		}
	}
	if(parsed !== '' && !isExact || parsed.length === maxNumber) {
		result.Rest = seperateResult.Rest;
		const characterSet = new CharacterSet([parseInt(parsed, 16)]);
		result.AddComponent(characterSet);
		return true;
	}
	return false;
}

/**
 * parses the character set
 * @param {ParseResult} result the current parsed result
 */
function ParseSet(result){
	const 
		negate = peek(result) === '^',
		/**@type {Array<Number>} */
		sets = [];
	let
		rangeFrom = null,
		rangeSet = false;

	const addChar = (charCode) => {
		if(rangeSet) {
			range(rangeFrom, charCode - rangeFrom)
				.forEach(i => sets.push(i));
			sets.push(charCode);
			rangeFrom = null;
		} else {
			if(rangeFrom !== null)
				sets.push(rangeFrom);
			rangeFrom = charCode;
		}
		rangeSet = false;
	};

	if(negate)
		consume(result);

	while(result.Rest.length) {
		const
			char = consume(result);
		let charCode = char.charCodeAt(0);

		switch(char){
			case '-':
				if(rangeFrom !== null) {
					rangeSet = true;
				} else {
					addChar(charCode);
				}
				break;

			case ']':
				if(rangeFrom !== null)
					sets.push(rangeFrom);

				result.AddComponent(negate 
									? CharacterSet.FromNegate(sets)
									: new CharacterSet(sets));
				return;
			
			case '\\': 
				const seperateResult = new ParseResult(result.Rest, new Group());
				ParseEscaped(seperateResult);
				result.Rest = seperateResult.Rest;
				charCode = seperateResult.Component.Components[0].Set[0];
			
			default:
				addChar(charCode);
				
				break;
		}

	}
}

/**
 * Parse a full quantifier
 * @param {ParseResult} result the result to be parsed
 * @param {Number} min the minimum
 * @param {Number} max the maxium
 */
function ParseQuantifier(result, min, max) {
	const
		q = new Quantifier(min, max);
	result.AddQuantifier(q);
	ParseQuantifierLazy(result, q);
}

/**
 * parses the quantifier
 * @param {ParseResult} result The current parsed result
 */
function ParseQuantifierRange(result) {
	let
		fromSet = false,
		rangeFrom = '',
		rangeTo = '';
	const quantifierResult = new ParseResult(result.Rest, result.Component);

	while(quantifierResult.Rest.length) {
		const
			char = consume(quantifierResult);
		switch(char){
			case ',':
				fromSet = true;
				break;

			case '}':
				const fromInt = parseInt(rangeFrom, 10);
				/**@type {Quantifier} */
				let q;
				//quantifier: single, range endless, range
				if(!fromSet) {
					q = new Quantifier(fromInt, fromInt);
				} else if(rangeTo === '') {
					//if the range from is already high, only add a bit
					q = new Quantifier(fromInt, fromInt > 100 ? fromInt + 10 : 100);
				} else {
					const toInt = parseInt(rangeTo, 10);
					q = new Quantifier(fromInt, toInt);
				}
				quantifierResult.AddQuantifier(q);
				ParseQuantifierLazy(quantifierResult, q);
				result.Rest = quantifierResult.Rest;
				result.Component = quantifierResult.Component;
				
				return;
			
			default:
				if(!char.match(/\d/)) { //not a range
					result.AddComponent(CharacterSet.FromCharacter('{'));
					return;
				}
				if(!fromSet) {
					rangeFrom = rangeFrom.concat(char);
				} else {
					rangeTo = rangeTo.concat(char);
				}
				break;
		}
	}
}

/**
 * parses the quantifier
 * @param {ParseResult} result The current parsed result
 * @param {Quantifier} quantifier The quantifier result
 */
function ParseQuantifierLazy(result, quantifier) {
	if(peek(result) === '?') {
		consume(result);
		quantifier.MakeLazy();
	}
}

/// Class definition

export class Parser {
	/**
	 * Instanciates the regex parser
	 */
	constructor(){
	}

	/**
	 * Parses the regex
	 * @param {String} regex the regex string
	 * @returns {Group} The parsed component
	 */
	Parse(regex){
		const 
			defaultComponent = new Group(),
			result = new ParseResult(regex, defaultComponent);
		ParseGroup(result);
		return result.Component;
	}
}