import {Quantifier} from '../src/components/Quantifier.js'
import {Group} from '../src/components/Group.js'
import assert from 'assert'

describe('the component Quantifier', () => {
    
    it('should have a subcomponent', () => {
        let q = new Quantifier(0,1);
        let sub = new Group();
        q.AddComponent(sub)
        assert.deepEqual(q.Components, [sub])
    });

    it('should have a min and max', () => {
        let q = new Quantifier(1, 5);
        
        assert.equal(q.Min, 1);
        assert.equal(q.Max, 5);
    });
})