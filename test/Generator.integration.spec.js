import assert from 'assert';
import { Generator } from '../src/Generator.js';
import { Diversity, Size } from '../src/Enums.js';
import {Parser} from '../src/Parser.js';

describe('Generating output with the generator should match parsed regex', () => {

    it('empty', () => GenerateAndMatchSimple(/ /));
    it('1', () => GenerateAndMatchSimple(/1/));

    it('kitkat', () => GenerateAndMatchSimple(/(k(i|a)+t){2}/));

    it('dutch addresses', () => GenerateAndMatchSimple(/\d{4} ?[A-Z]{2}/));

    it('complex email with simple settings', () => GenerateAndMatchSimple(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|&quot;(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*&quot;)@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/));

});

/**
 * @param {RegExp} regex 
 */
function GenerateAndMatchSimple(regex){
    const parser = new Parser();
    const parsed = parser.Parse(regex.source);
    const generator = new Generator(Size.Small, Diversity.Simple);
    const result = generator.Generate(parsed);

    assert(result.length);
    result.forEach(element => {
        assert.match(element, regex);
    });
}