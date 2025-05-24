import { AbstractFieldOptions, ValidationResult, ValidatorFunction } from "../ValidatorFunction";

export function minLengthValidator<T extends string>(minLength: number): ValidatorFunction<T> {
  return (fieldOptions: AbstractFieldOptions<T>): ValidationResult | null => {
    if (!fieldOptions.value || fieldOptions.value.length < minLength) {
      return { key: fieldOptions.path, message: "minLength" };
    }
    return null;
  }
}