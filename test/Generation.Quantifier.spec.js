import assert from 'assert'

import { Quantifier } from '../src/components/Quantifier.js';
import { CharacterSet } from '../src/components/CharacterSet.js';
import { GenerationContext } from '../src/GenerationContext.js';
import { Diversity, Size } from '../src/Enums.js';

describe('when generating with a Quantifier component', () => {
    it('an empty result is returned when the quantity is 0', () => {
        const a = CharacterSet.FromCharacter('a');
        const q = new Quantifier(0,0);
        q.AddComponent(a);
        const context = new GenerationContext(Size.Small, Diversity.Simple);

        let tries = 10;

        while(--tries > 0){
            var result = q.Generate(context);
            assert.equal(result, '');
        }
        
    });

    it('a single result is returned when the quantity is 1', () => {
        
        const a = CharacterSet.FromCharacter('a');
        const q = new Quantifier(1,1);
        q.AddComponent(a);
        const context = new GenerationContext(Size.Small, Diversity.Simple);

        let tries = 10;

        while(--tries > 0){
            var result = q.Generate(context);
            assert(result.length == 1);
            assert(result == 'a');
        }
        
    });

    it('a result is returned with the length between min and max', () => {
        const min = 1;
        const max = 10;
        const a = CharacterSet.FromCharacter('a');
        const q = new Quantifier(min, max);
        q.AddComponent(a);
        const context = new GenerationContext(Size.Small, Diversity.Simple);

        let tries = 10;

        while(--tries > 0) {
            var result = q.Generate(context);
            assert(result.length >= min);
            assert(result.length <= max);
            assert(result.indexOf('a') >= 0);
        }
        
    });

    it('a result is returned with the length of exactly', () => {
        const min = 15;
        const max = 15;
        const a = CharacterSet.FromCharacter('a');
        const q = new Quantifier(min, max);
        q.AddComponent(a);
        const context = new GenerationContext(Size.Small, Diversity.Simple);

        let tries = 20;

        while(--tries > 0) {
            var result = q.Generate(context);
            assert.equal(result.length, max);
            assert(result.indexOf('a') >= 0);
        }
        
    });

    it('a result with length of 10 is expected when using Size.Small', () => {
        const min = 1;
        const max = 100;
        const a = CharacterSet.FromCharacter('a');
        const q = new Quantifier(min, max);
        q.AddComponent(a);
        const context = new GenerationContext(Size.Small, Diversity.Simple);

        let tries = 20;

        while(--tries > 0) {
            var result = q.Generate(context);
            assert(result.length <= 10)
        }
        
    });
});