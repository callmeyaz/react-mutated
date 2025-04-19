import { getAttributeMutation, setAttributeMutated } from 'mutation-tracker';

export function getDeep<T>(obj: any, path: string): T {
    return getAttributeMutation(obj, path)
}

export function setDeep<T>(obj: any, value: T, path: string): any {
    return setAttributeMutated(obj, value, path);
}