import {Group} from '../src/components/Group.js'
import assert from 'assert'

describe('the component Group', () => {
    
    it('should have subcomponents', () => {
        let group = new Group();
        assert.notEqual(group.Components.length, true)
        let subGroup = new Group();
        group.AddComponent(subGroup);
        assert.deepEqual(group.Components, [subGroup]);
    });
})