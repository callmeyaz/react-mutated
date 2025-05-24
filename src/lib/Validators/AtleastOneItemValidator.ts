import { AbstractFieldOptions, ValidationResult, ValidatorFunction } from "../ValidatorFunction";

export function atleastOneItemValidator<T extends Array<string>>(): ValidatorFunction<T> {
  return (control: AbstractFieldOptions<T>): ValidationResult | null => {
    if (!control.value || control.value.length <= 0) {
      return { key: control.path, message: "atleastoneitem" };
    }
    return null;
  }
}