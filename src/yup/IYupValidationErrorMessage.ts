import { IValidationErrorMessage } from "../lib/types/IValidationErrorMessage";

/**
 * Yup validation error message
 */
export interface IYupValidationErrorMessage extends IValidationErrorMessage, Record<string, unknown> {
    errorCode: string
}