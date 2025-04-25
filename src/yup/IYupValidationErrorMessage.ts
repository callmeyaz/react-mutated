import { IValidationMessage } from "form-runner";

/**
 * Yup validation error message
 */
export interface IYupValidationErrorMessage extends IValidationMessage, Record<string, unknown> {
    errorCode: string
}