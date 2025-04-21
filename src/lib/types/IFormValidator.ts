import { IValidationErrorMessage } from "./IValidationErrorMessage";

/**
 * interface for form validation
 */
export interface IFormValidator<M extends IValidationErrorMessage> {
    validate: (data: any) => Promise<M[]>;
}