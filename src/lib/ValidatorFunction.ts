
export type AbstractControl<T> = {
  path: string,
  value: T,
  parent: any
};

export interface ValidationResult {
  key: string,
  message: string,
  errorCode: string
}

export interface ValidatorFunction<T> {
  (control: AbstractControl<T>): ValidationResult | null;
}
