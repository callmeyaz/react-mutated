import { AbstractFieldOptions, ValidationResult, ValidatorFunction } from "../ValidatorFunction";


export function requiredTrueValidator<T>(): ValidatorFunction<T> {
  return (fieldOptions: AbstractFieldOptions<T>): ValidationResult | null => {
    if (fieldOptions.value === true) {
      return { key: fieldOptions.path, message: "requiredTrue" };
    }
    return null;
  }
}