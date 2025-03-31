import {compiled} from "./constants.mts";
import type {
    EnumLike,
    FlattenSchema,
    Primitive,
    Schema,
    SchemaDefinition,
    UnionToIntersection,
} from "./types.mts";

const Schema = {
    number(defaultValue = 0): number {
        return defaultValue;
    },

    string(defaultValue = ''): string {
        return defaultValue
    },

    boolean(defaultValue = false): boolean {
        return defaultValue
    },

    constant<T extends Primitive>(val: T): T {
        return val;
    },

    enumerable<T extends EnumLike>(val: T, defaultVal?: T): T[keyof T] {
        return defaultVal as any
    },

    nullable<T extends Primitive>(type: T, defaultVal?: T): T | null {
        return defaultVal || null
    },

    optional<T extends Primitive>(type: T, defaultVal?: T): T | undefined {
        return defaultVal || undefined;
    },

    create<T extends SchemaDefinition>(definition: T): Schema<FlattenSchema<T>> {
        const values = Object.values(definition);
        const nestedSchemas: Schema[typeof compiled] = [];

        for (let i = 0; i < values.length; i++) {
            const value = values[i];

            if (value && typeof value === 'object' && value[compiled]) {
                nestedSchemas.push({index: i, schema: value});
            }
        }

        return {...definition, [compiled]: nestedSchemas};
    },

    intersection<T extends Schema[]>(
        ...schemas: T
    ): T extends Schema<infer G>[] ? Schema<UnionToIntersection<G>> : never {
        const schema = {};

        for (const sch of schemas) {
            Object.assign(schema, sch);
        }

        return Schema.create(schema) as any;
    }
}

export type {infer} from './types.mts';
export const {
    number,
    string,
    boolean,
    constant,
    enumerable,
    nullable,
    optional,
    create,
    intersection
} = Schema