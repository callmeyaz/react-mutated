import { cloneDeep, isArray, isInteger, isObject, toPath } from "lodash-es";

export function getDeep<T>(obj: any, path: string): T {
  let copy: any = cloneDeep(obj);
  let currentNode: any = copy;
  let index = 0;
  let pathList = toPath(path);

  for (; index < pathList.length - 1; index++) {
    const currentPath: string = pathList[index];
    let currentObj: any = getAttribute(obj, pathList.slice(0, index + 1));

    if (currentObj && (isObject(currentObj) || isArray(currentObj))) {
      currentNode = currentNode[currentPath] = cloneDeep(currentObj);
    } else {
      const nextPath: string = pathList[index + 1];
      currentNode = currentNode[currentPath] =
        isInteger(nextPath) && Number(nextPath) >= 0 ? [] : {};
    }
  }

  return currentNode[pathList[index]];
}

export function setDeep<T>(model: any, value: T, path: string): any {
  let copy: any = cloneDeep(model);
  let currentNode: any = copy;
  let index = 0;
  let pathList = toPath(path);

  for (; index < pathList.length - 1; index++) {
    const currentPath: string = pathList[index];
    let currentObj: any = getAttribute(model, pathList.slice(0, index + 1));

    if (currentObj && (isObject(currentObj) || Array.isArray(currentObj))) {
      currentNode = currentNode[currentPath] = cloneDeep(currentObj);
    } else {
      const nextPath: string = pathList[index + 1];
      currentNode = currentNode[currentPath] =
        isInteger(nextPath) && Number(nextPath) >= 0 ? [] : {};
    }
  }

  if ((index === 0 ? model : currentNode)[pathList[index]] === value) {
    return model;
  }

  if (value === undefined) {
    delete currentNode[pathList[index]];
  } else {
    currentNode[pathList[index]] = value;
  }

  if (index === 0 && value === undefined) {
    delete copy[pathList[index]];
  }

  return copy;
}


export function getAttribute(
  obj: any,
  key: string | string[]
): any {
  const path = toPath(key);
  var index: number = 0;

  while (obj && index < path.length) {
    obj = obj[path[index++]];
  }

  if (index !== path.length && !obj) {
    return null;
  }

  return obj === undefined ? null : obj;
}