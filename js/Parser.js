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
					g = new Group();
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

			case '*':{
				result.AddQuantifier(new Quantifier(0, 100));
				break;
			}
			
			case '+':{
				result.AddQuantifier(new Quantifier(1, 100));
				break;
			}

			case '?':{
				result.AddQuantifier(new Quantifier(0, 1));
				break;
			}
			case '{':{
				ParseQuantifier(result);
				break;
			}

			default:
				//else a single character
				result.AddComponent(CharacterSet.FromCharacter(char));
				break;
		}
	}
}

/**
 * parses the character set
 * @param {ParseResult} result the current parsed result
 */
function ParseSet(result){
	const 
		negate = result.Rest.charAt(0) === '^',
		/**@type {Array<Number>} */
		sets = [];
	let
		rangeFrom = NaN,
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
				result.AddComponent(negate 
									? CharacterSet.FromNegate(sets)
									: new CharacterSet(sets));
				return;
			
			default:
				if(rangeSet) {
					range(rangeFrom, char.charCodeAt(0) - rangeFrom)
						.forEach(i => sets.push(i));
					sets.push(char.charCodeAt(0));
				} else {
					rangeFrom = char.charCodeAt(0);
				}
				rangeSet = false;
				
				break;
		}

	}
}

/**
 * parses the quantifier
 * @param {ParseResult} result The current parsed result
 */
function ParseQuantifier(result) {
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