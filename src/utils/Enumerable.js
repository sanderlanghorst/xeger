/**
 * The array as generator
 * @param {Array<T>} source the source
 * @returns {IterableIterator<T>} the elements
 * @template T
 */
function* FromArray(source) {
	for (let element of source) {
		yield element;
	}
}

/**
 * Groups a list by given sequence
 * @param {Array<T>} source the list to group
 * @param {SequenceSelector<T>} sequenceSelector
 * @returns {IterableIterator<Array<T>>}
 * @template T the type of the element
 */
export function* GroupSequence(source, sequenceSelector) {
	if (source == null || !source.length) {
		return;
	}

	const iterator = FromArray(source);

	let element = iterator.next().value;
	let elements = [element];
	let next = iterator.next();
	while (!next.done) {
		const item = next.value;
		if (sequenceSelector(element, item)) elements.push(item);
		else {
			yield elements;
			elements = [item];
		}

		element = item;
		next = iterator.next();
	}

	yield elements;
}

/**
 * @callback SequenceSelector
 * @param {T} left the left element
 * @param {T} right the right element
 * @returns {Boolean} wheter the elements should be grouped
 * @template T
 */
