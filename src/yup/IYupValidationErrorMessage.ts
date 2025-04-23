import { IValidationErrorMessage } from "form-runner";

/**
 * Yup validation error message
 */
export interface IYupValidationErrorMessage extends IValidationErrorMessage, Record<string, unknown> {
    errorCode: string
}