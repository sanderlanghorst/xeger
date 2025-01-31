import assert from 'assert'

import { Quantifier } from '../src/components/Quantifier.js';
import { CharacterSet } from '../src/components/CharacterSet.js';
import { GenerationContext } from '../src/components/GenerationContext.js';
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
            assert(result.length == 0);
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
});