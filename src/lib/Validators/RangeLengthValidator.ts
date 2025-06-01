import { AbstractFieldOptions, ValidationResult, ValidatorFunction } from "../ValidatorFunction";

export function rangeLengthValidator<T extends string>(minLength: number, maxLength: number): ValidatorFunction<T> {
  return (fieldOptions: AbstractFieldOptions<T>): ValidationResult | null => {
    if (!fieldOptions.value || (fieldOptions.value.length < minLength || fieldOptions.value.length > maxLength)) {
      return { key: fieldOptions.path, message: "lengthrange" };
    }
    return null;
  }
}