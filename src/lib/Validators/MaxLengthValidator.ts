import { AbstractFieldOptions, ValidationResult, ValidatorFunction } from "../ValidatorFunction";

export function maxLengthValidator<T extends string>(maxLength: number): ValidatorFunction<T> {
  return (fieldOptions: AbstractFieldOptions<T>): ValidationResult | null => {
    if (!fieldOptions.value || fieldOptions.value.length > maxLength) {
      return { key: fieldOptions.path, message: "maxLength" };
    }
    return null;
  }
}