
/**
 * Type represents state of a form field
 */
export type FormFieldState<T, E> = {
    name: string,
    touched: boolean;
    dirty: boolean,
    currentValue: T,
    previousValue: T,
    errors: E [];
}