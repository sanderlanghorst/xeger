import {Or} from '../src/components/Or.js'
import assert from 'assert'

describe('the component Or', () => {
    
    it('should have subcomponents', () => {
        let o = new Or();
        assert.deepEqual(o.Components, [null, null])
        o.AddComponent(new Or());
        assert.notDeepEqual(o.Components, [null,null])
    });
})