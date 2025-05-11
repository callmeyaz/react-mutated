import { AbstractControl, ValidationResult, ValidatorFunction } from "./ValidatorFunction";


export function requiredValidator<T>(): ValidatorFunction<T> {
  return (control: AbstractControl<T>): ValidationResult | null => {
    if (control.value !== 0 && !control.value) {
      return { key: control.path, message: "required", errorCode: "0x00001" };
    }
    return null;
  }
}

export function patternValidator<T extends string>(pattern: string): ValidatorFunction<T> {
  return (control: AbstractControl<T>): ValidationResult | null => {
    if (!control.value || RegExp(pattern).test(control.value)) {
      return { key: control.path, message: "pattern", errorCode: "0x00002" };
    }
    return null;
  }
}

export function minValidator<T extends number>(min: number): ValidatorFunction<T> {
  return (control: AbstractControl<T>): ValidationResult | null => {
    if (!control.value || control.value < min) {
      return { key: control.path, message: "min", errorCode: "0x00003" };
    }
    return null;
  }
}

export function maxValidator<T extends number>(max: number): ValidatorFunction<T> {
  return (control: AbstractControl<T>): ValidationResult | null => {
    if (!control.value || control.value > max) {
      return { key: control.path, message: "max", errorCode: "0x00004" };
    }
    return null;
  }
}

export function minLengthValidator<T extends string>(minLength: number): ValidatorFunction<T> {
  return (control: AbstractControl<T>): ValidationResult | null => {
    if (!control.value || control.value.length < minLength) {
      return { key: control.path, message: "minlength", errorCode: "0x00005" };
    }
    return null;
  }
}

export function maxLengthValidator<T extends string>(maxLength: number): ValidatorFunction<T> {
  return (control: AbstractControl<T>): ValidationResult | null => {
    if (!control.value || control.value.length > maxLength) {
      return { key: control.path, message: "maxlength", errorCode: "0x00006" };
    }
    return null;
  }
}

export function rangeNumberValidator<T extends number>(min: number, max: number): ValidatorFunction<T> {
  return (control: AbstractControl<T>): ValidationResult | null => {
    if (!control.value || (control.value < min || control.value > max)) {
      return { key: control.path, message: "numberrange", errorCode: "0x00007" };
    }
    return null;
  }
}

export function rangeLengthValidator<T extends string>(minLength: number, maxLength: number): ValidatorFunction<T> {
  return (control: AbstractControl<T>): ValidationResult | null => {
    if (!control.value || (control.value.length < minLength || control.value.length > maxLength)) {
      return { key: control.path, message: "lengthrange", errorCode: "0x00008" };
    }
    return null;
  }
}

export function atleastOneItemValidator<T extends Array<string>>(): ValidatorFunction<T> {
  return (control: AbstractControl<T>): ValidationResult | null => {
    if (!control.value || control.value.length <= 0) {
      return { key: control.path, message: "atleastoneitem", errorCode: "0x00009" };
    }
    return null;
  }
}
