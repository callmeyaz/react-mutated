import { AbstractFieldOptions, ValidationResult, ValidatorFunction } from "../ValidatorFunction";

export function rangeNumberValidator<T extends number>(min: number, max: number): ValidatorFunction<T> {
  return (control: AbstractFieldOptions<T>): ValidationResult | null => {
    if (!control.value || (control.value < min || control.value > max)) {
      return { key: control.path, message: "numberrange" };
    }
    return null;
  }
}