
/**
 * Type represents state of a form field
 */
export type FormFieldState<T, E> = {
    name: string,
    isFieldTouched: boolean;
    currentValue: T,
    previousValue: T,
    fieldError: E | null;
}