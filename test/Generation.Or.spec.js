import assert from 'assert'

import { Or } from '../src/components/Or.js';
import { CharacterSet } from '../src/components/CharacterSet.js';
import { GenerationContext } from '../src/GenerationContext.js';
import { Diversity, Size } from '../src/Enums.js';

describe('when generating with an Or component', () => {
    it('either one of the subcomponents returns a values', () => {
        const characters = ['a', 'b'];
        const a = CharacterSet.FromCharacter('a');
        const b = CharacterSet.FromCharacter('b');
        const or = Or.With(a, b);
        const context = new GenerationContext(Size.Small, Diversity.Simple);

        let tries = 1000;

        while(--tries > 0){
            var result = or.Generate(context);
            assert(characters.indexOf(result) >= 0);
        }
        
    });
});