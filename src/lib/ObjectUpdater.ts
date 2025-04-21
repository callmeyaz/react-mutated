import { isObject } from 'lodash';
import { getAttributeMutation, setAttributeMutated } from 'mutation-tracker';

export function getDeep<T>(obj: any, path: string): T {
  return getAttributeMutation(obj, path)
}

export function setDeep<T>(obj: any, value: T, path: string): any {
  return setAttributeMutated(obj, value, path);
}

export function flattenObject(obj: any, separator: string) {

  function recursive(current: any, parentKey: string = '', separator: string = ".") {
    const result = {};

    for (const key in current) {
      if (current.hasOwnProperty(key)) {
        const newKey = parentKey ? parentKey + separator + key : key;
        if (isObject(current[key]) && current[key] !== null) {
          Object.assign(result, recursive(current[key], newKey, separator));
        } else {
          (result as any)[newKey] = current[key];
        }
      }
    }

    return result;
  }

  return recursive(obj, '', separator);
}

export function flattenObjectToArray(obj: any, separator: string) {
  const result: { key: string, value: any }[] = [];

  function recurse(current: any, parentKey: string = '', separator: string = ".") {
    for (const key in current) {
      if (current.hasOwnProperty(key)) {
        const newKey = parentKey ? `${parentKey}.${key}` : key;

        if (isObject(current[key]) && current[key] !== null) {
          recurse(current[key], newKey, separator);
        } else {
          result.push({ key: newKey, value: current[key] });
        }
      }
    }
  }

  recurse(obj, '', separator);
  return result;
}
