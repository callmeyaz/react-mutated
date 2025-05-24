import { AbstractFieldOptions, ValidationResult, ValidatorFunction } from "../ValidatorFunction";

export function maxValidator<T extends number>(max: number): ValidatorFunction<T> {
  return (fieldOptions: AbstractFieldOptions<T>): ValidationResult | null => {
    if (!fieldOptions.value || fieldOptions.value > max) {
      return { key: fieldOptions.path, message: "max" };
    }
    return null;
  }
}
