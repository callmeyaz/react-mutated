import { AbstractFieldOptions, ValidationResult, ValidatorFunction } from "../ValidatorFunction";

export function composeValidator<T extends Array<string>>(validators: ValidatorFunction<T>[], message: string): ValidatorFunction<T> {
  return (control: AbstractFieldOptions<T>): ValidationResult | null => {
    if (!control.value || control.value.length <= 0) {
      var result = validators.map(fn => fn(control));
      var errors = result.filter(r => r !== null);

      if (errors.length > 0) {
        return { key: control.path, message: message };
      }
    }
    return null;
  }
}