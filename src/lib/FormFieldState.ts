
/**
 * Type represents state of a form field
 */
export type FormFieldState<T> = {
    name: string,
    touched: boolean;
    dirty: boolean,
    isValid: boolean,
    currentValue: T,
    previousValue: T,
    errors: string[];
}