/**
 * Xeger
 * Input handler
 */

/// Imports

import Parser from '../Parser.js';
import {Size, Diversity} from '../Enums.js';


/// Constants
const
	moduleName = 'xeger',
	selectors = {
		base: `.js-${moduleName}`,
		diversity: `.js-${moduleName}-diversity`,
		form: `form`,
		format: `.js-${moduleName}-format`,
		regex: `.js-${moduleName}-regex`,
		result: `.js-${moduleName}-result`,
		size: `.js-${moduleName}-size`
	},
	whitespaceMap = new Map([
		[' ', '␠'],
		['\t', '→'],
		['\t', '→'],
		['\r', '␍'],
		['\n', '␤'],
		['\f', '␌']
	]);

/// Privates
let
	baseElement = null;

/**
 * Formats the whitespaces of the string
 * @param {String} string the input string
 * @return {Array<Node>}
 */
function formatWhitespace(string) {
	const elements = [];
	
	for (let i = 0; i < string.length; i++) {
		if (whitespaceMap.has(string.charAt(i))) {
			const span = document.createElement('span');
			span.classList.add('whitespace');
			span.innerText = whitespaceMap.get(string.charAt(i));
			elements.push(span);
		} else {
			elements.push(document.createTextNode(string.charAt(i)));
		}
	}

	return elements;
}

/**
 * @returns {Symbol} The selected diversity
 */
function getDiversityOption(){
	const
		diversity = baseElement.querySelector(selectors.diversity),
		diversityValue = diversity == null ? 0 : diversity.value;
	switch(diversityValue){
		case '1':
			return Diversity.Simple;
		case '2':
			return Diversity.Random;
		case '3':
			return Diversity.Insane;
	}
	return Diversity.Simple;
}
	
/**
 * @returns {Symbol} Size
 */
function getSizeOption(){
	const
		size = baseElement.querySelector(selectors.size),
		sizeValue = size == null ? 0 : size.value;
	switch(sizeValue){
		case '1':
			return Size.Small;
		case '2':
			return Size.Medium;
		case '3':
			return Size.Large;
		case '4':
			return Size.Insane;
	}
	return Size.Small;
}

/**
 * initializes the listeners
 * @param {HtmlElement} element the xeger element
 */
function initXeger(element){
	baseElement = element;

	const 
		form = baseElement.querySelector(selectors.form),
		regex = baseElement.querySelector(selectors.regex);
	if(form === null)
		return;

	form.addEventListener('submit', onFormSubmitted);
	regex.addEventListener('input', onRegexInputed);
}

/**
 * exported init
 * @param {Array<HTMLElement>} elements the selected elements
 */
function init(elements = document.querySelectorAll(selectors.base)) {
	if(elements === null || elements === undefined || elements.length == 0)
		return;
	
	initXeger(elements[0]);
}

/**
 * renders the result on the page
 * @param {Array<String>} possibilities the result
 * @param {String} regex the regex
 * @param {Boolean} format wether to format the whitespaces
 */
function setResult(possibilities, regex, format){
	const
		resultElement = baseElement.querySelector(selectors.result),
		ul = document.createElement('ul');
	
	resultElement.innerHTML = '';

	possibilities.forEach(p => {
		const
			listElement = document.createElement('li'),
			matches = new RegExp(regex).test(p),
			formattedElements = format ? formatWhitespace(p) : [document.createTextNode(p)],
			emElement = document.createElement('em');
		formattedElements.forEach(f => emElement.appendChild(f));
		
		listElement.append(matches ? '✔️' : '❌');
		listElement.appendChild(emElement);
		ul.appendChild(listElement);
	});
	resultElement.appendChild(ul);
}

/**
 * Validates the input and sets validity properties
 * @param {HtmlInputElement} regex the regex input
 */
function validateInput(regex){
	try{
		if(regex === null || regex === undefined || regex.value === '')
			throw 'Input is empty, infinite matches!';
		
		new RegExp(regex.value);
		regex.setCustomValidity('');
		return true;
	}
	catch(e){
		regex.setCustomValidity(`${e}`);
		return false;
	}
	finally{
		regex.form.reportValidity();
	}
}

/// Events

/**
 * handles the generate button click
 * @param {MouseEvent} event the mouse event
 */
function onFormSubmitted(event){
	const
		regex = baseElement.querySelector(selectors.regex);
	
	event.preventDefault();

	if(!validateInput(regex)){
		return;
	}

	const
		sizeOption = getSizeOption(),
		diversityOption = getDiversityOption(),
		format = ((checkbox) => checkbox ? checkbox.checked : false)(baseElement.querySelector(selectors.format)),
		parser = new Parser(regex.value),
		parsedComponent = parser.Parse(),
		possibilities = parsedComponent.GetSelection(sizeOption, diversityOption);
	
	console.log(possibilities);

	setResult(possibilities, regex.value, format);
}

/**
 * handles the input on the regex field
 * @param {InputEvent} event the input event
 */
function onRegexInputed(event){
	if(!validateInput(event.target)){
		return;
	}
}

/// Export

export {
	init
};