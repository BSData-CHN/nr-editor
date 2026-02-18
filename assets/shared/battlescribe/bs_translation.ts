import { forEachPairRecursive, removePrefix } from "./bs_helpers";
import { arrayKeys, Base, getDataObject } from "./bs_main";

export type Translated<T> = {
    [K in keyof T as `original_${string & K}`]: T[K];
};

export function translate(json: Record<string, any>, translations: Record<string, string>) {
    forEachPairRecursive(
        getDataObject(json),
        (value, key, obj) => {
            if (typeof value !== "string") return;
            if (value in translations) {
                obj[key] = translations[value];
                obj[`original_${key}`] = value;
            }
        },
        (obj, key) => {
            if (!arrayKeys.has(key)) return false;
            return true;
        },
    );
}

export function untranslate(json: Record<string, any>) {
    forEachPairRecursive(
        getDataObject(json),
        (value, key, obj) => {
            if (key.startsWith("original_")) {
                const actualKey = removePrefix(key, "original_");
                obj[actualKey] = value;
                delete obj[key];
            }
        },
        (obj, key) => {
            if (!arrayKeys.has(key)) return false;
            if (!(obj instanceof Base)) return false;
            return true;
        },
    );
}

export function getOriginalText<T extends Record<string, any>, KT extends string>(obj: T, key: KT): T[KT] {
    return obj[`original_${key}`] ?? obj[key]
}