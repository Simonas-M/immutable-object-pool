import {MapUtils} from './utils/map-utils.mts';
import {compiled} from './constants.mts';
import {deepFreeze} from "./utils/freeze-utils.mts";
import type {Pojo, Schema} from "./types.mjs";

interface ObjectEntry<T extends Pojo> {
    value: T;
    id: number;
}

export class ImmutableObjectPool {
    private id = 0
    private readonly cache = new Map<Schema, Map<string, ObjectEntry<any>>>();

    /**
     * Creates an object based on the provided schema and caches it.
     * Next time the same object is requested, it will be returned from the cache.
     */
    public obtain<T extends Pojo>(schema: Schema<T>, obj: T): T {
        const {value} = this.obtainObjectEntry(schema, obj);
        return value;
    }

    /** Clears all cached objects */
    public clear(): void {
        this.cache.clear();
    }

    private obtainObjectEntry<T extends Pojo>(schema: Schema<T>, obj: T): ObjectEntry<T> {
        const cache = MapUtils.getOrSet(this.cache, schema, () => new Map());
        const stableObject = deepFreeze({...schema, ...obj});
        const key = this.hash(schema, stableObject);

        return MapUtils.getOrSet(cache, key, () => this.createEntry(stableObject));
    }

    private hash<T extends Pojo>(schema: Schema<T>, obj: T): string {
        const values = Object.values(obj);
        const nestedSchemas = schema[compiled];

        if (nestedSchemas.length) {
            /** Replace nested objects with their cached IDs */
            for (const {index, schema: nestedSchema} of nestedSchemas) {
                const {id} = this.obtainObjectEntry(nestedSchema, values[index]);
                values[index] = id;
            }
        }

        return values.join('|');
    }

    private createEntry<T extends Pojo>(value: T): ObjectEntry<T> {
        return {id: this.id++, value};
    }
}
