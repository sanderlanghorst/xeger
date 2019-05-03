/**
 * The array as generator
 * @param {Array<any>} source the source
 * @returns {IterableIterator<any>} the elements
 */
function* FromArray(source) {
	for(let element of source){
		yield element;
	}
}

/**
 * @callback SequenceSelector
 * @param {any} left the left element
 * @param {any} right the right element
 * @returns {Boolean} wheter the elements should be grouped
 */
/**
 * Groups a list by given sequence
 * @param {Array<any>} source the list to group
 * @param {SequenceSelector} sequenceSelector
 * @returns {Array<Array<any>>}
 */
function* GroupSequence(source, sequenceSelector)
{
	const iterator = FromArray(source);
	
	let element = iterator.next().value;
	let elements = [element];
	let next = iterator.next();
	while (!next.done)
	{
		const item = next.value;
		if (sequenceSelector(element, item))
			elements.push(item);
		else
		{
			yield elements;
			elements = [item];
		}

		element = item;
		next = iterator.next();
	}

	yield elements;
}

export {GroupSequence};