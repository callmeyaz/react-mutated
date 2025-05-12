import { AbstractFieldOptions, ValidationResult, ValidatorFunction } from "./ValidatorFunction";


export function requiredValidator<T>(): ValidatorFunction<T> {
  return (fieldOptions: AbstractFieldOptions<T>): ValidationResult | null => {
    if (fieldOptions.value !== 0 && !fieldOptions.value) {
      return { key: fieldOptions.path, message: "required" };
    }
    return null;
  }
}

export function requiredTrueValidator<T>(): ValidatorFunction<T> {
  return (fieldOptions: AbstractFieldOptions<T>): ValidationResult | null => {
    if (fieldOptions.value === true) {
      return { key: fieldOptions.path, message: "requiredTrue" };
    }
    return null;
  }
}

export function patternValidator<T extends string>(pattern: string): ValidatorFunction<T> {
  return (fieldOptions: AbstractFieldOptions<T>): ValidationResult | null => {
    if (!fieldOptions.value || RegExp(pattern).test(fieldOptions.value)) {
      return { key: fieldOptions.path, message: "pattern" };
    }
    return null;
  }
}

export function minValidator<T extends number>(min: number): ValidatorFunction<T> {
  return (fieldOptions: AbstractFieldOptions<T>): ValidationResult | null => {
    if (!fieldOptions.value || fieldOptions.value < min) {
      return { key: fieldOptions.path, message: "min" };
    }
    return null;
  }
}

export function maxValidator<T extends number>(max: number): ValidatorFunction<T> {
  return (fieldOptions: AbstractFieldOptions<T>): ValidationResult | null => {
    if (!fieldOptions.value || fieldOptions.value > max) {
      return { key: fieldOptions.path, message: "max" };
    }
    return null;
  }
}

export function minLengthValidator<T extends string>(minLength: number): ValidatorFunction<T> {
  return (fieldOptions: AbstractFieldOptions<T>): ValidationResult | null => {
    if (!fieldOptions.value || fieldOptions.value.length < minLength) {
      return { key: fieldOptions.path, message: "minLength" };
    }
    return null;
  }
}

export function maxLengthValidator<T extends string>(maxLength: number): ValidatorFunction<T> {
  return (fieldOptions: AbstractFieldOptions<T>): ValidationResult | null => {
    if (!fieldOptions.value || fieldOptions.value.length > maxLength) {
      return { key: fieldOptions.path, message: "maxLength" };
    }
    return null;
  }
}

export function rangeNumberValidator<T extends number>(min: number, max: number): ValidatorFunction<T> {
  return (control: AbstractFieldOptions<T>): ValidationResult | null => {
    if (!control.value || (control.value < min || control.value > max)) {
      return { key: control.path, message: "numberrange" };
    }
    return null;
  }
}

export function rangeLengthValidator<T extends string>(minLength: number, maxLength: number): ValidatorFunction<T> {
  return (control: AbstractFieldOptions<T>): ValidationResult | null => {
    if (!control.value || (control.value.length < minLength || control.value.length > maxLength)) {
      return { key: control.path, message: "lengthrange" };
    }
    return null;
  }
}

export function atleastOneItemValidator<T extends Array<string>>(): ValidatorFunction<T> {
  return (control: AbstractFieldOptions<T>): ValidationResult | null => {
    if (!control.value || control.value.length <= 0) {
      return { key: control.path, message: "atleastoneitem" };
    }
    return null;
  }
}

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