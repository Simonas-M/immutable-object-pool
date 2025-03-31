import assert from 'node:assert/strict';
import {afterEach, describe, it} from 'node:test';
import {Schema, ImmutableObjectPool} from '../src/index.mts'

describe('object-pool', () => {
    const objectPool = new ImmutableObjectPool();

    afterEach(() => {
        objectPool.clear();
    })

    it('should create an object based on a schema', () => {
        const schema = Schema.create({
            number: Schema.constant(4)
        });

        const objectA = objectPool.obtain(schema, {number: 3});
        const objectB = objectPool.obtain(schema, {number: 3});

        assert(objectA === objectB)
    })

    it('should create a nested object based on a schema', () => {
        const schema = Schema.create({
            number: Schema.number(),
            nested: Schema.create({
                string: Schema.string(),
            })
        });

        const objectA = objectPool.obtain(schema, {number: 3, nested: {string: 'string'}});
        const objectB = objectPool.obtain(schema, {number: 3, nested: {string: 'string'}});

        assert(objectA === objectB)
    })


    it('should clear the cache', () => {
        const schema = Schema.create({
            number: Schema.number()
        });

        const objectA = objectPool.obtain(schema, {number: 3});
        objectPool.clear();
        const objectB = objectPool.obtain(schema, {number: 3});

        assert(objectA !== objectB)
    })
})