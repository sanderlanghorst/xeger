/**
 * Parser
 */

/// Imports


import Character from './components/Character.js';
import Dot from './components/Dot.js';
import Group from './components/Group.js';
import SelectorBase from './components/SelectorBase.js';
import Or from './components/Or.js';
import Quantifier from './components/Quantifier.js';


/// Private type

class ParseResult {

	/**
	 * Instanciates a ParseResult
	 * @param {String} rest the string to be parsed
	 * @param {SelectorBase} currentComponent the current component
	 */
	constructor(rest, currentComponent){
		this._rest = rest;
		this._component = currentComponent;
	}

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
	result.Rest = result.Rest.slice(1,result.Rest.length);
	return c;
}

/**
 * parses the input
 * @param {ParseResult} result the current parsed result
 */
function parse(result) {
	while(result.Rest.length > 0) {
		const 
			char = consume(result);

		switch(char){
			case '(':{
				//new group
				const
					g = new Group();
				let
					r = new ParseResult(result.Rest, g);
				parse(r);
				result.Rest = r.Rest;
				result.Component.AddComponent(r.Component);
				break;
			}

			case ')':
				//close group
				return;

			case '|': {
				const
					or = new Or(),
					right = new Group();
				or.AddComponent(result.Component);
				result.Component = or;
				let
					r = new ParseResult(result.Rest, right);
				parse(r);
				result.Rest = r.Rest;
				or.AddComponent(r.Component);
				return;
			}

			case '.':
				result.Component.AddComponent(new Dot());
				break;

			case '*':{
				const
					q = new Quantifier(0, 100),
					e = result.Component.Components.splice(result.Component.Components.length - 1, 1)[0];
				q.AddComponent(e);
				result.Component.AddComponent(q);
				break;
			}
			
			case '+':{
				const
					q = new Quantifier(1, 100),
					e = result.Component.Components.splice(result.Component.Components.length - 1, 1)[0];
				q.AddComponent(e);
				result.Component.AddComponent(q);
				break;
			}

			case '?':{
				const
					q = new Quantifier(0, 1),
					e = result.Component.Components.splice(result.Component.Components.length - 1, 1)[0];
				q.AddComponent(e);
				result.Component.AddComponent(q);
				break;
			}

			default:
				//else a single character
				result.Component.AddComponent(new Character(char));
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
		parse(result);
		console.log(result);
		return result.Component;
	}
}