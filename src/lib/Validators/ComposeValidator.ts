import { AbstractFieldOptions, ValidationResult, ValidatorFunction } from "../ValidatorFunction";

export function composeValidator<T extends Array<string>>(validators: ValidatorFunction<T>[], message: string): ValidatorFunction<T> {
  return (fieldOptions: AbstractFieldOptions<T>): ValidationResult | null => {
    if (!fieldOptions.value || fieldOptions.value.length <= 0) {
      var result = validators.map(fn => fn(fieldOptions));
      var errors = result.filter(r => r !== null);

      if (errors.length > 0) {
        return { key: fieldOptions.path, message: message };
      }
    }
    return null;
  }
}