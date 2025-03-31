import {compiled} from "./constants.mjs";

export type Primitive = number | string | boolean | null | undefined;
export type Pojo = {
    [key: string]: Primitive | Pojo;
};

export interface SchemaDefinition<T = any> {
    [key: string]: Primitive | Schema;
}

export interface Schema<T = any> extends SchemaDefinition<T> {
    [compiled]: Array<{ index: number, schema: Schema }>
}

export type EnumLike = { [k: string]: string | number };
export type FlattenSchema<T extends SchemaDefinition> = {
    [K in keyof T]: T[K] extends Primitive ? T[K] : T[K] extends Schema<infer G> ? G : never;
};
export type UnionToIntersection<T> = (T extends any ? (x: T) => any : never) extends (x: infer R) => any
    ? R
    : never;
export type infer<T extends Schema> = T extends Schema<infer R> ? R : never;
