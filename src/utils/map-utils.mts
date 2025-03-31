interface AbstractMap<K, V> {
    get(key: K): V | undefined;
    set(key: K, value: V): void;
}

export const MapUtils = {
    getOrSet<K, V>(map: AbstractMap<K, V>, key: K, getValue: () => V): V {
        let value = map.get(key);

        if (value === undefined) {
            value = getValue();
            map.set(key, value);
        }

        return value;
    },
};
