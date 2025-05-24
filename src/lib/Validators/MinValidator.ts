import { AbstractFieldOptions, ValidationResult, ValidatorFunction } from "../ValidatorFunction";

export function minValidator<T extends number>(min: number): ValidatorFunction<T> {
  return (fieldOptions: AbstractFieldOptions<T>): ValidationResult | null => {
    if (!fieldOptions.value || fieldOptions.value < min) {
      return { key: fieldOptions.path, message: "min" };
    }
    return null;
  }
}