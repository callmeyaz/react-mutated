import { AbstractFieldOptions, ValidationResult, ValidatorFunction } from "../ValidatorFunction";

export function rangeLengthValidator<T extends string>(minLength: number, maxLength: number): ValidatorFunction<T> {
  return (control: AbstractFieldOptions<T>): ValidationResult | null => {
    if (!control.value || (control.value.length < minLength || control.value.length > maxLength)) {
      return { key: control.path, message: "lengthrange" };
    }
    return null;
  }
}