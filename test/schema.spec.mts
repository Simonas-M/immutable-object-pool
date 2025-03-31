import {describe, it} from 'node:test';
import assert from 'node:assert/strict';
import {Schema} from '../src/index.mts'

describe('schema', () => {
    it('should create a schema', () => {
        const schema = Schema.create({
            number: Schema.number(),
            string: Schema.string(),
            boolean: Schema.boolean(),
            nested: Schema.create({
                value: Schema.number()
            })
        });

        assert(typeof schema.number === 'number')
        assert(typeof schema.string === 'string')
        assert(typeof schema.boolean === 'boolean')
        assert(typeof schema.nested === 'object')
    });

    it('should create an intersection of multiple schemas', () => {
        const schemaA = Schema.create({
            prop: Schema.number(),
        });
        const schemaB = Schema.create({
            prop: Schema.string(), // override schemaA's prop
            string: Schema.string(),
        });
        const schemaC = Schema.create({
            nested: Schema.create({
                value: Schema.number()
            }),
        });

        const intersection = Schema.intersection(schemaA, schemaB, schemaC);

        assert(typeof intersection.prop === 'string');
        assert(typeof intersection.string === 'string');
        assert(typeof intersection.nested === 'object');
    })
})