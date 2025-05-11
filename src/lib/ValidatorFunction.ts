
export type AbstractFieldOptions<T> = {
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
  (fieldOptions: AbstractFieldOptions<T>): ValidationResult | null;
}
