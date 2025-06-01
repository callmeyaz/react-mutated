import { AbstractFieldOptions, ValidationResult, ValidatorFunction } from "../ValidatorFunction";

export function rangeNumberValidator<T extends number>(min: number, max: number): ValidatorFunction<T> {
  return (fieldOptions: AbstractFieldOptions<T>): ValidationResult | null => {
    if (!fieldOptions.value || (fieldOptions.value < min || fieldOptions.value > max)) {
      return { key: fieldOptions.path, message: "numberrange" };
    }
    return null;
  }
}