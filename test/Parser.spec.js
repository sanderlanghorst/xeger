import {Parser} from '../src/Parser.js'
import {Group} from '../src/components/Group.js';

import assert from 'assert'
import {Quantifier, Max as QuantifierMax} from "../src/components/Quantifier.js";
import {CharacterSet, Min as CharacterSetMin, Max as CharacterSetMax} from "../src/components/CharacterSet.js";
import {Or} from "../src/components/Or.js";

describe('when parsing', () => {
    it('the result should contain', () => {
        const regexString = "";
        const parser = new Parser();
        const result = parser.Parse(regexString);
        assert.equal(result instanceof Group, true);
    });

    it('should parse . as Wildcard', () => {
        const parser = new Parser();
        const result = parser.Parse('.');
        const firstComponent = result.Components[0];
        assert(firstComponent instanceof CharacterSet);
        assert.equal(firstComponent.Set[0], CharacterSetMin);
        assert.equal(firstComponent.Set.at(-1), CharacterSetMax);
    });

    it('should parse [a-z] as CharacterSet', () => {
        const parser = new Parser();
        const result = parser.Parse('[a-z]');
        const firstComponent = result.Components[0];
        assert(firstComponent instanceof CharacterSet);
        assert.equal(firstComponent.Set.length, 26);
        assert.equal(firstComponent.Set[0], 'a'.charCodeAt(0));
        assert.equal(firstComponent.Set.at(-1), 'z'.charCodeAt(0));
    });

    it('should parse | as Or', () => {
        const parser = new Parser();
        const result = parser.Parse('a|b');
        
        assert(result instanceof Or);
    });

    it('should parse ? as ZeroOrOne', () => {
        const parser = new Parser();
        const result = parser.Parse('a?');
        const firstComponent = result.Components[0];
        assert(firstComponent instanceof Quantifier);
        assert.equal(0, firstComponent.Min);
        assert.equal(1, firstComponent.Max);
    });

    it('should parse * as ZeroOrMany', () => {
        const parser = new Parser();
        const result = parser.Parse('a*');
        const firstComponent = result.Components[0];
        assert(firstComponent instanceof Quantifier);
        assert.equal(0, firstComponent.Min);
        assert.equal(QuantifierMax, firstComponent.Max);
    });

    it('should parse + as OneOrMany', () => {
        const parser = new Parser();
        const result = parser.Parse('a+');
        const firstComponent = result.Components[0];
        assert(firstComponent instanceof Quantifier);
        assert.equal(1, firstComponent.Min);
        assert.equal(QuantifierMax, firstComponent.Max);
    });

    it('should parse {n,m} as Range', () => {
        const parser = new Parser();
        const result = parser.Parse('a{2,5}');
        const firstComponent = result.Components[0];
        assert(firstComponent instanceof Quantifier);
        assert.equal(2, firstComponent.Min);
        assert.equal(5, firstComponent.Max);
    });
})