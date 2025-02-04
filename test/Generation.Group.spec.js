import assert from 'assert'

import { Group } from '../src/components/Group.js';
import { CharacterSet } from '../src/components/CharacterSet.js';
import { GenerationContext } from '../src/GenerationContext.js';
import { Diversity, Size } from '../src/Enums.js';

describe('when generating with an Group component', () => {
    it('all of the subcomponents values are used', () => {
        
        const a = CharacterSet.FromCharacter('a');
        const b = CharacterSet.FromCharacter('b');
        const group = new Group();
        group.AddComponent(a);
        group.AddComponent(b);
        const context = new GenerationContext(Size.Small, Diversity.Simple);

        var result = group.Generate(context);
        assert.equal(result, 'ab');
    });
});