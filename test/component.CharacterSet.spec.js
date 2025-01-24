import {CharacterSet} from '../src/components/CharacterSet.js'
import assert from 'assert'

describe('the component CharacterSet', () => {
    
    it('should have no subcomponents', () => {
        let set = new CharacterSet(['a'.charCodeAt(0), 'b'.charCodeAt(0)]);
        assert.notEqual(set.Components.length, true)
    });

    it('should have the given characters', () => {
        let set = new CharacterSet(['a'.charCodeAt(0), 'b'.charCodeAt(0)]);
        assert.deepEqual(set.Set, ['a'.charCodeAt(0), 'b'.charCodeAt(0)]);
    });
})