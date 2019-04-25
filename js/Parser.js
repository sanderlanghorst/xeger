/**
 * Parser
 */

/// Imports


import CharacterSet from './components/CharacterSet.js';
import Group from './components/Group.js';
import SelectorBase from './components/SelectorBase.js';
import Or from './components/Or.js';
import Quantifier from './components/Quantifier.js';
import { range } from './components/utils/Range.js';


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
			return new CharacterSet(CharacterSet.DigitSet);
		case 'D':
			return CharacterSet.FromNegate(CharacterSet.DigitSet);
		case 'w':
			return new CharacterSet(CharacterSet.WordSet);
		case 'W':
			return CharacterSet.FromNegate(CharacterSet.WordSet);
		
		default:
			return CharacterSet.FromCharacter(char);
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
					g = ParseGroupStart(result);
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
				result.AddComponent(CharacterSet.FromRange(0,255));
				break;

			case '*': 
				ParseQuantifier(result, 0, 100);
				break;
			
			case '+':
				ParseQuantifier(result, 1, 100);
				break;

			case '?':
				ParseQuantifier(result, 0, 1);
				break;
			
			case '{':
				ParseQuantifierRange(result);
				break;
			
			case '\\':
				result.AddComponent(ParseEscaped(result));
				break;

			default:
				//else a single character
				result.AddComponent(CharacterSet.FromCharacter(char));
				break;
		}
	}
}

/**
 * Parses the start of a group
 * @param {ParseResult} result the current parsed result
 * @returns {Group} the parsed group
 */
function ParseGroupStart(result) {
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

	if(negate)
		consume(result);

	while(result.Rest.length) {
		const
			char = consume(result);
		
		switch(char){
			case '-':
				rangeSet = true;
				break;

			case ']':
				if(rangeFrom !== null)
					sets.push(rangeFrom);

				result.AddComponent(negate 
									? CharacterSet.FromNegate(sets)
									: new CharacterSet(sets));
				return;
			
			case '\\': {
				const escapedSet = ParseEscaped(result);
				escapedSet.Set.forEach(i => sets.push(i));
				break;
			}

			default:
				if(rangeSet) {
					range(rangeFrom, char.charCodeAt(0) - rangeFrom)
						.forEach(i => sets.push(i));
					sets.push(char.charCodeAt(0));
					rangeFrom = null;
				} else {
					if(rangeFrom !== null)
						sets.push(rangeFrom);
					rangeFrom = char.charCodeAt(0);
				}
				rangeSet = false;
				
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

export default class Parser {
	/**
	 * Instanciates the regex parser
	 * @param {String} regex the regex string
	 */
	constructor(regex){
		this._regex = regex;
	}

	/**
	 * Parses the regex
	 * @returns {Group} The parsed component
	 */
	Parse(){
		const 
			defaultComponent = new Group(),
			result = new ParseResult(this._regex, defaultComponent);
		ParseGroup(result);
		console.log(result);
		return result.Component;
	}
}