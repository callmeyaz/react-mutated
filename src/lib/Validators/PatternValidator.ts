import { AbstractFieldOptions, ValidationResult, ValidatorFunction } from "../ValidatorFunction";

export function patternValidator<T extends string>(pattern: string): ValidatorFunction<T> {
  return (fieldOptions: AbstractFieldOptions<T>): ValidationResult | null => {
    if (!fieldOptions.value || RegExp(pattern).test(fieldOptions.value)) {
      return { key: fieldOptions.path, message: "pattern" };
    }
    return null;
  }
}