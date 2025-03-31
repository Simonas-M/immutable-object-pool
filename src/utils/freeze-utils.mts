export function deepFreeze(object: Record<string | symbol, any>) {
    const propNames = Reflect.ownKeys(object);

    for (const name of propNames) {
        const value = object[name];

        if (value && typeof value === "object") {
            deepFreeze(value);
        }
    }

    return Object.freeze(object);
}