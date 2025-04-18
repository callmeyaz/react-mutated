import { IValidationErrorMessage } from "../lib/IValidationErrorMessage";

/**
 * Yup validation error message
 */
export interface IYupValidationErrorMessage extends IValidationErrorMessage, Record<string, unknown> {
    errorCode: string
}