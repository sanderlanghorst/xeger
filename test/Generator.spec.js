import assert from 'assert';
import { Generator } from '../src/Generator.js';
import { Diversity, Size } from '../src/Enums.js';
import {CharacterSet} from '../src/components/CharacterSet.js';

describe('Generating output with the generator', () => {
    it('should return an array of strings', () => {
        const generator = new Generator(Size.Small, Diversity.Simple);
        const component = CharacterSet.FromRange('a'.charCodeAt(0), 'z'.charCodeAt(0));
        const result = generator.Generate(component);
        assert(result instanceof Array)
        assert(result.length > 1);
    });

    it('should only return unique values', () => {
        const generator = new Generator(Size.Small, Diversity.Simple);
        const component = CharacterSet.FromCharacter('a');
        const result = generator.Generate(component);
        assert.deepEqual(result, ['a'])
    });

    it('should return a sorted list', () => {
        const generator = new Generator(Size.Small, Diversity.Simple);
        const component = CharacterSet.FromRange('a'.charCodeAt(0), 'z'.charCodeAt(0));
        const result = generator.Generate(component);
        const sorted = Array.from(result).sort();
        assert.deepEqual(result, sorted);
    });
})