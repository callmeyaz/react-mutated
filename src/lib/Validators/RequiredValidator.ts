import { AbstractFieldOptions, ValidationResult, ValidatorFunction } from "../ValidatorFunction";


export function requiredValidator<T>(): ValidatorFunction<T> {
  return (fieldOptions: AbstractFieldOptions<T>): ValidationResult | null => {
    if (fieldOptions.value !== 0 && !fieldOptions.value) {
      return { key: fieldOptions.path, message: "required" };
    }
    return null;
  }
}