import { AbstractFieldOptions, ValidationResult, ValidatorFunction } from "../../ValidatorFunction";

export function hasPropertyValueValidator<T extends { [key: string]: any }>(propertyName: string, value: any): ValidatorFunction<T> {
  console.log('outter: ', propertyName, value);

  return (fieldOptions: AbstractFieldOptions<T>): ValidationResult | null => {
    console.log('inner: ', propertyName, value);

    if (fieldOptions.parent &&
      fieldOptions.parent.hasOwnProperty(propertyName) &&
      fieldOptions.parent[propertyName] === value) {
      return null;
    }
    return { key: fieldOptions.path, message: "hasproperty" };
  }
}