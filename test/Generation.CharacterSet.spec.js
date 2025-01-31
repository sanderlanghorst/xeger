import { CharacterSet, diversitySets, Min as CharacterSetMin, Max as CharacterSetMax } from "../src/components/CharacterSet.js";
import { GenerationContext } from "../src/components/GenerationContext.js";
import { Size, Diversity } from '../src/Enums.js';

import assert from 'assert'

describe('when generating a characterset', () => {
    it('a single character should always generate that character', () => {
        const characterSet = new CharacterSet(['a'.charCodeAt(0)]);
        const context = new GenerationContext(Size.Small, Diversity.Simple);
        var result = characterSet.Generate(context);
        assert.equal(result, 'a');
        result = characterSet.Generate(context);
        assert.equal(result, 'a');
        result = characterSet.Generate(context);
        assert.equal(result, 'a');
    });

    it('a list of three characters should randomly return those characters', () => {
        const characters = ['a', 'b', '1'];
        const characterSet = new CharacterSet(characters.map((c) => c.charCodeAt(0)));
        const context = new GenerationContext(Size.Small, Diversity.Simple);
        let tries = 1000;

        while(--tries > 0){
            var result = characterSet.Generate(context);
            assert(characters.indexOf(result) >= 0);
        }
    });

    it('a complete list with simple generationcontext returns values within simple set', () => {
        const characters = diversitySets[Diversity.Simple].map(c => String.fromCharCode(c));
        const characterSet = CharacterSet.FromRange(CharacterSetMin, CharacterSetMax);
        const context = new GenerationContext(Size.Small, Diversity.Simple);
        let tries = 1000;

        while(--tries > 0){
            var result = characterSet.Generate(context);
            assert(characters.indexOf(result) >= 0);
        }
    });

    it('a complete list with random generationcontext returns values within random set', () => {
        const characters = diversitySets[Diversity.Random].map(c => String.fromCharCode(c));
        const characterSet = CharacterSet.FromRange(CharacterSetMin, CharacterSetMax);
        const context = new GenerationContext(Size.Small, Diversity.Random);
        let tries = 1000;

        while(--tries > 0){
            var result = characterSet.Generate(context);
            assert(characters.indexOf(result) >= 0);
        }
    });
});