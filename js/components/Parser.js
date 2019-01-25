/**
 * Parser
 */

/// Imports

import SelectorComponent from './SelectorComponent.js';

/// Class definition

export default class Parser {
	/**
	 * Instanciates the regex parser
	 * @param {String} regex the regex string
	 */
	constructor(regex){
		this.regex = regex;
	}

	/**
	 * Parses the regex
	 * @returns {SelectorComponent} The parsed component
	 */
	Parse(){
		return new SelectorComponent();
	}
}